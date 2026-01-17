import AlignCheckPanel from "../components/AlignCheckPanel";

export default function AlignCheckPage() {
  return (
    <main className="panel">
      <h2 className="section-title">AlignCheck</h2>
      <p className="section-subtitle">
        Policy compliance, hallucination detection, and safe rewrites in one pass.
      </p>
      <div className="grid three">
        <div className="card">
          <h3 className="card-title">Policy agent</h3>
          <p className="card-desc">Checks org + domain rules and flags violations.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Fact + hallucination</h3>
          <p className="card-desc">Verifies claims and tags unsupported assertions.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Rewrite assistant</h3>
          <p className="card-desc">Returns safer alternatives ready for delivery.</p>
        </div>
      </div>
      <AlignCheckPanel />
    </main>
  );
}
