"use client";

import { useTheme } from "@/lib/ThemeContext";

export default function Footer() {
  const { theme } = useTheme();
  
  return (
    <footer style={{ 
      borderTop: "2px solid rgba(236, 72, 153, 0.6)", 
      background: "linear-gradient(135deg, #ec4899, #a855f7, #3b82f6)", 
      padding: "1.25rem", 
      textAlign: "center",
      boxShadow: "0 -4px 20px rgba(236, 72, 153, 0.3)"
    }}>
      <p style={{ fontSize: "0.8125rem", fontWeight: 600, margin: 0, marginBottom: "0.5rem", color: "#ffffff" }}>
        <span style={{ fontWeight: 900, textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}>CRM Coy</span>
        <span style={{ fontWeight: 500, opacity: 0.9 }}> — Gestión financiera personal</span>
      </p>
      <p style={{ fontSize: "0.75rem", margin: 0, color: "rgba(255, 255, 255, 0.9)" }}>
        <span>© Creado por </span>
        <a href="https://enriquevargas.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", fontWeight: 700 }}>
          <span style={{ color: "#fbbf24", textShadow: "0 0 10px rgba(251, 191, 36, 0.8)" }}>Enrique</span>
          {" "}
          <span style={{ color: "#3b82f6", textShadow: "0 0 10px rgba(59, 130, 246, 0.8)" }}>Vargas</span>
        </a>
      </p>
    </footer>
  );
}
