import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "AI Guardrails Suite",
  description: "Fairness, alignment, and provenance tooling for modern AI systems.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <div className="container">
            <Navbar />
            {children}
            <footer className="footer">
              <span>AI Guardrails Suite • Hackathon build</span>
              <div className="footer-links">
                <span>FastAPI</span>
                <span>Next.js</span>
                <span>OnDemand</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
