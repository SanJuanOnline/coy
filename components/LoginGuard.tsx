"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Swal from "sweetalert2";

interface LoginGuardProps {
  children: React.ReactNode;
}

export default function LoginGuard({ children }: LoginGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // Verificar si ya está autenticado
    const auth = sessionStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      return;
    }

    // Verificar si existe un PIN configurado
    fetch("/api/auth")
      .then(res => res.json())
      .then(data => {
        setHasPin(data.hasPin);
        setIsCreating(!data.hasPin);
      });
  }, []);

  const handleCreatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      Swal.fire({ icon: "error", title: "Error", text: "El PIN debe tener 4 dígitos" });
      return;
    }

    if (pin !== confirmPin) {
      Swal.fire({ icon: "error", title: "Error", text: "Los PINs no coinciden" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", pin })
      });

      const data = await res.json();

      if (data.ok) {
        await Swal.fire({ 
          icon: "success", 
          title: "¡PIN creado!", 
          text: "Tu PIN ha sido configurado correctamente",
          timer: 2000,
          showConfirmButton: false
        });
        sessionStorage.setItem("authenticated", "true");
        setIsAuthenticated(true);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el PIN" });
    }

    setLoading(false);
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length !== 4) {
      Swal.fire({ icon: "error", title: "Error", text: "El PIN debe tener 4 dígitos" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", pin })
      });

      const data = await res.json();

      if (data.ok) {
        sessionStorage.setItem("authenticated", "true");
        setIsAuthenticated(true);
        setPin("");
      } else {
        Swal.fire({ icon: "error", title: "PIN incorrecto", text: "Intenta nuevamente" });
        setPin("");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo verificar el PIN" });
    }

    setLoading(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (hasPin === null) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #f5f3ff 100%)",
      padding: "2rem"
    }}>
      <Paper elevation={0} sx={{ 
        p: 4, 
        borderRadius: 3, 
        border: "2px solid #e9d5ff", 
        background: "rgba(255,255,255,0.95)",
        maxWidth: 400,
        width: "100%",
        textAlign: "center"
      }}>
        {/* Logo */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "center", 
            width: 80, 
            height: 80, 
            borderRadius: "50%",
            background: isCreating ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            boxShadow: isCreating ? "0 8px 24px rgba(5,150,105,0.3)" : "0 8px 24px rgba(59,130,246,0.3)",
            mb: 2
          }}>
            {isCreating ? <LockOpenIcon sx={{ fontSize: 40, color: "#fff" }} /> : <LockIcon sx={{ fontSize: 40, color: "#fff" }} />}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>
            CRM Coy
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#64748b" }}>
            {isCreating ? "Crea tu PIN de acceso" : "Ingresa tu PIN"}
          </Typography>
        </Box>

        {/* Formulario */}
        {isCreating ? (
          <Box component="form" onSubmit={handleCreatePin} sx={{ display: "grid", gap: 3 }}>
            <TextField
              label="Nuevo PIN (4 dígitos)"
              type="password"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPin(value);
              }}
              placeholder="••••"
              fullWidth
              required
              autoFocus
              inputProps={{ 
                maxLength: 4,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { 
                  textAlign: "center", 
                  fontSize: "2rem", 
                  letterSpacing: "1rem",
                  fontWeight: 700
                }
              }}
            />

            <TextField
              label="Confirmar PIN"
              type="password"
              value={confirmPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setConfirmPin(value);
              }}
              placeholder="••••"
              fullWidth
              required
              inputProps={{ 
                maxLength: 4,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { 
                  textAlign: "center", 
                  fontSize: "2rem", 
                  letterSpacing: "1rem",
                  fontWeight: 700
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading || pin.length !== 4 || confirmPin.length !== 4}
              sx={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                fontWeight: 700,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(5,150,105,0.3)"
              }}>
              {loading ? "Creando..." : "Crear PIN"}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleVerifyPin} sx={{ display: "grid", gap: 3 }}>
            <TextField
              label="PIN (4 dígitos)"
              type="password"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                setPin(value);
              }}
              placeholder="••••"
              fullWidth
              required
              autoFocus
              inputProps={{ 
                maxLength: 4,
                inputMode: "numeric",
                pattern: "[0-9]*",
                style: { 
                  textAlign: "center", 
                  fontSize: "2rem", 
                  letterSpacing: "1rem",
                  fontWeight: 700
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading || pin.length !== 4}
              sx={{
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                fontWeight: 700,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)"
              }}>
              {loading ? "Verificando..." : "Ingresar"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
