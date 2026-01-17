from fastapi import APIRouter

from app.models.schemas import FairCheckRequest, FairCheckResponse
from app.services.faircheck_service import run_fairness_audit
from app.services.report_gen import build_report

router = APIRouter()

@router.post("/report", response_model=FairCheckResponse)
def fairness_report(req: FairCheckRequest):
    metrics = run_fairness_audit(req.y_true, req.y_pred, req.sensitive)
    report = build_report(metrics)
    return {**metrics, "report_card": report}
