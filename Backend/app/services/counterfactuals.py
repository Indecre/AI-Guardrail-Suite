from typing import Dict, List


def generate_counterfactuals(features: List[Dict], sensitive_key: str) -> List[Dict]:
    counterfactuals = []
    for row in features:
        if sensitive_key not in row:
            continue
        flipped = dict(row)
        flipped[sensitive_key] = 1 if row[sensitive_key] == 0 else 0
        counterfactuals.append(flipped)
    return counterfactuals
