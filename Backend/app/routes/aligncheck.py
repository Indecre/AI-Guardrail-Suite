import json
import uuid

from fastapi import APIRouter, File, UploadFile

from app.core.aligncheck.hallucination import hallucination_system_prompt
from app.core.aligncheck.opa_client import opa_eval
from app.core.aligncheck.policy_fallback import policy_system_prompt
from app.core.aligncheck.rewrite import rewrite_system_prompt
from app.core.config import ONDEMAND_TOOL_POLICY, ONDEMAND_TOOL_PROVENANCE, ONDEMAND_TOOL_WEB
from app.core.ondemand_client import OnDemandClient
from app.core.agentic.logger import write_audit
from app.models.schemas import AlignCheckRequest, AlignCheckResponse, AgentResult, SpanFlag

router = APIRouter()
od = OnDemandClient()


def safe_json(output: str) -> dict:
    try:
        return json.loads(output)
    except Exception:
        return {}


# ---- Custom tools (3+) for agents to "use" via your orchestrator logic ----
@router.post("/tools/policy_lookup")
async def tool_policy_lookup(payload: dict):
    org = payload.get("org", "default")
    domain = payload.get("domain", "general")
    # simple hackathon store
    rules = {
        "general": ["No illegal instructions", "No personal data exfiltration"],
        "hiring": ["Do not use protected attributes for decisions", "Provide fairness disclaimer"],
        "lending": ["No discrimination", "Require explanation for adverse action"],
        "health": ["No medical diagnosis", "Encourage professional help"],
    }
    return {"org": org, "domain": domain, "rules": rules.get(domain, rules["general"])}

@router.post("/tools/web_verify")
async def tool_web_verify(payload: dict):
    claim = payload.get("claim", "")
    if ONDEMAND_TOOL_WEB:
        response = await od.chat(
            "You are WebVerifyTool. Verify the claim using sources. Return JSON: {\"verdict\":\"TRUE/FALSE/UNKNOWN\",\"sources\":[]}.",
            f"CLAIM:\n{claim}",
            plugin_ids=[ONDEMAND_TOOL_WEB],
        )
        output = response.get("output") or str(response)
        parsed = safe_json(output)
        return {
            "claim": claim,
            "verdict": parsed.get("verdict", "UNKNOWN"),
            "sources": parsed.get("sources", []),
            "raw": output,
        }
    return {"claim": claim, "verdict": "UNKNOWN", "sources": []}

@router.post("/tools/action_gate")
async def tool_action_gate(payload: dict):
    action = payload.get("action", "")
    risk = float(payload.get("risk_score", 0))
    if risk >= 80:
        return {"decision": "DENY", "action": action}
    if risk >= 60:
        return {"decision": "REQUIRE_APPROVAL", "action": action}
    return {"decision": "ALLOW", "action": action}


@router.post("/media/upload")
async def upload_media(file: UploadFile = File(...)):
    data = await file.read()
    out = await od.media_upload(file.filename, file.content_type or "application/octet-stream", data)
    media_id = out.get("media_id") or out.get("id") or "unknown"
    return {"media_context_id": media_id, "raw": out}


@router.post("/run", response_model=AlignCheckResponse)
async def run_aligncheck(req: AlignCheckRequest):
    audit_id = str(uuid.uuid4())

    draft = req.draft or f"Answer the user safely:\n{req.prompt}"

    # 1) OPA eval first (hard policy gate)
    opa_input = {"org": req.org, "domain": req.domain, "prompt": req.prompt, "draft": draft}
    opa_out = {}
    try:
        opa_out = await opa_eval(opa_input)
    except Exception as e:
        opa_out = {"error": str(e)}

    # 2) PolicyAgent (Chat)
    policy = await od.chat(
        policy_system_prompt(req.org, req.domain),
        f"PROMPT:\n{req.prompt}\n\nDRAFT:\n{draft}",
        plugin_ids=[ONDEMAND_TOOL_POLICY],
    )
    policy_text = policy.get("output") or str(policy)
    policy_json = safe_json(policy_text)

    # 3) HallucinationAgent (Chat)
    halluc = await od.chat(hallucination_system_prompt(req.domain), f"PROMPT:\n{req.prompt}\n\nDRAFT:\n{draft}")
    halluc_text = halluc.get("output") or str(halluc)
    halluc_json = safe_json(halluc_text)

    # 4) FactCheckAgent (Chat with tool)
    fact = await od.chat(
        "You are FactCheckAgent. Verify claims with citations. Return JSON: {\"score\":0-100,\"sources\":[],\"flagged_spans\":[]}.",
        f"PROMPT:\n{req.prompt}\n\nDRAFT:\n{draft}",
        plugin_ids=[ONDEMAND_TOOL_WEB],
    )
    fact_text = fact.get("output") or str(fact)
    fact_json = safe_json(fact_text)

    # 5) ProvenanceAgent (Chat with tool)
    provenance = await od.chat(
        "You are ProvenanceAgent. Inspect media provenance notes if provided. Return JSON: {\"score\":0-100,\"flags\":[]}.",
        "No media context provided.",
        plugin_ids=[ONDEMAND_TOOL_PROVENANCE],
    )
    provenance_text = provenance.get("output") or str(provenance)
    provenance_json = safe_json(provenance_text)

    # 6) RewriteAgent (Chat)
    rewrite = await od.chat(rewrite_system_prompt(req.domain), f"PROMPT:\n{req.prompt}\n\nDRAFT:\n{draft}\n\nPOLICY:\n{policy_text}\n\nHALLUC:\n{halluc_text}")
    rewrite_text = rewrite.get("output") or str(rewrite)

    # 5) Simple scoring + status (hackathon safe)
    scores = [
        float(policy_json.get("score", 75)),
        float(halluc_json.get("score", 75)),
        float(fact_json.get("score", 75)),
        float(provenance_json.get("score", 80)),
    ]
    alignment_score = sum(scores) / len(scores)
    status = "SAFE" if alignment_score >= 80 else "REVIEW" if alignment_score >= 60 else "BLOCK"
    suggested_rewrite = safe_json(rewrite_text).get("rewrite")
    flagged_spans = [
        SpanFlag(span=span, reason="policy") for span in policy_json.get("flagged_spans", [])
    ] + [
        SpanFlag(span=span, reason="hallucination")
        for span in halluc_json.get("flagged_spans", [])
    ]

    results = [
        AgentResult(agent="OPA", score=0, notes=str(opa_out)),
        AgentResult(agent="PolicyAgent", score=scores[0], notes=policy_text, flags=flagged_spans),
        AgentResult(agent="HallucinationAgent", score=scores[1], notes=halluc_text, flags=flagged_spans),
        AgentResult(agent="FactCheckAgent", score=scores[2], notes=fact_text),
        AgentResult(agent="ProvenanceAgent", score=scores[3], notes=provenance_text),
        AgentResult(agent="RewriteAgent", score=0, notes=rewrite_text),
    ]

    write_audit(audit_id, {"type": "aligncheck", "req": req.model_dump(), "results": [r.model_dump() for r in results]})
    return AlignCheckResponse(
        status=status,
        alignment_score=alignment_score,
        results=results,
        suggested_rewrite=suggested_rewrite,
        audit_id=audit_id,
    )
