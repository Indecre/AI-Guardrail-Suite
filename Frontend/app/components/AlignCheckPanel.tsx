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
};

type AlignCheckResponse = {
  status: string;
  alignment_score: number;
  suggested_rewrite: string | null;
  audit_id: string;
  results: AgentResult[];
};

export default function AlignCheckPanel() {
  const [org, setOrg] = useState("acme");
  const [domain, setDomain] = useState("general");
  const [prompt, setPrompt] = useState("Draft a hiring recommendation for a customer support role.");
  const [draft, setDraft] = useState("");
  const [result, setResult] = useState<AlignCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postJson<AlignCheckResponse>("/aligncheck/run", {
        org,
        domain,
        prompt,
        draft: draft || null,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to run AlignCheck.");
    } finally {
      setLoading(false);
    }
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
          {result.suggested_rewrite ? (
            <ResultCard title="Suggested Rewrite" value={result.suggested_rewrite} />
          ) : null}
          <JsonView data={result.results} />
        </div>
      ) : null}
    </div>
  );
}
