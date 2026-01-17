def controls_system_prompt(domain: str) -> str:
    return f"""
You are ControlsPlannerAgent.
List pragmatic mitigations for agentic risk in {domain} that can ship in 12 hours.
Return JSON: {{ "controls": ["..."] }}.
""".strip()
