import os

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))

OPA_URL = os.getenv("OPA_URL", "http://localhost:8181")
OPA_PACKAGE = os.getenv("OPA_PACKAGE", "guardrails/allow")

ONDEMAND_API_KEY = os.getenv("ONDEMAND_API_KEY", "")
ONDEMAND_DEFAULT_ENDPOINT = os.getenv("ONDEMAND_DEFAULT_ENDPOINT", "predefined-openai-gpt4.1-nano")

ONDEMAND_TOOL_WEB = os.getenv("ONDEMAND_TOOL_WEB", "")
ONDEMAND_TOOL_POLICY = os.getenv("ONDEMAND_TOOL_POLICY", "")
ONDEMAND_TOOL_PROVENANCE = os.getenv("ONDEMAND_TOOL_PROVENANCE", "")

AUDIT_DIR = os.getenv("AUDIT_DIR", "app/data/audits")
