import TruthTracePanel from "../components/TruthTracePanel";

export default function TruthTracePage() {
  return (
    <main className="panel">
      <h2 className="section-title">TruthTrace</h2>
      <p className="section-subtitle">
        Media provenance checks and claim verification for authenticity workflows.
      </p>
      <div className="grid three">
        <div className="card">
          <h3 className="card-title">C2PA context</h3>
          <p className="card-desc">Upload files and capture provenance metadata.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Claim verification</h3>
          <p className="card-desc">Attach sources or mark as unknown.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Audit trail</h3>
          <p className="card-desc">Persist evidence and review decisions.</p>
        </div>
      </div>
      <TruthTracePanel />
    </main>
  );
}
