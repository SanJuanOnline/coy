"use client";

import { useState, useMemo } from "react";
import { useCrmData } from "@/lib/useCrmData";
import { getSaldoActual } from "@/lib/types";
import { cardMetalStyle, shineStyle, btnRosaMoradoStyle, GRAD_ROSA_MORADO } from "@/lib/styles";
import Swal from "sweetalert2";
import {
  TextField, Paper, Typography, Box,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, CircularProgress,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}
function fmtFecha(f: string) {
  return new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function IngresosPage() {
  const { data, addIngreso, deleteIngreso, limiteAlcanzado, isLoading } = useCrmData();

  const [nombre,   setNombre]   = useState("");
  const [monto,    setMonto]    = useState("");
  const [concepto, setConcepto] = useState("");
  const [fecha,    setFecha]    = useState(() => new Date().toISOString().slice(0, 10));
  const [saving,   setSaving]   = useState(false);

  const saldo         = useMemo(() => getSaldoActual(data), [data]);
  const totalIngresos = useMemo(() => data.ingresos.reduce((s, i) => s + i.monto, 0), [data.ingresos]);
  const sorted        = [...data.ingresos].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(monto.replace(/,/g, "."));
    if (!nombre.trim() || Number.isNaN(num) || num <= 0 || !concepto.trim() || !fecha) return;
    setSaving(true);
    const ok = await addIngreso({ nombre: nombre.trim(), monto: num, concepto: concepto.trim(), fecha });
    setSaving(false);
    if (!ok) { Swal.fire({ icon: "error", title: "Error", text: "Límite de registros alcanzado." }); return; }
    setNombre(""); setMonto(""); setConcepto("");
    setFecha(new Date().toISOString().slice(0, 10));
    Swal.fire({ icon: "success", title: "¡Ingreso registrado!", timer: 2000, showConfirmButton: false, timerProgressBar: true });
  };

  const handleDelete = async (id: string) => {
    const r = await Swal.fire({ title: "¿Eliminar ingreso?", icon: "warning", showCancelButton: true, confirmButtonText: "Eliminar", cancelButtonText: "Cancelar", confirmButtonColor: "#db2777" });
    if (r.isConfirmed) { await deleteIngreso(id); Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false }); }
  };

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 2, py: 4 }}>

      {/* Tarjetas metálicas */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2, mb: 4 }}>
        <div style={{ ...cardMetalStyle(GRAD_ROSA_MORADO) }}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <AccountBalanceWalletIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Saldo actual</span>
          </div>
          <div style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{fmt(saldo)}</div>
        </div>
        <div style={{ ...cardMetalStyle("linear-gradient(135deg, #be185d 0%, #db2777 50%, #9333ea 100%)") }}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <TrendingDownIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Total depositos</span>
          </div>
          <div style={{ fontSize: "1.9rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>+{fmt(totalIngresos)}</div>
          <div style={{ fontSize: 12, opacity: 0.75, marginTop: 4 }}>{data.ingresos.length} registros</div>
        </div>
      </Box>

      {/* Formulario */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1.5px solid #fbcfe8", mb: 4, background: "#fff" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}>Nuevo depósito</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField label="Nombre / Cliente" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Juan García..." size="small" fullWidth required />
          <TextField label="Monto (MXN)" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="0.00" size="small" fullWidth required inputProps={{ inputMode: "decimal" }} />
          <TextField label="Concepto" value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Ej. Pago servicio..." size="small" fullWidth required />
          <TextField label="Fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} size="small" fullWidth required InputLabelProps={{ shrink: true }} />
          <Box sx={{ gridColumn: { sm: "span 2" } }}>
            <button
              type="submit"
              disabled={limiteAlcanzado || saving}
              style={{ ...btnRosaMoradoStyle, opacity: (limiteAlcanzado || saving) ? 0.55 : 1 }}
              onMouseEnter={(e) => { if (!saving) (e.currentTarget.style.opacity = "0.88"); (e.currentTarget.style.transform = "translateY(-1px)"); }}
              onMouseLeave={(e) => { (e.currentTarget.style.opacity = "1"); (e.currentTarget.style.transform = "none"); }}
            >
              {saving ? <CircularProgress size={16} sx={{ color: "#fff" }} /> : <AddCircleOutlineIcon style={{ fontSize: 18 }} />}
              {saving ? "Guardando..." : "Agregar deposito"}
            </button>
          </Box>
        </Box>
      </Paper>

      {/* Tabla */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}>Historial de depositos</Typography>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#db2777" }} /></Box>
      ) : sorted.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1.5px dashed #fbcfe8" }}>
          <Typography sx={{ color: "#475569" }}>No hay depositos registrados.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1.5px solid #fbcfe8" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(90deg,#fce7f3,#ede9fe)" }}>
                {["Nombre","Concepto","Fecha","Monto",""].map((h, i) => (
                  <TableCell key={i} align={i >= 3 ? "right" : "left"}
                    sx={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#7c3aed",
                      display: i === 2 ? { xs: "none", sm: "table-cell" } : "table-cell" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sorted.map((i, idx) => (
                <TableRow key={i.id} hover sx={{ bgcolor: idx % 2 !== 0 ? "#fdf4ff" : "#fff" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#0f172a" }}>{i.nombre}</TableCell>
                  <TableCell sx={{ color: "#475569" }}>{i.concepto}</TableCell>
                  <TableCell sx={{ color: "#475569", display: { xs: "none", sm: "table-cell" } }}>{fmtFecha(i.fecha)}</TableCell>
                  <TableCell align="right">
                    <Chip label={`+${fmt(i.monto)}`} size="small"
                      sx={{ background: "linear-gradient(90deg,#fce7f3,#ede9fe)", color: "#7c3aed", fontWeight: 700, border: "1px solid #e9d5ff" }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleDelete(i.id)} sx={{ color: "#94a3b8", "&:hover": { color: "#db2777", bgcolor: "#fce7f3" } }}>
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
