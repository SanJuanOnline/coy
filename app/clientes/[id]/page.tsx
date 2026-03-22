"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCrmData } from "@/lib/useCrmData";
import { getSaldoCliente } from "@/lib/types";
import { Paper, Typography, Box, Button, IconButton, Chip, Checkbox, FormControlLabel, Collapse } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import Swal from "sweetalert2";
import PageWrapper from "@/components/PageWrapper";

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

function fmtFecha(f: string) {
  return new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ClienteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const { data, addMovimiento, deleteMovimiento, togglePagado } = useCrmData();
  
  const [enviarWhatsApp, setEnviarWhatsApp] = useState(false);
  const [enviarEmail, setEnviarEmail] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  const clienteId = params.id as string;

  const cliente = useMemo(() => {
    const c = data.clientes.find(cl => cl.id === clienteId);
    if (!c) return null;
    
    const movimientos = data.movimientos.filter(m => m.clienteId === clienteId);
    const saldo = getSaldoCliente(clienteId, data.movimientos);
    
    return { ...c, movimientos, ...saldo };
  }, [data, clienteId]);

  if (!cliente) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Cliente no encontrado</Typography>
      </Box>
    );
  }

  const handleNuevoIngreso = async () => {
    const { value: formValues } = await Swal.fire({
      title: "💰 Nueva Entrada",
      html: `
        <input id="monto" type="number" step="0.01" class="swal2-input" placeholder="Monto" required>
        <input id="concepto" class="swal2-input" placeholder="Referencia" required>
        <input id="interes" type="number" step="0.01" class="swal2-input" placeholder="% Interés (opcional)">
        <input id="fecha" type="date" class="swal2-input" value="${new Date().toISOString().slice(0, 10)}" required>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const monto = parseFloat((document.getElementById("monto") as HTMLInputElement).value);
        const concepto = (document.getElementById("concepto") as HTMLInputElement).value;
        const interesVal = (document.getElementById("interes") as HTMLInputElement).value;
        const interes = interesVal ? parseFloat(interesVal) : undefined;
        const fecha = (document.getElementById("fecha") as HTMLInputElement).value;
        
        if (!monto || !concepto || !fecha) {
          Swal.showValidationMessage("Completa los campos obligatorios");
          return false;
        }
        return { monto, concepto, interes, fecha };
      }
    });

    if (formValues) {
      const ok = await addMovimiento({
        clienteId,
        tipo: "prestamo",
        concepto: formValues.concepto,
        monto: formValues.monto,
        interes: formValues.interes,
        fecha: formValues.fecha,
        pagado: false
      });
      
      if (ok) {
        Swal.fire({ icon: "success", title: "¡Entrada registrada!", timer: 1500, showConfirmButton: false });
      }
    }
  };

  const handleNuevoPago = async () => {
    const entradas = cliente.movimientos.filter(m => m.tipo === "prestamo");
    const opcionesConceptos = entradas.map(e => `<option value="${e.concepto}">${e.concepto}</option>`).join("");

    const { value: formValues } = await Swal.fire({
      title: "✅ Registrar Salida",
      html: `
        <input id="monto" type="number" step="0.01" class="swal2-input" placeholder="Monto" required>
        ${entradas.length > 0
          ? `<select id="concepto" class="swal2-input" style="cursor:pointer">
               <option value="">-- Selecciona referencia --</option>
               ${opcionesConceptos}
             </select>`
          : `<input id="concepto" class="swal2-input" placeholder="Referencia" required>`
        }
        <input id="fecha" type="date" class="swal2-input" value="${new Date().toISOString().slice(0, 10)}" required>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const monto = parseFloat((document.getElementById("monto") as HTMLInputElement).value);
        const concepto = (document.getElementById("concepto") as HTMLInputElement | HTMLSelectElement).value;
        const fecha = (document.getElementById("fecha") as HTMLInputElement).value;
        if (!monto || !concepto || !fecha) {
          Swal.showValidationMessage("Completa los campos obligatorios");
          return false;
        }
        return { monto, concepto, fecha };
      }
    });

    if (formValues) {
      const ok = await addMovimiento({
        clienteId,
        tipo: "pago",
        concepto: formValues.concepto,
        monto: formValues.monto,
        fecha: formValues.fecha,
        pagado: true
      });
      if (ok) {
        Swal.fire({ icon: "success", title: "¡Salida registrada!", timer: 1500, showConfirmButton: false });
      }
    }
  };

  const handleEnviarNotificacion = async () => {
    if (!enviarWhatsApp && !enviarEmail) {
      Swal.fire({ icon: "warning", title: "Selecciona al menos una opción", text: "WhatsApp o Email", timer: 2000 });
      return;
    }

    let emailDestinatario = "";
    
    // Si se va a enviar email, pedir el correo destinatario
    if (enviarEmail) {
      const { value: email } = await Swal.fire({
        title: "📧 Correo destinatario",
        input: "email",
        inputPlaceholder: "correo@ejemplo.com",
        showCancelButton: true,
        confirmButtonText: "Enviar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
          if (!value) {
            return "Debes ingresar un correo electrónico";
          }
        }
      });
      
      if (!email) return;
      emailDestinatario = email;
    }

    try {
      // Enviar por WhatsApp
      if (enviarWhatsApp) {
        const mensaje = `📊 *Resumen Financiero*\n\n*Cliente:* ${cliente.nombre}\n\n💰 *Total Prestado:* ${fmt(cliente.totalPrestado)}\n✅ *Total Pagado:* ${fmt(cliente.totalPagado)}\n📈 *Total Interés:* ${fmt(cliente.totalInteres)}\n⏳ *Pendiente:* ${fmt(cliente.pendiente)}`;
        const url = `https://wa.me/${cliente.telefono?.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, "_blank");
      }

      // Enviar por Email
      if (enviarEmail) {
        const res = await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clienteNombre: cliente.nombre,
            totalPrestado: cliente.totalPrestado,
            totalPagado: cliente.totalPagado,
            totalInteres: cliente.totalInteres,
            pendiente: cliente.pendiente,
            destinatario: emailDestinatario,
            movimientos: cliente.movimientos
          })
        });
        
        if (res.ok) {
          Swal.fire({ icon: "success", title: "¡Email enviado!", timer: 1500, showConfirmButton: false });
        } else {
          Swal.fire({ icon: "error", title: "Error al enviar email", text: "Verifica la configuración", timer: 2000 });
        }
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo enviar la notificación", timer: 2000 });
    }
  };


  return (
    <PageWrapper>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>{cliente.nombre}</Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#64748b", mt: 0.5 }}>
              {cliente.telefono && `📞 ${cliente.telefono}`} {cliente.email && `• ✉️ ${cliente.email}`}
            </Typography>
            {cliente.notas && <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>📝 {cliente.notas}</Typography>}
            {cliente.frecuenciaPago && <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>📅 Frecuencia: {cliente.frecuenciaPago}</Typography>}
            {cliente.cantidadPagos && <Typography sx={{ fontSize: "0.85rem", color: "#64748b", mt: 0.5 }}>🔢 Cantidad de pagos: {cliente.cantidadPagos}</Typography>}
          </div>
          <Link href="/clientes" style={{ fontSize: "0.9rem", color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
            ← Volver
          </Link>
        </Box>

        {/* Resumen financiero */}
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, mb: 3 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "2px solid #dbeafe", background: "rgba(255,255,255,0.9)" }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#3b82f6", fontWeight: 600, mb: 0.5 }}>💰 Total Prestado</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>{fmt(cliente.totalPrestado)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "2px solid #fef3c7", background: "rgba(255,255,255,0.9)" }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#ca8a04", fontWeight: 600, mb: 0.5 }}>📈 Total Interés</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>{fmt(cliente.totalInteres)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: "2px solid #d1fae5", background: "rgba(255,255,255,0.9)" }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#059669", fontWeight: 600, mb: 0.5 }}>✅ Total Pagado</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>{fmt(cliente.totalPagado)}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: `2px solid ${cliente.pendiente > 0 ? "#fee2e2" : "#d1fae5"}`, background: "rgba(255,255,255,0.9)" }}>
            <Typography sx={{ fontSize: "0.8rem", color: cliente.pendiente > 0 ? "#dc2626" : "#059669", fontWeight: 600, mb: 0.5 }}>⏳ Pendiente</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 900, color: "#0f172a" }}>{fmt(cliente.pendiente)}</Typography>
          </Paper>
        </Box>

        {/* Enviar Notificación */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 2, border: "2px solid #3b82f6 !important", background: "#3b82f6 !important" }}>
          <Typography sx={{ fontSize: "0.95rem", fontWeight: 700, color: "#ffffff !important", mb: 1.5 }}>📤 Enviar Resumen</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
            <FormControlLabel
              control={<Checkbox checked={enviarWhatsApp} onChange={(e) => setEnviarWhatsApp(e.target.checked)} sx={{ color: "#ffffff !important", "&.Mui-checked": { color: "#ffffff !important" } }} />}
              label={<span style={{ color: "#ffffff" }}>WhatsApp</span>}
            />
            <FormControlLabel
              control={<Checkbox checked={enviarEmail} onChange={(e) => setEnviarEmail(e.target.checked)} sx={{ color: "#ffffff !important", "&.Mui-checked": { color: "#ffffff !important" } }} />}
              label={<span style={{ color: "#ffffff" }}>Email</span>}
            />
            <Button 
              variant="contained" 
              startIcon={<SendIcon />} 
              onClick={handleEnviarNotificacion}
              disabled={!enviarWhatsApp && !enviarEmail}
              sx={{ 
                background: "#1d4ed8 !important", 
                fontWeight: 700, 
                px: 3, 
                py: 1, 
                borderRadius: 2, 
                textTransform: "none",
                color: "#ffffff !important",
                "&:disabled": { background: "#64748b !important" },
                "&:hover": { background: "#1e40af !important" }
              }}
            >
              Enviar
            </Button>
          </Box>
        </Paper>

        {/* Botones de acción */}
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <Button variant="contained" startIcon={<AttachMoneyIcon />} onClick={handleNuevoIngreso}
            sx={{ 
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", 
              fontWeight: 700, 
              px: 3, 
              py: 1.2, 
              borderRadius: 2, 
              textTransform: "none", 
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(139,92,246,0.3)"
            }}>
            Nueva Entrada
          </Button>
          
          <Button variant="contained" startIcon={<AttachMoneyIcon />} onClick={handleNuevoPago}
            sx={{ 
              background: "linear-gradient(135deg, #059669, #10b981)", 
              fontWeight: 700, 
              px: 3, 
              py: 1.2, 
              borderRadius: 2, 
              textTransform: "none", 
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(5,150,105,0.3)"
            }}>
            Registrar Salida
          </Button>
        </Box>

        {/* Movimientos en acordeón */}
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#0f172a" }}>
          📋 Movimientos ({cliente.movimientos.length})
        </Typography>

        {cliente.movimientos.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "2px dashed #e9d5ff", background: "rgba(255,255,255,0.7)" }}>
            <Typography sx={{ color: "#475569", mb: 2 }}>No hay movimientos registrados aún.</Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="contained" startIcon={<AttachMoneyIcon />} onClick={handleNuevoIngreso}
                sx={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", textTransform: "none" }}>
                Nueva Entrada
              </Button>
              <Button variant="contained" startIcon={<AttachMoneyIcon />} onClick={handleNuevoPago}
                sx={{ background: "linear-gradient(135deg, #059669, #10b981)", textTransform: "none" }}>
                Registrar Salida
              </Button>
            </Box>
          </Paper>
        ) : (() => {
          const entradas = cliente.movimientos.filter(m => m.tipo === "prestamo");
          const salidas = cliente.movimientos.filter(m => m.tipo === "pago");
          const entradasConceptos = new Set(entradas.map(e => e.concepto));
          const salidasHuerfanas = salidas.filter(s => !entradasConceptos.has(s.concepto));

          return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {entradas.map(entrada => {
                const egresosRelacionados = salidas.filter(s => s.concepto === entrada.concepto);
                const isOpen = expanded[entrada.id] ?? false;
                return (
                  <Paper key={entrada.id} elevation={0} sx={{ borderRadius: 2, border: "2px solid #e9d5ff", overflow: "hidden" }}>
                    <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 1.5, flexWrap: "wrap", background: "rgba(139,92,246,0.06)", cursor: egresosRelacionados.length > 0 ? "pointer" : "default" }}
                      onClick={() => egresosRelacionados.length > 0 && setExpanded(prev => ({ ...prev, [entrada.id]: !isOpen }))}>
                      <Chip label="ENTRADA" size="small" sx={{ fontWeight: 700, bgcolor: "#ede9fe", color: "#7c3aed", fontSize: "0.7rem" }} />
                      <Typography sx={{ fontWeight: 700, flex: 1, fontSize: "0.95rem" }}>{entrada.concepto}</Typography>
                      <Typography sx={{ fontWeight: 700, color: "#7c3aed" }}>{fmt(entrada.monto)}</Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#64748b", display: { xs: "none", sm: "block" } }}>{fmtFecha(entrada.fecha)}</Typography>
                      {entrada.interes && <Chip label={`${entrada.interes}%`} size="small" sx={{ bgcolor: "#fef3c7", color: "#b45309", fontSize: "0.7rem" }} />}
                      <Chip label={entrada.pagado ? "Pagado" : "Pendiente"} size="small" color={entrada.pagado ? "success" : "warning"}
                        onClick={(e) => { e.stopPropagation(); togglePagado(entrada.id); }} sx={{ cursor: "pointer", fontSize: "0.7rem" }} />
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); deleteMovimiento(entrada.id); }} sx={{ color: "#94a3b8", "&:hover": { color: "#dc2626" } }}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                      {egresosRelacionados.length > 0 && (isOpen ? <ExpandLessIcon sx={{ color: "#7c3aed" }} /> : <ExpandMoreIcon sx={{ color: "#7c3aed" }} />)}
                    </Box>
                    {egresosRelacionados.length > 0 && (
                      <Collapse in={isOpen}>
                        <Box sx={{ borderTop: "1px solid #e9d5ff" }}>
                          {egresosRelacionados.map(salida => (
                            <Box key={salida.id} sx={{ display: "flex", alignItems: "center", p: 1.5, pl: 4, gap: 1.5, flexWrap: "wrap", background: "rgba(16,185,129,0.04)", borderBottom: "1px solid #f0fdf4" }}>
                              <Chip label="SALIDA" size="small" sx={{ fontWeight: 700, bgcolor: "#d1fae5", color: "#059669", fontSize: "0.7rem" }} />
                              <Typography sx={{ flex: 1, fontSize: "0.875rem" }}>{salida.concepto}</Typography>
                              <Typography sx={{ fontWeight: 700, color: "#059669" }}>{fmt(salida.monto)}</Typography>
                              <Typography sx={{ fontSize: "0.8rem", color: "#64748b", display: { xs: "none", sm: "block" } }}>{fmtFecha(salida.fecha)}</Typography>
                              <IconButton size="small" onClick={() => deleteMovimiento(salida.id)} sx={{ color: "#94a3b8", "&:hover": { color: "#dc2626" } }}>
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    )}
                  </Paper>
                );
              })}
              {salidasHuerfanas.map(salida => (
                <Paper key={salida.id} elevation={0} sx={{ borderRadius: 2, border: "2px solid #d1fae5", overflow: "hidden" }}>
                  <Box sx={{ display: "flex", alignItems: "center", p: 2, gap: 1.5, flexWrap: "wrap", background: "rgba(16,185,129,0.06)" }}>
                    <Chip label="SALIDA" size="small" sx={{ fontWeight: 700, bgcolor: "#d1fae5", color: "#059669", fontSize: "0.7rem" }} />
                    <Typography sx={{ fontWeight: 700, flex: 1, fontSize: "0.95rem" }}>{salida.concepto}</Typography>
                    <Typography sx={{ fontWeight: 700, color: "#059669" }}>{fmt(salida.monto)}</Typography>
                    <Typography sx={{ fontSize: "0.8rem", color: "#64748b", display: { xs: "none", sm: "block" } }}>{fmtFecha(salida.fecha)}</Typography>
                    <IconButton size="small" onClick={() => deleteMovimiento(salida.id)} sx={{ color: "#94a3b8", "&:hover": { color: "#dc2626" } }}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              ))}
            </Box>
          );
        })()}
      </Box>
    </PageWrapper>
  );
}
