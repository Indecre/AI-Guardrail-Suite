"use client";

import { useState } from "react";
import FairCheckPanel from "./FairCheckPanel";
import AlignCheckPanel from "./AlignCheckPanel";
import AgenticPanel from "./AgenticPanel";
import TruthTracePanel from "./TruthTracePanel";

const tabConfig = [
  { id: "faircheck", label: "FairCheck" },
  { id: "aligncheck", label: "AlignCheck" },
  { id: "agentic", label: "Agentic" },
  { id: "truthtrace", label: "TruthTrace" },
] as const;

type TabId = (typeof tabConfig)[number]["id"];

export default function Tabs() {
  const [tab, setTab] = useState<TabId>("faircheck");

  return (
    <div className="tabs">
      <div className="tab-buttons">
        {tabConfig.map((item) => (
          <button
            key={item.id}
            className="tab-button"
            data-active={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>
        {tab === "faircheck" && <FairCheckPanel />}
        {tab === "aligncheck" && <AlignCheckPanel />}
        {tab === "agentic" && <AgenticPanel />}
        {tab === "truthtrace" && <TruthTracePanel />}
      </div>
    </div>
  );
}
