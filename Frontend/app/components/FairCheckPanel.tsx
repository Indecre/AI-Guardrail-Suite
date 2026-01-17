"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import ScorePill from "./ScorePill";
import { postJson } from "../lib/api";

type FairCheckResponse = {
  fairness_score: number;
  demographic_parity_diff: number;
  equal_opportunity_diff: number;
  suggestions: string[];
  report_card?: { headline?: string; summary?: string; recommendations?: string[] };
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
  const [result, setResult] = useState<FairCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const data = await postJson<FairCheckResponse>("/faircheck/report", payload);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run FairCheck.");
    } finally {
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
        </div>
      ) : null}
    </div>
  );
}
