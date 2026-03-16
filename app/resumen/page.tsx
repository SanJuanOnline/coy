"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCrmData } from "@/lib/useCrmData";
import { getSaldoActual } from "@/lib/types";
import { cardMetalStyle, shineStyle, GRAD_ROSA_MORADO, GRAD_MORADO_ROSA } from "@/lib/styles";
import {
  Paper, Typography, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, CircularProgress,
} from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}
function fmtFecha(f: string) {
  return new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ResumenPage() {
  const { data, isLoading } = useCrmData();

  const saldo         = useMemo(() => getSaldoActual(data), [data]);
  const totalIngresos = useMemo(() => data.ingresos.reduce((s, i) => s + i.monto, 0), [data.ingresos]);
  const totalEgresos  = useMemo(() => data.egresos.reduce((s, e) => s + e.monto, 0), [data.egresos]);

  const movimientos = useMemo(() => [
    ...data.ingresos.map((i) => ({ tipo: "ingreso" as const, id: i.id, concepto: i.concepto, nombre: i.nombre, monto: i.monto, fecha: i.fecha, createdAt: i.createdAt })),
    ...data.egresos.map((e)  => ({ tipo: "egreso"  as const, id: e.id, concepto: e.concepto, nombre: null,     monto: e.monto, fecha: e.fecha, createdAt: e.createdAt })),
  ].sort((a, b) => b.createdAt - a.createdAt), [data]);

  return (
    <Box sx={{ maxWidth: 860, mx: "auto", px: 2, py: 4 }}>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
          <ArrowBackIcon style={{ fontSize: 16 }} /> Inicio
        </Link>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#0f172a" }}>Resumen financiero</Typography>
      </Box>

      {/* Tarjetas metálicas */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2, mb: 4 }}>
        {/* Saldo */}
        <div style={{ ...cardMetalStyle("linear-gradient(135deg, #db2777 0%, #7c3aed 100%)"), gridColumn: "span 1" }}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <AccountBalanceWalletIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Saldo actual</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{fmt(saldo)}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Inicial: {fmt(data.saldoInicial)}</div>
        </div>

        {/* Ingresos */}
        <div style={cardMetalStyle(GRAD_ROSA_MORADO)}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <TrendingDownIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Depositos</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>+{fmt(totalIngresos)}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{data.ingresos.length} registros</div>
        </div>

        {/* Egresos */}
        <div style={cardMetalStyle(GRAD_MORADO_ROSA)}>
          <div style={shineStyle} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.85 }}>
            <TrendingUpIcon style={{ fontSize: 18, color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em" }}>Tiendas</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>-{fmt(totalEgresos)}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>{data.egresos.length} registros</div>
        </div>
      </Box>

      {/* Tabla */}
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}>Todos los movimientos</Typography>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#db2777" }} /></Box>
      ) : movimientos.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "1.5px dashed #fbcfe8" }}>
          <Typography sx={{ color: "#475569", mb: 2 }}>Sin movimientos aún.</Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Link href="/ingresos" style={{ padding: "8px 20px", borderRadius: 8, background: GRAD_ROSA_MORADO, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>+DEPOSITOS</Link>
            <Link href="/egresos"  style={{ padding: "8px 20px", borderRadius: 8, background: GRAD_MORADO_ROSA, color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>+ TIENDAS</Link>
          </Box>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: "1.5px solid #e9d5ff" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ background: "linear-gradient(90deg,#fce7f3,#ede9fe,#fce7f3)" }}>
                {["Tipo","Concepto","Fecha","Monto"].map((h, i) => (
                  <TableCell key={i} align={i === 3 ? "right" : "left"}
                    sx={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em",
                      background: "transparent",
                      color: i % 2 === 0 ? "#db2777" : "#7c3aed",
                      display: i === 2 ? { xs: "none", sm: "table-cell" } : "table-cell" }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {movimientos.map((m, idx) => (
                <TableRow key={`${m.tipo}-${m.id}`} hover sx={{ bgcolor: idx % 2 !== 0 ? "#fdf4ff" : "#fff" }}>
                  <TableCell>
                    <Chip
                      icon={m.tipo === "ingreso" ? <TrendingDownIcon /> : <TrendingUpIcon />}
                      label={m.tipo === "ingreso" ? "Ingreso" : "Egreso"}
                      size="small"
                      sx={{
                        background: m.tipo === "ingreso" ? "linear-gradient(90deg,#fce7f3,#ede9fe)" : "linear-gradient(90deg,#ede9fe,#fce7f3)",
                        color: m.tipo === "ingreso" ? "#db2777" : "#7c3aed",
                        fontWeight: 700,
                        border: `1px solid ${m.tipo === "ingreso" ? "#fbcfe8" : "#e9d5ff"}`,
                        "& .MuiChip-icon": { color: "inherit", fontSize: 14 },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, color: "#0f172a" }}>
                    {m.concepto}{m.nombre ? ` — ${m.nombre}` : ""}
                  </TableCell>
                  <TableCell sx={{ color: "#475569", display: { xs: "none", sm: "table-cell" } }}>{fmtFecha(m.fecha)}</TableCell>
                  <TableCell align="right">
                    <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums", fontSize: 13,
                      color: m.tipo === "ingreso" ? "#db2777" : "#7c3aed" }}>
                      {m.tipo === "ingreso" ? "+" : "-"}{fmt(m.monto)}
                    </span>
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
