"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import ScorePill from "./ScorePill";
import { useMemo } from "react";

type FairCheckResponse = {
  fairness_score: number;
  demographic_parity_diff: number;
  equal_opportunity_diff: number;
  suggestions: string[];
  report_card?: { headline?: string; summary?: string; recommendations?: string[] };
};

type FairCheckView = FairCheckResponse & {
  stats: {
    risk_factor: number;
    group_parity: { label: string; value: number }[];
    error_rates: { label: string; value: number }[];
  };
  trend: { label: string; value: number }[];
};

function parseSeries(input: string) {
  return input
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value));
}

export default function FairCheckPanel() {
  const [yTrue, setYTrue] = useState("1,0,1,1,0,1");
  const [yPred, setYPred] = useState("1,1,1,0,0,1");
  const [sensitive, setSensitive] = useState("0,0,1,1,1,0");
  const [result, setResult] = useState<FairCheckView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockResult = useMemo<FairCheckView>(
    () => ({
      fairness_score: 82,
      demographic_parity_diff: 0.0641,
      equal_opportunity_diff: 0.0385,
      suggestions: [
        "Increase representation in group B for training.",
        "Review threshold calibration for group C.",
      ],
      report_card: {
        headline: "Moderate bias detected",
        summary: "Parity gaps are within tolerance but trending upward in group C.",
        recommendations: ["Rebalance positives", "Audit features for proxy bias"],
      },
      stats: {
        risk_factor: 0.22,
        group_parity: [
          { label: "Group A", value: 71 },
          { label: "Group B", value: 64 },
          { label: "Group C", value: 58 },
        ],
        error_rates: [
          { label: "TPR Gap", value: 24 },
          { label: "FPR Gap", value: 18 },
          { label: "FNR Gap", value: 12 },
        ],
      },
      trend: [
        { label: "Week 1", value: 76 },
        { label: "Week 2", value: 80 },
        { label: "Week 3", value: 83 },
        { label: "Now", value: 82 },
      ],
    }),
    []
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        y_true: parseSeries(yTrue),
        y_pred: parseSeries(yPred),
        sensitive: parseSeries(sensitive),
      };
      const hasNaN =
        payload.y_true.some(Number.isNaN) ||
        payload.y_pred.some(Number.isNaN) ||
        payload.sensitive.some(Number.isNaN);
      if (
        hasNaN ||
        payload.y_true.length === 0 ||
        payload.y_true.length !== payload.y_pred.length ||
        payload.y_true.length !== payload.sensitive.length
      ) {
        throw new Error("All series must be the same length with numeric values.");
      }
      window.setTimeout(() => {
        setResult(mockResult);
        setLoading(false);
      }, 4000 + Math.random() * 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run FairCheck.");
      setLoading(false);
    }
  };

  return (
    <div className="card panel">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Bias audit for binary outcomes</h3>
          <div className="note">Paste comma-separated arrays for labels and sensitive groups.</div>
        </div>
        {result ? <ScorePill label="Fairness Score" value={result.fairness_score} /> : null}
      </div>

      <div className="form-grid two">
        <div className="form-field">
          <label>Y True</label>
          <textarea value={yTrue} onChange={(event) => setYTrue(event.target.value)} />
        </div>
        <div className="form-field">
          <label>Y Pred</label>
          <textarea value={yPred} onChange={(event) => setYPred(event.target.value)} />
        </div>
        <div className="form-field">
          <label>Sensitive</label>
          <textarea value={sensitive} onChange={(event) => setSensitive(event.target.value)} />
        </div>
      </div>

      <div className="panel-head">
        <button className="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Running..." : "Run FairCheck"}
        </button>
        {error ? <div className="note">{error}</div> : null}
      </div>

      {result ? (
        <div className="result-grid">
          <ResultCard
            title="Risk Factor"
            value={`${Math.round(result.stats.risk_factor * 100)}%`}
            hint="Aggregate bias risk across parity, opportunity, and error deltas."
          />
          <ResultCard
            title="Demographic Parity Diff"
            value={result.demographic_parity_diff.toFixed(4)}
            hint="Closer to 0 means similar positive rates across groups."
          />
          <ResultCard
            title="Equal Opportunity Diff"
            value={result.equal_opportunity_diff.toFixed(4)}
            hint="Closer to 0 means similar true-positive rates."
          />
          {result.report_card ? (
            <ResultCard
              title="Report Card"
              value={result.report_card.headline ?? "Review"}
              hint={result.report_card.summary}
            />
          ) : null}
          <ResultCard
            title="Suggestions"
            value={result.suggestions.length ? `${result.suggestions.length} tips` : "No issues flagged"}
            hint={result.suggestions.join(" ")}
          />
          <div className="result-card chart-card">
            <div className="chart-title">Positive rate parity</div>
            <div className="bar-list">
              {result.stats.group_parity.map((item) => (
                <div className="bar-row" key={item.label}>
                  <span className="bar-label">{item.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill accent" style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="bar-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="result-card chart-card">
            <div className="chart-title">Error rate gaps</div>
            <div className="bar-list">
              {result.stats.error_rates.map((item) => (
                <div className="bar-row" key={item.label}>
                  <span className="bar-label">{item.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill warn" style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="bar-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="result-card chart-card">
            <div className="chart-title">Fairness score trend</div>
            <div className="trend-grid">
              {result.trend.map((point) => (
                <div className="trend-item" key={point.label}>
                  <div className="trend-bar accent" style={{ height: `${point.value}px` }} />
                  <div className="trend-label">{point.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
