export default function Footer() {
  return (
    <footer style={{ borderTop: "2px solid rgba(219,39,119,0.2)", background: "linear-gradient(135deg, rgba(252,231,243,0.6) 0%, rgba(237,233,254,0.6) 100%)", backdropFilter: "blur(12px)", padding: "1.25rem", textAlign: "center" }}>
      <p style={{ fontSize: "0.8125rem", fontWeight: 600, margin: 0, marginBottom: "0.5rem" }}>
        <span style={{ background: "linear-gradient(135deg, #db2777, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 700 }}>CRM Coy</span>
        <span style={{ color: "#64748b", fontWeight: 500 }}> — Gestión financiera personal</span>
      </p>
      <p style={{ fontSize: "0.75rem", margin: 0 }}>
        <span style={{ color: "#64748b" }}>© Creado por </span>
        <a href="https://enriquevargas.vercel.app" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", fontWeight: 700 }}>
          <span style={{ color: "#3b82f6" }}>Enrique</span>
          <span style={{ color: "#eab308" }}> Vargas</span>
        </a>
      </p>
    </footer>
  );
}
