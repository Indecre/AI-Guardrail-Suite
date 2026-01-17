type ResultCardProps = {
  title: string;
  value: string | number;
  hint?: string;
};

export default function ResultCard({ title, value, hint }: ResultCardProps) {
  return (
    <div className="result-card">
      <div className="card-title">{title}</div>
      <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>{value}</div>
      {hint ? <div className="note">{hint}</div> : null}
    </div>
  );
}
