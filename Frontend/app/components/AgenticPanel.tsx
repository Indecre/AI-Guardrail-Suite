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
  flags?: string[];
};

type AgenticResponse = {
  misalignment_risk: number;
  audit_id: string;
  results: AgentResult[];
};

type AgenticView = AgenticResponse & {
  stats: {
    risk_factor: number;
    autonomy: number;
    tool_access: number;
    data_sensitivity: number;
    guardrail_readiness: number;
  };
  scenario_mix: { label: string; value: number }[];
  mitigation: { label: string; value: number }[];
};

export default function AgenticPanel() {
  const [domain, setDomain] = useState("general");
  const [prompt, setPrompt] = useState(
    "Design an assistant that can automatically approve refunds without human review."
  );
  const [result, setResult] = useState<AgenticView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mockResult = useMemo<AgenticView>(
    () => ({
      misalignment_risk: 71,
      audit_id: "AGT-5502-FFR",
      results: [
        {
          agent: "Scenario planner",
          score: 74,
          notes: "Detected 5 high-risk failure paths involving refund abuse.",
          flags: ["autonomy escalation", "policy bypass"],
        },
        {
          agent: "Control strategist",
          score: 69,
          notes: "Requires human approval gates for refunds over $200.",
          flags: ["tool gating", "rate limiting"],
        },
        {
          agent: "Audit tracer",
          score: 82,
          notes: "Logging and provenance checks recommended for every refund action.",
          flags: ["audit trail", "evidence capture"],
        },
      ],
      stats: {
        risk_factor: 0.35,
        autonomy: 78,
        tool_access: 72,
        data_sensitivity: 64,
        guardrail_readiness: 58,
      },
      scenario_mix: [
        { label: "Low", value: 26 },
        { label: "Medium", value: 42 },
        { label: "High", value: 32 },
      ],
      mitigation: [
        { label: "Human-in-loop", value: 62 },
        { label: "Rate limits", value: 74 },
        { label: "Rollback", value: 55 },
        { label: "Audit logging", value: 83 },
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
        audit_id: `AGT-${Math.floor(2000 + Math.random() * 8000)}-${domain.toUpperCase()}`,
      });
      setLoading(false);
    }, 4000 + Math.random() * 3000);
  };

  return (
    <div className="card panel">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Agentic workflow risk simulation</h3>
          <div className="note">Scenario generation, risk scoring, and controls planning.</div>
        </div>
        {result ? <ScorePill label="Risk" value={result.misalignment_risk} /> : null}
      </div>

      <div className="form-grid two">
        <div className="form-field">
          <label>Domain</label>
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            <option value="general">General</option>
            <option value="finance">Finance</option>
            <option value="health">Health</option>
            <option value="hr">HR</option>
          </select>
        </div>
      </div>

      <div className="form-grid">
        <div className="form-field">
          <label>Prompt</label>
          <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} />
        </div>
      </div>

      <div className="panel-head">
        <button className="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Running..." : "Run Agentic Review"}
        </button>
        {error ? <div className="note">{error}</div> : null}
      </div>

      {result ? (
        <div className="result-grid">
          <ResultCard
            title="Risk Factor"
            value={`${Math.round(result.stats.risk_factor * 100)}%`}
            hint="Composite agentic risk across autonomy, tools, and sensitivity."
          />
          <ResultCard title="Audit ID" value={result.audit_id} />
          <ResultCard title="Autonomy" value={`${result.stats.autonomy}%`} />
          <ResultCard title="Tool Access" value={`${result.stats.tool_access}%`} />
          <ResultCard title="Data Sensitivity" value={`${result.stats.data_sensitivity}%`} />
          <ResultCard title="Guardrail Readiness" value={`${result.stats.guardrail_readiness}%`} />
          <div className="result-card chart-card">
            <div className="chart-title">Scenario severity mix</div>
            <div className="bar-list">
              {result.scenario_mix.map((item) => (
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
            <div className="chart-title">Mitigation readiness</div>
            <div className="bar-list">
              {result.mitigation.map((item) => (
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
          <JsonView data={result.results} />
        </div>
      ) : null}
    </div>
  );
}
