"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Overview" },
  { href: "/faircheck", label: "FairCheck" },
  { href: "/aligncheck", label: "AlignCheck" },
  { href: "/agentic", label: "Agentic" },
  { href: "/truthtrace", label: "TruthTrace" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link className="brand" href="/">
        <span className="brand-mark">AG</span>
        AI Guardrails Suite
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            className="nav-link"
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <Link className="nav-cta" href="/aligncheck">
        Run a live check
      </Link>
    </nav>
  );
}
