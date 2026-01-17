import numpy as np

def demographic_parity_diff(y_pred, s):
    y_pred = np.array(y_pred); s = np.array(s)
    p1 = y_pred[s == 1].mean() if (s == 1).any() else 0.0
    p0 = y_pred[s == 0].mean() if (s == 0).any() else 0.0
    return float(p1 - p0)

def equal_opportunity_diff(y_true, y_pred, s):
    y_true = np.array(y_true); y_pred = np.array(y_pred); s = np.array(s)

    def tpr(mask):
        pos = (y_true[mask] == 1)
        return float((y_pred[mask][pos] == 1).mean()) if pos.any() else 0.0

    return float(tpr(s == 1) - tpr(s == 0))
