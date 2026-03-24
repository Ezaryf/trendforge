"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Scan" },
  { href: "/explore", label: "Explore" },
  { href: "/compare", label: "Compare" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="nav">
      <Link href="/" className="brand">
        <span className="brand-mark" />
        TrendForge
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{ color: pathname === link.href ? "var(--text)" : "var(--muted)" }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
