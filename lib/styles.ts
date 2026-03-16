// Estilos compartidos para las páginas de ingresos, egresos y resumen

export const GRAD_ROSA_MORADO =
  "linear-gradient(135deg, #db2777 0%, #a855f7 60%, #7c3aed 100%)";

export const GRAD_MORADO_ROSA =
  "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #db2777 100%)";

// Tarjeta metálica con borde fino resplandeciente
export const cardMetalStyle = (grad: string): React.CSSProperties => ({
  background: grad,
  borderRadius: "1.25rem",
  padding: "1.75rem 2rem",
  boxShadow:
    "0 2px 0 0 rgba(255,255,255,0.2) inset, 0 10px 40px rgba(219,39,119,0.3), 0 4px 12px rgba(124,58,237,0.2)",
  border: "2px solid rgba(255,255,255,0.3)",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
});

// Brillo superior sutil
export const shineStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  height: "45%",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%)",
  borderRadius: "1.25rem 1.25rem 0 0",
  pointerEvents: "none",
};

// Botón con gradiente rosa→morado
export const btnRosaMoradoStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",
  borderRadius: "0.875rem",
  background: GRAD_ROSA_MORADO,
  color: "#fff",
  fontWeight: 700,
  fontSize: "0.9375rem",
  padding: "0.75rem 1.75rem",
  border: "2px solid rgba(255,255,255,0.25)",
  boxShadow: "0 6px 20px rgba(219,39,119,0.35), 0 2px 0 rgba(255,255,255,0.15) inset",
  cursor: "pointer",
  transition: "all 0.2s",
  letterSpacing: "0.02em",
};

// Botón con gradiente morado→rosa
export const btnMoradoRosaStyle: React.CSSProperties = {
  ...btnRosaMoradoStyle,
  background: GRAD_MORADO_ROSA,
  boxShadow: "0 6px 20px rgba(124,58,237,0.35), 0 2px 0 rgba(255,255,255,0.15) inset",
};
