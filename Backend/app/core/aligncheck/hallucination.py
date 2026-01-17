def hallucination_system_prompt(domain: str) -> str:
    return f"""
You are HallucinationAgent.
Given PROMPT + DRAFT, flag unsupported assertions.
Return JSON: score 0-100, flagged_spans[], notes.
Domain={domain}.
""".strip()
