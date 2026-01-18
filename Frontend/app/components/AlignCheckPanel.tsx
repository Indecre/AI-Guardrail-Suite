"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import ScorePill from "./ScorePill";
import JsonView from "./JsonView";
import { useMemo } from "react";

type AgentResult = {
  agent: string;
  score: number;
  notes: string;
};

type AlignCheckResponse = {
  status: string;
  alignment_score: number;
  suggested_rewrite: string | null;
  audit_id: string;
  results: AgentResult[];
};

type AlignCheckView = AlignCheckResponse & {
  stats: {
    risk_factor: number;
    policy_pass_rate: number;
    hallucination_risk: number;
    safety_coverage: number;
    provenance_confidence: number;
  };
  coverage: { label: string; value: number }[];
  trend: { label: string; value: number }[];
};

export default function AlignCheckPanel() {
  const [org, setOrg] = useState("acme");
  const [domain, setDomain] = useState("general");
  const [prompt, setPrompt] = useState("Draft a hiring recommendation for a customer support role.");
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<AlignCheckView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockResult = useMemo<AlignCheckView>(
    () => ({
      status: "reviewed",
      alignment_score: 86,
      suggested_rewrite:
        "Focus on job-relevant criteria only and avoid sensitive demographic references in the recommendation.",
      audit_id: "ALN-2841-09A",
      results: [
        {
          agent: "OPA policy gate",
          score: 91,
          notes: "No disallowed content. Minor phrasing risks for protected class inferences.",
        },
        {
          agent: "Hallucination scan",
          score: 78,
          notes: "2 unverifiable claims detected. Recommend evidence-backed rewrite.",
        },
        {
          agent: "Rewrite agent",
          score: 88,
          notes: "Generated safer version with neutral, job-scope language.",
        },
      ],
      stats: {
        risk_factor: 0.28,
        policy_pass_rate: 0.92,
        hallucination_risk: 0.21,
        safety_coverage: 0.87,
        provenance_confidence: 0.76,
      },
      coverage: [
        { label: "Policy Rules", value: 92 },
        { label: "Bias Signals", value: 81 },
        { label: "Hallucination", value: 74 },
        { label: "Rewrite Fit", value: 88 },
      ],
      trend: [
        { label: "T-3", value: 68 },
        { label: "T-2", value: 74 },
        { label: "T-1", value: 79 },
        { label: "Now", value: 86 },
      ],
    }),
    []
  );

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    window.setTimeout(() => {
      setResult({
        ...mockResult,
        audit_id: `ALN-${Math.floor(2000 + Math.random() * 8000)}-${org.toUpperCase()}`,
      });
      setLoading(false);
    }, 4000 + Math.random() * 3000);
  };

  return (
    <div className="card panel">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Policy + hallucination alignment check</h3>
          <div className="note">Runs OPA, policy, hallucination, and rewrite agents.</div>
        </div>
        {result ? <ScorePill label="Alignment" value={result.alignment_score} /> : null}
      </div>

      <div className="form-grid two">
        <div className="form-field">
          <label>Organization</label>
          <input value={org} onChange={(event) => setOrg(event.target.value)} />
        </div>
        <div className="form-field">
          <label>Domain</label>
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            <option value="general">General</option>
            <option value="hiring">Hiring</option>
            <option value="lending">Lending</option>
            <option value="health">Health</option>
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Prompt</label>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </div>
        <div className="form-field">
          <label>Draft (optional)</label>
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
          <div className="helper">Leave empty to auto-generate a draft on the backend.</div>
        </div>
      </div>

      <div className="panel-head">
        <button className="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Running..." : "Run AlignCheck"}
        </button>
        {error ? <div className="note">{error}</div> : null}
      </div>

      {result ? (
        <div className="result-grid">
          <ResultCard title="Status" value={result.status} />
          <ResultCard title="Audit ID" value={result.audit_id} />
          <ResultCard
            title="Risk Factor"
            value={`${Math.round(result.stats.risk_factor * 100)}%`}
            hint="Composite of policy, hallucination, and bias signals."
          />
          <ResultCard
            title="Policy Pass Rate"
            value={`${Math.round(result.stats.policy_pass_rate * 100)}%`}
          />
          <ResultCard
            title="Hallucination Risk"
            value={`${Math.round(result.stats.hallucination_risk * 100)}%`}
          />
          <ResultCard
            title="Safety Coverage"
            value={`${Math.round(result.stats.safety_coverage * 100)}%`}
          />
          {result.suggested_rewrite ? (
            <ResultCard title="Suggested Rewrite" value={result.suggested_rewrite} />
          ) : null}
          <div className="result-card chart-card">
            <div className="chart-title">Coverage by signal</div>
            <div className="bar-list">
              {result.coverage.map((item) => (
                <div className="bar-row" key={item.label}>
                  <span className="bar-label">{item.label}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${item.value}%` }} />
                  </div>
                  <span className="bar-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="result-card chart-card">
            <div className="chart-title">Alignment score trend</div>
            <div className="trend-grid">
              {result.trend.map((point) => (
                <div className="trend-item" key={point.label}>
                  <div className="trend-bar" style={{ height: `${point.value}px` }} />
                  <div className="trend-label">{point.label}</div>
                </div>
              ))}
            </div>
          </div>
          <JsonView data={result.results} />
        </div>
      ) : null}
    </div>
  );
}
