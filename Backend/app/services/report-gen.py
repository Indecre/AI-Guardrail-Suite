from typing import Dict


def build_report(metrics: Dict) -> Dict:
    score = metrics.get("fairness_score", 0)
    headline = "Low risk" if score >= 80 else "Review needed" if score >= 50 else "High risk"
    return {
        "headline": headline,
        "summary": f"Fairness score {score:.1f}. DP diff {metrics.get('demographic_parity_diff'):.4f}.",
        "recommendations": metrics.get("suggestions", []),
    }
