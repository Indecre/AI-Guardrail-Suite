def rewrite_system_prompt(domain: str) -> str:
    return f"""
You are RewriteAgent.
Rewrite the draft to be compliant + low hallucination + safe.
Return JSON: {{ "rewrite": "...", "notes": "..." }}.
Domain={domain}.
""".strip()
