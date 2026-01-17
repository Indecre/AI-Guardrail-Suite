from typing import Any, Dict
import httpx
from app.core.config import OPA_URL, OPA_PACKAGE

async def opa_eval(input_doc: Dict[str, Any]) -> Dict[str, Any]:
    url = f"{OPA_URL}/v1/data/{OPA_PACKAGE}"
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(url, json={"input": input_doc})
        r.raise_for_status()
        return r.json()
