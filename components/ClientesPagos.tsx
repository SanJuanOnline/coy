"use client";

import { useState } from "react";
import { TextField, Paper, Typography, Box, Button, MenuItem } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useCrmData } from "@/lib/useCrmData";
import Swal from "sweetalert2";

interface ClientesPagosProps {
  onSuccess?: () => void;
}

export default function ClientesPagos({ onSuccess }: ClientesPagosProps) {
  const { addCliente, addMovimiento } = useCrmData();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [monto, setMonto] = useState("");
  const [concepto, setConcepto] = useState("");
  const [interes, setInteres] = useState("");
  const [frecuencia, setFrecuencia] = useState("");
  const [cantidadPagos, setCantidadPagos] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre.trim() || !telefono.trim() || !monto || !concepto.trim()) {
      Swal.fire({ icon: "error", title: "Error", text: "Completa los campos obligatorios" });
      return;
    }

    const montoNum = parseFloat(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Swal.fire({ icon: "error", title: "Error", text: "Monto inválido" });
      return;
    }

    setSaving(true);

    try {
      // 1. Crear cliente y obtener su ID
      const clienteId = await addCliente({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: "",
        notas: "",
        frecuenciaPago: frecuencia as any || undefined,
        cantidadPagos: cantidadPagos ? parseInt(cantidadPagos) : undefined
      });

      if (!clienteId) {
        setSaving(false);
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el cliente" });
        return;
      }

      // 2. Crear movimiento de préstamo
      const okMovimiento = await addMovimiento({
        clienteId,
        tipo: "prestamo",
        concepto: concepto.trim(),
        monto: montoNum,
        interes: interes ? parseFloat(interes) : undefined,
        fecha: new Date().toISOString().slice(0, 10),
        pagado: false
      });

      if (!okMovimiento) {
        setSaving(false);
        Swal.fire({ icon: "error", title: "Error", text: "Cliente creado pero no se pudo registrar el préstamo" });
        return;
      }

      setSaving(false);
      
      // Limpiar formulario
      setNombre("");
      setTelefono("");
      setMonto("");
      setConcepto("");
      setInteres("");
      setFrecuencia("");
      setCantidadPagos("");

      await Swal.fire({ 
        icon: "success", 
        title: "¡Cliente y préstamo registrados!", 
        timer: 2000, 
        showConfirmButton: false 
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      setSaving(false);
      Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error al guardar" });
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "2px solid #e9d5ff", background: "rgba(255,255,255,0.95)" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: "#0f172a" }}>
        💰 Registro de Cliente y Préstamo
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 3 }}>
        
        <TextField 
          label="Nombre completo" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          placeholder="Ej. Juan García Pérez" 
          fullWidth 
          required
          autoFocus
        />
        
        <TextField 
          label="Teléfono / WhatsApp" 
          value={telefono} 
          onChange={(e) => setTelefono(e.target.value)} 
          placeholder="WhatsApp" 
          fullWidth 
          required
        />

        <TextField 
          label="Monto del préstamo" 
          type="number"
          value={monto} 
          onChange={(e) => setMonto(e.target.value)} 
          placeholder="0.00" 
          fullWidth 
          required
          inputProps={{ step: "0.01", min: "0" }}
        />

        <TextField 
          label="Concepto" 
          value={concepto} 
          onChange={(e) => setConcepto(e.target.value)} 
          placeholder="Ej. Préstamo personal, Crédito negocio..." 
          fullWidth 
          required
        />

        <TextField 
          label="Interés (%)" 
          type="number"
          value={interes} 
          onChange={(e) => setInteres(e.target.value)} 
          placeholder="Ej. 5, 10, 15..." 
          fullWidth
          inputProps={{ step: "0.01", min: "0" }}
          helperText="Opcional: Porcentaje de interés"
        />

        <TextField 
          select
          label="Frecuencia de pago" 
          value={frecuencia} 
          onChange={(e) => setFrecuencia(e.target.value)} 
          fullWidth
          helperText="Opcional: ¿Cada cuánto paga?"
        >
          <MenuItem value="">Sin especificar</MenuItem>
          <MenuItem value="semanal">Semanal</MenuItem>
          <MenuItem value="quincenal">Quincenal</MenuItem>
          <MenuItem value="mensual">Mensual</MenuItem>
          <MenuItem value="otro">Otro</MenuItem>
        </TextField>

        <TextField 
          label="Cantidad de pagos" 
          type="number"
          value={cantidadPagos} 
          onChange={(e) => setCantidadPagos(e.target.value)} 
          placeholder="Ej. 12, 24, 36..." 
          fullWidth
          inputProps={{ min: "1" }}
          helperText="Opcional: ¿En cuántos pagos?"
        />

        <Button 
          type="submit" 
          variant="contained" 
          startIcon={<AddCircleOutlineIcon />}
          disabled={saving}
          sx={{ 
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", 
            fontWeight: 700, 
            px: 4, 
            py: 1.5,
            fontSize: "1.1rem",
            textTransform: "none",
            boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
          }}>
          {saving ? "Guardando..." : "Registrar Cliente y Préstamo"}
        </Button>
      </Box>
    </Paper>
  );
}
