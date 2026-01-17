"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import ScorePill from "./ScorePill";
import JsonView from "./JsonView";
import { postJson } from "../lib/api";

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

export default function AgenticPanel() {
  const [domain, setDomain] = useState("general");
  const [prompt, setPrompt] = useState(
    "Design an assistant that can automatically approve refunds without human review."
  );
  const [result, setResult] = useState<AgenticResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postJson<AgenticResponse>("/agentic/run", {
        domain,
        prompt,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run Agentic review.");
    } finally {
      setLoading(false);
    }
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
          <ResultCard title="Audit ID" value={result.audit_id} />
          <JsonView data={result.results} />
        </div>
      ) : null}
    </div>
  );
}
