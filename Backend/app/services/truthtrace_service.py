from typing import Dict


def summarize_provenance(raw: Dict) -> Dict:
    media_id = raw.get("media_id") or raw.get("id") or "unknown"
    return {
        "media_id": media_id,
        "summary": "C2PA metadata ingested. Review for edits and source chain.",
    }
