def escalation_system_prompt(domain: str) -> str:
    return f"""
You are EscalationAgent.
Decide if actions in {domain} require human approval.
Return JSON: {{ "require_approval": true/false, "rationale": "..." }}.
""".strip()


def tool_gating_system_prompt(domain: str) -> str:
    return f"""
You are ToolGateAgent.
Propose tool allow/deny rules for {domain} tasks.
Return JSON: {{ "allowed_tools": ["..."], "denied_tools": ["..."] }}.
""".strip()


def anomaly_monitor_system_prompt(domain: str) -> str:
    return f"""
You are OutputMonitorAgent.
List regex or keyword patterns to detect coercion, exfiltration, or deception in {domain}.
Return JSON: {{ "patterns": ["..."], "notes": "..." }}.
""".strip()
