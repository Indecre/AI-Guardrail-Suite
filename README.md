# AI Guardrails Suite

Build guardrails for modern AI: fairness auditing, alignment checks, and provenance verification.

## Pipeline

Frontend
- Next.js app provides a unified dashboard and dedicated pages for FairCheck, AlignCheck, Agentic, and TruthTrace.
- Tabs expose a live console to run checks quickly during demos.
- Client calls backend endpoints via `NEXT_PUBLIC_API_BASE`.

Backend
- FastAPI service orchestrates OnDemand agents and local evaluators.
- Agentic pipeline runs multiple agents to score misalignment, propose mitigations, and define controls.
- AlignCheck runs OPA gating + policy/hallucination/fact-check agents + rewrite agent.
- FairCheck computes parity/EO metrics and generates a report card.
- TruthTrace handles media upload and claim verification using OnDemand tools.

Repo layout
- `Frontend/app`: Next.js app router UI.
- `Backend/app`: FastAPI API and agent orchestration.
- `Backend/app/core`: prompts, OnDemand client, OPA client.
- `Backend/app/services`: fairness reports and counterfactual helpers.
- `Backend/app/data/audits`: JSON audit logs.

## OnDemand agents/tools (6+ agents used)

Agents invoked from the backend:
- ScenarioGenAgent
- RiskScorerAgent
- ControlsPlannerAgent
- EscalationAgent
- ToolGateAgent
- OutputMonitorAgent
- PolicyAgent
- HallucinationAgent
- FactCheckAgent
- ProvenanceAgent
- RewriteAgent

Tools via OnDemand plugins (configure IDs in env):
- audit_logging_service
- fairness_counterfactual_audit
- policy_enforcer

<img width="1710" height="988" alt="image" src="https://github.com/user-attachments/assets/730ab414-508c-4fbd-8a30-74aa8fc6f672" />


## Local Development

Backend
1. `cd Backend`
2. `python -m venv .venv && .venv\Scripts\activate`
3. `pip install -r reqirements.txt`
4. `setx ONDEMAND_API_KEY "YOUR_KEY"`
5. `uvicorn app.main:app --reload --port 8000`

Frontend
1. `cd Frontend`
2. `npm install`
3. `setx NEXT_PUBLIC_API_BASE "http://localhost:8000"`
4. `npm run dev`

## Deployment

Backend
- Build container from `Backend/Dockerfile` (add a base image + uvicorn command).
- Set env vars: `ONDEMAND_API_KEY`, `OPA_URL`, `OPA_PACKAGE`.
- Expose port 8000.

Frontend
- Deploy with Vercel or any Node host.
- Set `NEXT_PUBLIC_API_BASE` to the backend URL.

## Notes

- When OnDemand is not configured, the backend uses mock responses to keep the demo flowing.
- OPA is optional for hackathon demo; if missing, AlignCheck still runs model-based agents.
