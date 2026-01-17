import json
import uuid

from fastapi import APIRouter

from app.core.agentic.battery import scenario_system_prompt
from app.core.agentic.controls import controls_system_prompt
from app.core.agentic.logger import write_audit
from app.core.agentic.mitigations import (
    anomaly_monitor_system_prompt,
    escalation_system_prompt,
    tool_gating_system_prompt,
)
from app.core.agentic.risk_scorer import risk_scorer_system_prompt
from app.core.ondemand_client import OnDemandClient
from app.models.schemas import AgenticRequest, AgenticResponse, AgentResult, SpanFlag

router = APIRouter()
od = OnDemandClient()


def safe_json(output: str) -> dict:
    try:
        return json.loads(output)
    except Exception:
        return {}


@router.post("/run", response_model=AgenticResponse)
async def run_agentic(req: AgenticRequest):
    audit_id = str(uuid.uuid4())

    scenarios = await od.chat(scenario_system_prompt(req.domain), req.prompt)
    scenarios_text = scenarios.get("output") or str(scenarios)

    score = await od.chat(
        risk_scorer_system_prompt(req.domain),
        f"USER_PROMPT:\n{req.prompt}\n\nSCENARIOS:\n{scenarios_text}"
    )
    score_text = score.get("output") or str(score)
    score_json = safe_json(score_text)

    controls = await od.chat(
        controls_system_prompt(req.domain),
        f"USER_PROMPT:\n{req.prompt}\n\nRISK_ESTIMATE:\n{score_text}"
    )
    controls_text = controls.get("output") or str(controls)

    escalation = await od.chat(
        escalation_system_prompt(req.domain),
        f"USER_PROMPT:\n{req.prompt}\n\nRISK_ESTIMATE:\n{score_text}"
    )
    escalation_text = escalation.get("output") or str(escalation)

    tool_gate = await od.chat(
        tool_gating_system_prompt(req.domain),
        f"USER_PROMPT:\n{req.prompt}\n\nRISK_ESTIMATE:\n{score_text}"
    )
    tool_gate_text = tool_gate.get("output") or str(tool_gate)

    monitor = await od.chat(
        anomaly_monitor_system_prompt(req.domain),
        f"USER_PROMPT:\n{req.prompt}\n\nRISK_ESTIMATE:\n{score_text}"
    )
    monitor_text = monitor.get("output") or str(monitor)

    # Hackathon-safe numeric score fallback
    misalignment_risk = float(score_json.get("risk_score", 60.0))

    results = [
        AgentResult(agent="ScenarioGenAgent", score=0, notes=scenarios_text),
        AgentResult(agent="RiskScorerAgent", score=misalignment_risk, notes=score_text, flags=[]),
        AgentResult(agent="ControlsPlannerAgent", score=0, notes=controls_text),
        AgentResult(agent="EscalationAgent", score=0, notes=escalation_text),
        AgentResult(agent="ToolGateAgent", score=0, notes=tool_gate_text),
        AgentResult(agent="OutputMonitorAgent", score=0, notes=monitor_text),
    ]

    write_audit(audit_id, {"type": "agentic", "prompt": req.prompt, "results": [r.model_dump() for r in results]})

    return AgenticResponse(misalignment_risk=misalignment_risk, results=results, audit_id=audit_id)
