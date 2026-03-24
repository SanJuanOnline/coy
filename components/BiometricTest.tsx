"use client";

import { useState, useEffect } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";

export default function BiometricTest() {
  const [results, setResults] = useState<Record<string, any>>({});

  const runTests = async () => {
    const tests: Record<string, any> = {};

    // Test 1: Verificar APIs básicas
    tests.hasWindow = typeof window !== "undefined";
    tests.hasPublicKeyCredential = typeof window !== "undefined" && !!window.PublicKeyCredential;
    tests.hasNavigatorCredentials = typeof navigator !== "undefined" && !!navigator.credentials;
    
    // Test 2: Verificar protocolo
    tests.protocol = window.location.protocol;
    tests.hostname = window.location.hostname;
    tests.isSecure = window.location.protocol === "https:" || window.location.hostname === "localhost";

    // Test 3: Verificar disponibilidad de autenticador
    if (window.PublicKeyCredential) {
      try {
        tests.platformAuthenticatorAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      } catch (error: any) {
        tests.platformAuthenticatorAvailable = false;
        tests.platformAuthenticatorError = error.message;
      }

      // Test 4: Verificar conditional mediation (para autofill)
      try {
        tests.conditionalMediationAvailable = await PublicKeyCredential.isConditionalMediationAvailable?.();
      } catch {
        tests.conditionalMediationAvailable = false;
      }
    }

    // Test 5: User Agent
    tests.userAgent = navigator.userAgent;
    
    // Test 6: Detectar tipo de dispositivo
    const ua = navigator.userAgent.toLowerCase();
    tests.isAndroid = ua.includes("android");
    tests.isIOS = /iphone|ipad|ipod/.test(ua);
    tests.isChrome = ua.includes("chrome") && !ua.includes("edg");
    tests.isSafari = ua.includes("safari") && !ua.includes("chrome");
    tests.isFirefox = ua.includes("firefox");

    setResults(tests);
  };

  useEffect(() => {
    runTests();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          🔍 Diagnóstico Biométrico
        </Typography>

        <Button 
          variant="contained" 
          onClick={runTests}
          sx={{ mb: 3 }}
        >
          Ejecutar Tests
        </Button>

        <Box sx={{ display: "grid", gap: 1 }}>
          {Object.entries(results).map(([key, value]) => (
            <Box 
              key={key}
              sx={{ 
                display: "flex", 
                justifyContent: "space-between",
                p: 1.5,
                bgcolor: typeof value === "boolean" 
                  ? (value ? "#dcfce7" : "#fee2e2")
                  : "#f1f5f9",
                borderRadius: 1
              }}
            >
              <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                {key}:
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", fontFamily: "monospace" }}>
                {typeof value === "boolean" 
                  ? (value ? "✅ true" : "❌ false")
                  : String(value)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: "#fef3c7", borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            ⚠️ Requisitos para WebAuthn en móvil:
          </Typography>
          <Typography variant="body2" component="div">
            • HTTPS obligatorio (excepto localhost)<br/>
            • Navegador compatible (Chrome, Safari, Firefox)<br/>
            • Biométricos configurados en el dispositivo<br/>
            • Permisos de seguridad habilitados
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
