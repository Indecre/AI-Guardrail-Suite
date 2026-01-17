import FairCheckPanel from "../components/FairCheckPanel";

export default function FairCheckPage() {
  return (
    <main className="panel">
      <h2 className="section-title">FairCheck</h2>
      <p className="section-subtitle">
        Automated bias audits for black-box models using parity and opportunity metrics.
      </p>
      <div className="grid three">
        <div className="card">
          <h3 className="card-title">Counterfactual probes</h3>
          <p className="card-desc">Flip sensitive attributes and observe outcome shifts.</p>
        </div>
        <div className="card">
          <h3 className="card-title">Report card</h3>
          <p className="card-desc">Actionable score plus remediation suggestions.</p>
        </div>
        <div className="card">
          <h3 className="card-title">AIF360 hooks</h3>
          <p className="card-desc">Optional deeper metrics when the toolkit is installed.</p>
        </div>
      </div>
      <FairCheckPanel />
    </main>
  );
}
