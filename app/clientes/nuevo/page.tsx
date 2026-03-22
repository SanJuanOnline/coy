"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Typography, Box } from "@mui/material";
import ClientesPagos from "@/components/ClientesPagos";
import PageWrapper from "@/components/PageWrapper";

export default function NuevoClientePage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/clientes");
  };

  return (
    <PageWrapper>
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 900, color: "#0f172a" }}>➕ Nuevo Cliente</Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#64748b", mt: 0.5 }}>Registra un nuevo cliente con préstamo</Typography>
          </div>
          <Link href="/clientes" style={{ fontSize: "0.9rem", color: "#7c3aed", fontWeight: 600, textDecoration: "none" }}>
            ← Volver
          </Link>
        </Box>

        {/* Componente de formulario */}
        <ClientesPagos onSuccess={handleSuccess} />
      </Box>
    </PageWrapper>
  );
}
