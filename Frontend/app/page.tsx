import Link from "next/link";
import Tabs from "./components/Tabs";

export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="badge">Mission control</div>
        <h1 className="hero-title">
          High-velocity guardrails for fairness, alignment, and provenance.
        </h1>
        <p className="hero-sub">
          AI Guardrails Suite unifies bias audits, policy checks, agentic risk scoring, and media
          provenance into a single workflow with real-time feedback for teams shipping AI products.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/aligncheck">
            Launch AlignCheck
          </Link>
          <Link className="button secondary" href="/faircheck">
            Explore FairCheck
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-value">6+</div>
            <div className="stat-label">OnDemand agents</div>
          </div>
          <div className="stat">
            <div className="stat-value">3</div>
            <div className="stat-label">Tool integrations</div>
          </div>
          <div className="stat">
            <div className="stat-value">24h</div>
            <div className="stat-label">Hackathon runway</div>
          </div>
        </div>
      </section>

      <section className="grid three reveal">
        <div className="card highlight">
          <h3 className="card-title">Fairness Diagnostics</h3>
          <p className="card-desc">
            Measure demographic parity and equal opportunity deltas in one pass.
          </p>
        </div>
        <div className="card">
          <h3 className="card-title">Alignment Control Room</h3>
          <p className="card-desc">
            Run OPA checks, policy agents, hallucination detection, and rewrite suggestions.
          </p>
        </div>
        <div className="card">
          <h3 className="card-title">Provenance + Verification</h3>
          <p className="card-desc">
            Upload media, extract C2PA context, and verify claims with evidence trails.
          </p>
        </div>
      </section>

      <section className="reveal delay-1">
        <h2 className="section-title">How the pipeline runs</h2>
        <p className="section-subtitle">One request, multiple agents, auditable output.</p>
        <div className="grid three">
          <div className="step">
            <div className="step-title">1. Intake + context</div>
            <div className="note">Prompt, draft, or media enters a risk-aware queue.</div>
          </div>
          <div className="step">
            <div className="step-title">2. Agent battery</div>
            <div className="note">Policy, hallucination, fact-check, and risk agents run in parallel.</div>
          </div>
          <div className="step">
            <div className="step-title">3. Decision layer</div>
            <div className="note">Scores trigger approvals, tool gating, and safe rewrites.</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="section-title">Live Console</h2>
        <p className="section-subtitle">Kick the tires without leaving the dashboard.</p>
        <Tabs />
      </section>
    </main>
  );
}
