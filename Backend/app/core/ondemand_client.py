# backend/app/core/ondemand_client.py

import os
from typing import Iterable, Optional

import httpx

from app.core.config import ONDEMAND_API_KEY, ONDEMAND_DEFAULT_ENDPOINT

ONDEMAND_BASE = "https://api.on-demand.io"
CHAT_BASE = f"{ONDEMAND_BASE}/chat/v1"


class OnDemandClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or ONDEMAND_API_KEY
        self.headers = {
            "Content-Type": "application/json",
            "apikey": self.api_key,
        }

    @property
    def enabled(self) -> bool:
        return bool(self.api_key)

    async def create_session(self, external_user_id: str = "guardrails-user") -> str:
        payload = {"pluginIds": [], "externalUserId": external_user_id}

        async with httpx.AsyncClient(timeout=30) as client:
            r = await client.post(f"{CHAT_BASE}/sessions", headers=self.headers, json=payload)
            r.raise_for_status()
            return r.json()["data"]["id"]

    async def query(
        self,
        session_id: str,
        prompt: str,
        endpoint_id: Optional[str] = None,
        plugin_ids: Optional[Iterable[str]] = None,
    ) -> str:
        payload = {
            "endpointId": endpoint_id or ONDEMAND_DEFAULT_ENDPOINT,
            "query": prompt,
            "pluginIds": [pid for pid in (plugin_ids or []) if pid],
            "responseMode": "sync",
        }

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{CHAT_BASE}/sessions/{session_id}/query",
                headers=self.headers,
                json=payload,
            )
            r.raise_for_status()
            data = r.json()

        return data.get("data", {}).get("output", str(data))

    async def chat(
        self,
        system_prompt: str,
        user_prompt: str,
        endpoint_id: Optional[str] = None,
        plugin_ids: Optional[Iterable[str]] = None,
    ) -> dict:
        if not self.enabled or os.getenv("ONDEMAND_MODE", "").lower() == "mock":
            return {
                "output": f"[mocked] {system_prompt}\n\n{user_prompt}",
                "meta": {"mode": "mock"},
            }

        session_id = await self.create_session()
        output = await self.query(
            session_id=session_id,
            prompt=f"{system_prompt}\n\n{user_prompt}",
            endpoint_id=endpoint_id,
            plugin_ids=plugin_ids,
        )
        return {"output": output}

    async def media_upload(self, filename: str, content_type: str, data: bytes) -> dict:
        if not self.enabled or os.getenv("ONDEMAND_MODE", "").lower() == "mock":
            return {"media_id": "mock-media", "filename": filename, "content_type": content_type}

        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(
                f"{ONDEMAND_BASE}/media/v1/upload",
                headers={"apikey": self.api_key},
                files={"file": (filename, data, content_type)},
            )
            r.raise_for_status()
            return r.json()
