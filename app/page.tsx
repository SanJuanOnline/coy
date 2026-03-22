"use client";

import Link from "next/link";
import { useTheme } from "@/lib/ThemeContext";

export default function HomePage() {
  const { theme } = useTheme();
  
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      position: "relative",
      overflow: "hidden",
      background: theme === "dark" 
        ? "linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08), rgba(59, 130, 246, 0.08))" 
        : "linear-gradient(135deg, rgba(236, 72, 153, 0.08), rgba(168, 85, 247, 0.08), rgba(59, 130, 246, 0.08))"
    }}>
      
      {/* Background blobs */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(236, 72, 153, 0.15), transparent)",
        filter: "blur(80px)"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-10%",
        left: "-5%",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent)",
        filter: "blur(80px)"
      }} />

      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "36rem" }}>
        
        {/* Logo */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              inset: "-8px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)",
              filter: "blur(20px)",
              opacity: 0.6
            }} />
            <div style={{
              width: "96px",
              height: "96px",
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 900,
              fontSize: "1.5rem",
              letterSpacing: "-0.025em",
              background: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)",
              boxShadow: "0 10px 30px rgba(236, 72, 153, 0.4)",
              border: "3px solid rgba(255, 255, 255, 0.3)",
              position: "relative"
            }}>
              COY
              <span style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.1em",
                opacity: 0.9
              }}>
                FINANCE
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: "2.5rem",
          fontWeight: 900,
          marginBottom: "0.75rem",
          backgroundImage: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 30px rgba(236, 72, 153, 0.3)"
        }}>
          CRM Coy
        </h1>

        <p style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: theme === "dark" ? "#ffffff" : "#334155",
          marginBottom: "0.5rem"
        }}>
          Tu gestor financiero inteligente
        </p>

        <p style={{
          fontSize: "0.875rem",
          color: theme === "dark" ? "#cbd5e1" : "#64748b",
          marginTop: "0.5rem",
          marginBottom: "2.5rem",
          lineHeight: 1.6
        }}>
          Controla depósitos, clientes y tiendas en una sola plataforma moderna.
        </p>

        {/* CTA */}
        <Link
          href="/clientes"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "1rem 2.5rem",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "#fff",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)",
            boxShadow: "0 8px 25px rgba(236, 72, 153, 0.4)",
            textDecoration: "none",
            transition: "all 0.3s",
            border: "2px solid rgba(255, 255, 255, 0.3)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 12px 35px rgba(236, 72, 153, 0.6)";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 25px rgba(236, 72, 153, 0.4)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          🚀 Iniciar
        </Link>

        {/* Features */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "1rem",
          marginTop: "3rem"
        }}>
          {[
            { icon: "👥", text: "Clientes", color: "#ec4899" },
            { icon: "💰", text: "Depósitos", color: "#a855f7" },
            { icon: "🏪", text: "Tiendas", color: "#3b82f6" },
            { icon: "📊", text: "Reportes", color: "#ec4899" },
          ].map((f, i) => (
            <div
              key={i}
              style={{
                padding: "1.25rem",
                borderRadius: "12px",
                background: theme === "dark" ? "rgba(26, 26, 26, 0.85)" : "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(10px)",
                border: `2px solid ${f.color}`,
                boxShadow: `0 4px 15px ${f.color}40`,
                transition: "all 0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 8px 25px ${f.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = `0 4px 15px ${f.color}40`;
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{f.icon}</div>
              <div style={{
                fontSize: "0.875rem",
                fontWeight: 700,
                color: theme === "dark" ? "#ffffff" : "#0f172a"
              }}>
                {f.text}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}