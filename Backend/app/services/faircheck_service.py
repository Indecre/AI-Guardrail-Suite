from typing import Dict, List

from app.core.faircheck.basic_metrics import demographic_parity_diff, equal_opportunity_diff
from app.core.faircheck.aif360 import aif360_audit


def run_fairness_audit(y_true: List[int], y_pred: List[int], sensitive: List[int]) -> Dict:
    dp = demographic_parity_diff(y_pred, sensitive)
    eo = equal_opportunity_diff(y_true, y_pred, sensitive)

    fairness_score = 100 - (abs(dp) * 100 + abs(eo) * 100) / 2
    fairness_score = max(0, min(100, float(fairness_score)))

    suggestions = []
    if abs(dp) > 0.05:
        suggestions.append("Try reweighing or data balancing for sensitive groups.")
    if abs(eo) > 0.05:
        suggestions.append("Try threshold tuning or equalized-odds postprocessing.")

    aif = aif360_audit(y_true, y_pred, sensitive)

    return {
        "fairness_score": fairness_score,
        "demographic_parity_diff": dp,
        "equal_opportunity_diff": eo,
        "suggestions": suggestions,
        "aif360": aif,
    }
