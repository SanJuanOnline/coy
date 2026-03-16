"use client";

import { useState, useMemo } from "react";
import { useCrmData } from "@/lib/useCrmData";
import { getSaldoActual } from "@/lib/types";
import { cardMetalStyle, shineStyle, btnMoradoRosaStyle, GRAD_MORADO_ROSA } from "@/lib/styles";
import Swal from "sweetalert2";
import {
  TextField, Paper, Typography, Box,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}
function fmtFecha(f: string) {
  return new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function EgresosPage() {
  const { data, addEgreso, deleteEgreso, limiteAlcanzado, isLoading } = useCrmData();

  const [concepto,    setConcepto]    = useState("");
  const [monto,       setMonto]       = useState("");
  const [fecha,       setFecha]       = useState(() => new Date().toISOString().slice(0, 10));
  const [comentarios, setComentarios] = useState("");
  const [saving,      setSaving]      = useState(false);

  const saldo        = useMemo(() => getSaldoActual(data), [data]);
  const totalEgresos = useMemo(() => data.egresos.reduce((s, e) => s + e.monto, 0), [data.egresos]);
  const sorted       = [...data.egresos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(monto.replace(/,/g, "."));
    if (!concepto.trim() || Number.isNaN(num) || num <= 0 || !fecha) return;
    setSaving(true);
    const ok = await addEgreso({ concepto: concepto.trim(), monto: num, fecha, comentarios: comentarios.trim() });
    setSaving(false);
    if (!ok) { Swal.fire({ icon: "error", title: "Error", text: "Límite de registros alcanzado." }); return; }
    setConcepto(""); setMonto(""); setComentarios("");
    setFecha(new Date().toISOString().slice(0, 10));
    Swal.fire({ icon: "success", title: "¡Tienda registrado!", timer: 2000, showConfirmButton: false, timerProgressBar: true });
  };

  const handleDelete = async (id: string) => {
    const r = await Swal.fire({ title: "¿Eliminar Tienda?", icon: "warning", showCancelButton: true, confirmButtonText: "Eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#7c3aed" });
    if (r.isConfirmed) { await deleteEgreso(id); Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false }); }
  };

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 2, py: 4 }}>

      {/* Tarjetas metálicas */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 4 }}>
        <div style={{ ...cardMetalStyle(GRAD_MORADO_ROSA) }}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <AccountBalanceWalletIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Saldo actual</span>
          </div>
          <div style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{fmt(saldo)}</div>
        </div>
        <div style={{ ...cardMetalStyle("linear-gradient(135deg, #6d28d9 0%, #a855f7 50%, #db2777 100%)") }}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <TrendingUpIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Total Tiendas</span>
          </div>
          <div style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>-{fmt(totalEgresos)}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{data.egresos.length} registros</div>
        </div>
      </Box>

      {/* Formulario */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1.5px solid #e9d5ff", mb: 4, background: "#fff" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}>Nuevo Tienda / Deposito</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="Concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Ej. Pago proveedor..." size="small" fullWidth required />
          <TextField label="Monto (MXN)" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" size="small" fullWidth required inputProps={{ inputMode: "decimal" }} />
          <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} size="small" fullWidth required InputLabelProps={{ shrink: true }} />
          <TextField label="Comentarios (opcional)" value={comentarios} onChange={(e) => setComentarios(e.target.value)} placeholder="Notas..." size="small" fullWidth />
          <Box sx={{ gridColumn: { sm: "span 2" } }}>
            <button
              type="submit"
              disabled={limiteAlcanzado || saving}
              style={{ ...btnMoradoRosaStyle, opacity: (limiteAlcanzado || saving) ? 0.55 : 1 }}
              onMouseEnter={(e) => { if (!saving) { (e.currentTarget.style.opacity = "0.88"); (e.currentTarget.style.transform = "translateY(-1px)"); } }}
              onMouseLeave={(e) => { (e.currentTarget.style.opacity = "1"); (e.currentTarget.style.transform = "none"); }}
            >
              {saving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AddCircleOutlineIcon style={{ fontSize: 18 }} />}
              {saving ? "Guardando..." : "Agregar Tienda"}
            </button>
          </Box>
        </Box>
      </Paper>

      {/* Tabla */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}>Historial de Tiendas</Typography>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#7c3aed" }} /></Box>
      ) : sorted.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1.5px dashed #e9d5ff" }}>
          <Typography sx={{ color: "#475569" }}>No hay tindas registradas.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1.5px solid #e9d5ff" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(90deg,#ede9fe,#fce7f3)" }}>
                {["Concepto","Comentarios","Fecha","Monto",""].map((h, i) => (
                  <TableCell key={i} align={i >= 3 ? "right" : "left"}
                    sx={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#db2777",
                      display: i === 1 ? { xs: "none", md: "table-cell" } : i === 2 ? { xs: "none", sm: "table-cell" } : "table-cell" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((e, idx) => (
                <TableRow key={e.id} hover sx={{ bgcolor: idx % 2 !== 0 ? "#fdf4ff" : "#fff" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>{e.concepto}</TableCell>
                  <TableCell sx={{ color: "#475569", display: { xs: "none", md: "table-cell" } }}>{e.comentarios || "—"}</TableCell>
                  <TableCell sx={{ color: "#475569", display: { xs: "none", sm: "table-cell" } }}>{fmtFecha(e.fecha)}</TableCell>
                  <TableCell align="right">
                    <Chip label={`-${fmt(e.monto)}`} size="small"
                      sx={{ background: "linear-gradient(90deg,#ede9fe,#fce7f3)", color: "#db2777", fontWeight: 700, border: "1px solid #fbcfe8" }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDelete(e.id)} sx={{ color: "#94a3b8", "&:hover": { color: "#7c3aed", bgcolor: "#ede9fe" } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
