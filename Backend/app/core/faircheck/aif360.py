from typing import Dict, List

import pandas as pd

try:
    from aif360.metrics import BinaryLabelDatasetMetric
    from aif360.datasets import BinaryLabelDataset
except Exception:
    BinaryLabelDatasetMetric = None
    BinaryLabelDataset = None


def aif360_audit(
    y_true: List[int],
    y_pred: List[int],
    sensitive: List[int],
) -> Dict[str, float]:
    if BinaryLabelDataset is None:
        return {}

    df = pd.DataFrame(
        {"label": y_pred, "sensitive": sensitive},
    )
    dataset = BinaryLabelDataset(
        favorable_label=1,
        unfavorable_label=0,
        df=df,
        label_names=["label"],
        protected_attribute_names=["sensitive"],
    )
    metric = BinaryLabelDatasetMetric(dataset, privileged_groups=[{"sensitive": 1}])
    return {
        "statistical_parity_difference": float(metric.statistical_parity_difference()),
        "disparate_impact": float(metric.disparate_impact()),
    }
