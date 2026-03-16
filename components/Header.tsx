"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, TrendingDown, TrendingUp, BarChart2, Menu, X, Wallet } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/",          label: "Inicio",    Icon: LayoutDashboard },
  { href: "/depositos", label: "Depósitos", Icon: TrendingDown },
  { href: "/tiendas",   label: "Tiendas",   Icon: TrendingUp },
  { href: "/resumen",   label: "Resumen",   Icon: BarChart2 },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ position: "fixed", insetInline: 0, top: 0, zIndex: 50, borderBottom: "2px solid rgba(219,39,119,0.2)", background: "linear-gradient(135deg, rgba(252,231,243,0.85) 0%, rgba(237,233,254,0.85) 100%)", backdropFilter: "blur(16px)", boxShadow: "0 4px 16px rgba(219,39,119,0.1)" }}>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: "0.625rem", background: "linear-gradient(135deg, #db2777, #7c3aed)", boxShadow: "0 4px 12px rgba(219,39,119,0.3)" }}>
            <Wallet style={{ width: 18, height: 18, color: "#fff" }} />
          </span>
          <span style={{ fontSize: "2rem", fontWeight: 900, color: "#7c3aed", letterSpacing: "-0.02em", fontFamily: "system-ui, -apple-system, sans-serif" }}>COY</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: "flex", alignItems: "center", gap: "0.375rem", borderRadius: "0.625rem", padding: "0.5rem 1rem",
                fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", transition: "all 0.2s",
                background: active ? "linear-gradient(135deg, #fce7f3, #ede9fe)" : "transparent",
                color: active ? "#7c3aed" : "#64748b",
                border: active ? "1.5px solid rgba(124,58,237,0.2)" : "1.5px solid transparent",
              }} onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(252,231,243,0.5)"; e.currentTarget.style.color = "#db2777"; } }}
                 onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}>
                <Icon style={{ width: 16, height: 16 }} />{label}
              </Link>
            );
          })}
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden" style={{ borderRadius: "0.625rem", padding: "0.5rem", color: "#7c3aed", background: "transparent", border: "none", cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = "rgba(252,231,243,0.5)"}
          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
          {open ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden" style={{ borderTop: "1px solid rgba(219,39,119,0.15)", background: "rgba(255,255,255,0.95)", padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {nav.map(({ href, label, Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} style={{
                display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "0.625rem", padding: "0.625rem 0.75rem",
                fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", transition: "all 0.2s",
                background: active ? "linear-gradient(135deg, #fce7f3, #ede9fe)" : "transparent",
                color: active ? "#7c3aed" : "#64748b",
                border: active ? "1.5px solid rgba(124,58,237,0.2)" : "1.5px solid transparent",
              }} onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(252,231,243,0.5)"; e.currentTarget.style.color = "#db2777"; } }}
                 onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748b"; } }}>
                <Icon style={{ width: 16, height: 16 }} />{label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
