import json
import os
from datetime import datetime

from app.core.config import AUDIT_DIR


def write_audit(audit_id: str, payload: dict) -> None:
    os.makedirs(AUDIT_DIR, exist_ok=True)
    record = {
        "audit_id": audit_id,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        **payload,
    }
    path = os.path.join(AUDIT_DIR, f"{audit_id}.json")
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(record, handle, indent=2)
