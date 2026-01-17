import AgenticPanel from "../components/AgenticPanel";

export default function AgenticPage() {
  return (
    <main className="panel">
      <h2 className="section-title">Agentic Risk Lab</h2>
      <p className="section-subtitle">
        Simulate insider-threat style risks and auto-propose controls.
      </p>
      <div className="grid three">
        <div className="card">
          <h3 className="card-title">Scenario battery</h3>
          <p className="card-desc">Blackmail, espionage, and shutdown-pressure probes.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Risk scoring</h3>
          <p className="card-desc">Quantify misalignment with drivers and severity.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Operational controls</h3>
          <p className="card-desc">Approval gates, tool policy, and anomaly checks.</p>
        </div>
      </div>
      <AgenticPanel />
    </main>
  );
}
