"use client";

type JsonViewProps = {
  data: unknown;
};

export default function JsonView({ data }: JsonViewProps) {
  return <pre className="json">{JSON.stringify(data, null, 2)}</pre>;
}
