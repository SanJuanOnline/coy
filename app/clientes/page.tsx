"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useCrmData } from "@/lib/useCrmData";
import { getSaldoCliente } from "@/lib/types";
import { Paper, Typography, Box, Button, IconButton, Chip, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Swal from "sweetalert2";
import PageWrapper from "@/components/PageWrapper";

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export default function ClientesPage() {
  const { data, deleteCliente } = useCrmData();
  const [mostrarLista, setMostrarLista] = useState(false);
  const [montosVisibles, setMontosVisibles] = useState<Record<string, boolean>>({});

  const clientesConSaldo = useMemo(() => {
    return data.clientes.map(cliente => {
      const saldo = getSaldoCliente(cliente.id, data.movimientos);
      return { ...cliente, ...saldo };
    });
  }, [data]);

  const toggleMontoVisible = (clienteId: string) => {
    setMontosVisibles(prev => ({ ...prev, [clienteId]: !prev[clienteId] }));
  };

  const handleDeleteCliente = async (id: string, nombre: string) => {
    const result = await Swal.fire({
      title: `¿Eliminar a ${nombre}?`,
      text: "También se eliminarán todos sus movimientos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626"
    });
    if (result.isConfirmed) {
      await deleteCliente(id);
      Swal.fire({ icon: "success", title: "Eliminado", timer: 1500, showConfirmButton: false });
    }
  };

  return (
    <PageWrapper>
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>👥 Clientes</Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#64748b", mt: 0.5 }}>Gestión de clientes</Typography>
          </div>
          <Link href="/" style={{ fontSize: "0.9rem", color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
            ← Inicio
          </Link>
        </Box>

        {/* Contador de clientes */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "2px solid #dbeafe", background: "rgba(255,255,255,0.9)", mb: 3, textAlign: "center" }}>
          <Typography sx={{ fontSize: "0.9rem", color: "#3b82f6", fontWeight: 600, mb: 1 }}>Total de Clientes</Typography>
          <Typography sx={{ fontSize: "4rem", fontWeight: 900, color: "#0f172a" }}>{data.clientes.length}</Typography>
        </Paper>

        {/* Botones */}
        <Box sx={{ mb: 3, display: "flex", gap: 2, justifyContent: "center" }}>
          <Link href="/clientes/nuevo" style={{ textDecoration: "none" }}>
            <Button 
              variant="contained" 
              startIcon={<AddCircleOutlineIcon />}
              sx={{ 
                background: "linear-gradient(135deg, #059669, #10b981)", 
                fontWeight: 700, 
                px: 4, 
                py: 1.5, 
                borderRadius: 2, 
                textTransform: "none", 
                fontSize: "1.1rem",
                boxShadow: "0 4px 12px rgba(5,150,105,0.3)"
              }}>
              Agregar Cliente
            </Button>
          </Link>
          
          <Button 
            variant="contained" 
            startIcon={<VisibilityIcon />}
            onClick={() => setMostrarLista(!mostrarLista)}
            sx={{ 
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", 
              fontWeight: 700, 
              px: 4, 
              py: 1.5, 
              borderRadius: 2, 
              textTransform: "none", 
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
            }}>
            {mostrarLista ? "Ocultar Clientes" : "Ver Clientes"}
          </Button>
        </Box>

        {/* Acordeón con lista de clientes */}
        {mostrarLista && (
          <Box>
            {clientesConSaldo.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "2px dashed #e9d5ff", background: "rgba(255,255,255,0.7)" }}>
                <Typography sx={{ color: "#475569" }}>No hay clientes registrados aún.</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "grid", gap: 2 }}>
                {clientesConSaldo.map((cliente) => (
                  <Accordion key={cliente.id} elevation={0} sx={{ 
                    borderRadius: "12px !important", 
                    border: "2px solid #e9d5ff",
                    background: "rgba(255,255,255,0.9)",
                    "&:before": { display: "none" }
                  }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", pr: 2 }}>
                        <div>
                          <Typography sx={{ fontWeight: 700, color: "#0f172a", fontSize: "1.1rem" }}>{cliente.nombre}</Typography>
                          <Typography sx={{ fontSize: "0.85rem", color: "#64748b" }}>
                            {cliente.telefono && `📞 ${cliente.telefono}`}
                          </Typography>
                        </div>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Chip 
                            label={montosVisibles[cliente.id] ? `Pendiente: ${fmt(cliente.pendiente)}` : "Pendiente: ••••"} 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); toggleMontoVisible(cliente.id); }}
                            sx={{ 
                              fontWeight: 700, 
                              bgcolor: "#fb923c", 
                              color: "#ffffff",
                              cursor: "pointer",
                              "&:hover": { opacity: 0.8 }
                            }} 
                          />
                          {montosVisibles[cliente.id] ? <VisibilityOffIcon sx={{ fontSize: 18, color: "#64748b" }} /> : <VisibilityIcon sx={{ fontSize: 18, color: "#64748b" }} />}
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ pt: 1 }}>
                        {cliente.email && (
                          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 1 }}>
                            ✉️ {cliente.email}
                          </Typography>
                        )}
                        {cliente.notas && (
                          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 1 }}>
                            📝 {cliente.notas}
                          </Typography>
                        )}
                        {cliente.frecuenciaPago && (
                          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 1 }}>
                            📅 Frecuencia: {cliente.frecuenciaPago}
                          </Typography>
                        )}
                        {cliente.cantidadPagos && (
                          <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mb: 2 }}>
                            🔢 Pagos: {cliente.cantidadPagos}
                          </Typography>
                        )}
                        
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                          <Chip label={`Prestado: ${fmt(cliente.totalPrestado)}`} size="small" sx={{ fontWeight: 600, bgcolor: "#fb923c", color: "#ffffff" }} />
                          <Chip label={`Pagado: ${fmt(cliente.totalPagado)}`} size="small" sx={{ fontWeight: 600, bgcolor: "#fb923c", color: "#ffffff" }} />
                        </Box>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Link href={`/clientes/${cliente.id}`} style={{ textDecoration: "none" }}>
                            <Button size="small" variant="contained"
                              sx={{ background: "linear-gradient(135deg, #059669, #10b981)", textTransform: "none", fontWeight: 600 }}>
                              Ver Detalle
                            </Button>
                          </Link>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCliente(cliente.id, cliente.nombre)}
                            sx={{ textTransform: "none" }}>
                            Eliminar
                          </Button>
                        </Box>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>
        )}
      </Box>
    </PageWrapper>
  );
}
