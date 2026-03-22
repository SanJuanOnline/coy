"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Swal from "sweetalert2";

interface LoginGuardProps {
  children: React.ReactNode;
}

export default function LoginGuard({ children }: LoginGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("authenticated");
    if (auth === "true") {
      setIsAuthenticated(true);
      return;
    }

    fetch("/api/auth")
      .then(res => res.json())
      .then(data => {
        setHasUser(data.hasUser);
        setIsCreating(!data.hasUser);
      });
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username.length < 3) {
      Swal.fire({ icon: "error", title: "Error", text: "El usuario debe tener al menos 3 caracteres" });
      return;
    }

    if (password.length < 4) {
      Swal.fire({ icon: "error", title: "Error", text: "La contraseña debe tener al menos 4 caracteres" });
      return;
    }

    if (password !== confirmPassword) {
      Swal.fire({ icon: "error", title: "Error", text: "Las contraseñas no coinciden" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", username, password })
      });

      const data = await res.json();

      if (data.ok) {
        await Swal.fire({ 
          icon: "success", 
          title: "¡Usuario creado!", 
          text: "Tu cuenta ha sido configurada correctamente",
          timer: 2000,
          showConfirmButton: false
        });
        sessionStorage.setItem("authenticated", "true");
        setIsAuthenticated(true);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo crear el usuario" });
    }

    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      Swal.fire({ icon: "error", title: "Error", text: "Completa todos los campos" });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", username, password })
      });

      const data = await res.json();

      if (data.ok) {
        sessionStorage.setItem("authenticated", "true");
        setIsAuthenticated(true);
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error });
        setPassword("");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "No se pudo verificar las credenciales" });
    }

    setLoading(false);
  };

  const handleRecover = async () => {
    setRecovering(true);
    try {
      const res = await fetch("/api/recover", { method: "POST" });
      const data = await res.json();

      if (data.ok) {
        await Swal.fire({ 
          icon: "success", 
          title: "¡Correo enviado!", 
          text: "Revisa tu bandeja de entrada",
          timer: 3000
        });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: "No se pudo enviar el correo" });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Error al recuperar credenciales" });
    }
    setRecovering(false);
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  if (hasUser === null) {
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
            {isCreating ? <PersonAddIcon sx={{ fontSize: 40, color: "#fff" }} /> : <LockIcon sx={{ fontSize: 40, color: "#fff" }} />}
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a", mb: 1 }}>
            CRM Coy
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#64748b" }}>
            {isCreating ? "Crea tu cuenta" : "Iniciar sesión"}
          </Typography>
        </Box>

        {isCreating ? (
          <Box component="form" onSubmit={handleCreateUser} sx={{ display: "grid", gap: 2.5 }}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <TextField
              label="Confirmar contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                fontWeight: 700,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(5,150,105,0.3)"
              }}>
              {loading ? "Creando..." : "Crear cuenta"}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleLogin} sx={{ display: "grid", gap: 2.5 }}>
            <TextField
              label="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
              autoFocus
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
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

            <Button
              onClick={handleRecover}
              disabled={recovering}
              sx={{
                color: "#6b7280",
                fontSize: "0.875rem",
                textTransform: "none",
                "&:hover": { color: "#3b82f6" }
              }}>
              {recovering ? "Enviando..." : "¿Olvidaste tu contraseña?"}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
