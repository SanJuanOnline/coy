"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem", gap: "3rem" }}>

      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ position: "relative", width: 160, height: 160 }}>
          <div style={{ position: "absolute", inset: -12, borderRadius: "50%", background: "radial-gradient(circle, rgba(219,39,119,0.3) 0%, rgba(124,58,237,0.2) 50%, transparent 70%)", filter: "blur(20px)" }} />
          <div style={{
            position: "relative", width: 160, height: 160, borderRadius: "50%",
            background: "linear-gradient(135deg, #db2777 0%, #a855f7 50%, #7c3aed 100%)",
            boxShadow: "0 12px 40px rgba(219,39,119,0.4), 0 4px 12px rgba(124,58,237,0.3)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: "3px solid rgba(255,255,255,0.3)",
          }}>
            <span style={{ fontSize: "3.5rem", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.04em", lineHeight: 1, textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>COY</span>
            <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.25em", marginTop: 6 }}>Finance</span>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.75rem", fontWeight: 900, background: "linear-gradient(135deg, #db2777, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, letterSpacing: "-0.02em" }}>CRM Finanzas</p>
          <p style={{ fontSize: "0.9rem", color: "#64748b", margin: "6px 0 0", fontWeight: 500 }}>Control personal de depósitos y tiendas</p>
        </div>
      </div>

      {/* Botones */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%", maxWidth: 340 }}>
        <Link href="/depositos" style={{
          display: "block", textAlign: "center", borderRadius: "1rem", padding: "1rem 1.25rem",
          fontSize: "1rem", fontWeight: 700, color: "#fff",
          background: "linear-gradient(135deg, #db2777 0%, #a855f7 100%)",
          border: "2px solid rgba(255,255,255,0.25)",
          textDecoration: "none", transition: "all 0.2s",
          boxShadow: "0 6px 20px rgba(219,39,119,0.35), 0 2px 0 rgba(255,255,255,0.15) inset",
          letterSpacing: "0.02em",
        }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(219,39,119,0.45), 0 2px 0 rgba(255,255,255,0.15) inset"; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(219,39,119,0.35), 0 2px 0 rgba(255,255,255,0.15) inset"; }}>
          💰 &nbsp;Registrar Depósito
        </Link>
        <Link href="/tiendas" style={{
          display: "block", textAlign: "center", borderRadius: "1rem", padding: "1rem 1.25rem",
          fontSize: "1rem", fontWeight: 700, color: "#fff",
          background: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
          border: "2px solid rgba(255,255,255,0.25)",
          textDecoration: "none", transition: "all 0.2s",
          boxShadow: "0 6px 20px rgba(124,58,237,0.35), 0 2px 0 rgba(255,255,255,0.15) inset",
          letterSpacing: "0.02em",
        }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,0.45), 0 2px 0 rgba(255,255,255,0.15) inset"; }}
           onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(124,58,237,0.35), 0 2px 0 rgba(255,255,255,0.15) inset"; }}>
          🏪 &nbsp;Registrar Tienda
        </Link>
        <Link href="/resumen" style={{
          display: "block", textAlign: "center", borderRadius: "1rem", padding: "1rem 1.25rem",
          fontSize: "1rem", fontWeight: 700,
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(10px)",
          color: "#7c3aed",
          border: "2px solid rgba(124,58,237,0.3)",
          textDecoration: "none", transition: "all 0.2s",
          boxShadow: "0 4px 16px rgba(124,58,237,0.15)",
          letterSpacing: "0.02em",
        }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.9)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.5)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
           onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.7)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)"; e.currentTarget.style.transform = "none"; }}>
          📊 &nbsp;Ver Resumen
        </Link>
      </div>
    </div>
  );
}
