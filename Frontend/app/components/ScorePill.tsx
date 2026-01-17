type ScorePillProps = {
  label: string;
  value: number;
};

export default function ScorePill({ label, value }: ScorePillProps) {
  let tone = "warn";
  if (value >= 80) tone = "good";
  if (value < 50) tone = "bad";

  return (
    <span className={`pill ${tone}`}>
      {label}: {value.toFixed(1)}
    </span>
  );
}
