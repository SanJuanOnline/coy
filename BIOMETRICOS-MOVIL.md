# 🔐 Solución: Biométricos no detectados en móvil

## Cambios realizados

### 1. **Mejorada detección de WebAuthn** (`lib/webauthn.ts`)
- Ahora usa `isUserVerifyingPlatformAuthenticatorAvailable()` (async)
- Agregado `rpId` con el hostname actual
- Cambiado `userVerification` de `required` a `preferred` (más compatible)
- Agregado soporte para múltiples algoritmos (ES256 y RS256)
- Agregado `attestation: "none"` para mayor compatibilidad
- Mejor manejo de errores con logs en consola

### 2. **Componente de diagnóstico** (`components/BiometricTest.tsx`)
- Verifica todas las APIs necesarias
- Detecta tipo de dispositivo y navegador
- Muestra si el protocolo es seguro (HTTPS)
- Indica si hay autenticadores disponibles

### 3. **Página de prueba** (`/test-biometric`)
- Accede desde el móvil a: `https://tu-dominio.com/test-biometric`
- Verás todos los detalles de compatibilidad

## 🚨 Requisitos CRÍTICOS para móvil

### 1. **HTTPS obligatorio**
WebAuthn NO funciona en HTTP (excepto localhost). Debes:

**Opción A - Túnel HTTPS local (para pruebas):**
```bash
# Instalar ngrok
npm i -g ngrok

# Ejecutar tu app
npm run dev

# En otra terminal, crear túnel HTTPS
ngrok http 3000
```
Usa la URL HTTPS que te da ngrok (ej: `https://abc123.ngrok.io`)

**Opción B - Desplegar en Vercel (recomendado):**
```bash
npm i -g vercel
vercel
```
Vercel te da HTTPS automáticamente.

### 2. **Navegador compatible**
- ✅ Chrome/Edge en Android 9+
- ✅ Safari en iOS 14+
- ✅ Firefox en Android 92+
- ❌ Navegadores in-app (Facebook, Instagram, etc.)

### 3. **Biométricos configurados**
El usuario debe tener:
- Huella digital o Face ID configurado en el dispositivo
- Bloqueo de pantalla activado (PIN/patrón/contraseña)

### 4. **Permisos del navegador**
- Permitir acceso a sensores biométricos cuando lo solicite
- No estar en modo incógnito/privado

## 🧪 Cómo probar

### Paso 1: Verificar compatibilidad
1. Abre en el móvil: `https://tu-dominio.com/test-biometric`
2. Revisa los resultados:
   - `isSecure` debe ser **true**
   - `platformAuthenticatorAvailable` debe ser **true**
   - `hasPublicKeyCredential` debe ser **true**

### Paso 2: Registrar biométrico
1. Crea un usuario nuevo
2. Cuando pregunte "¿Activar huella?", acepta
3. Sigue las instrucciones del sistema

### Paso 3: Probar login
1. Cierra sesión
2. Ingresa tu usuario
3. Presiona el botón de huella 👆
4. Usa tu biométrico

## 🐛 Problemas comunes

### "platformAuthenticatorAvailable: false"
**Causa**: No hay biométricos configurados en el dispositivo
**Solución**: 
- Android: Ajustes → Seguridad → Huella digital
- iOS: Ajustes → Face ID y código

### "isSecure: false"
**Causa**: Estás usando HTTP en lugar de HTTPS
**Solución**: Usa ngrok o despliega en Vercel

### "hasPublicKeyCredential: false"
**Causa**: Navegador no compatible
**Solución**: Usa Chrome, Safari o Firefox (no navegadores in-app)

### Error: "NotAllowedError"
**Causa**: Usuario canceló o navegador bloqueó
**Solución**: 
- Verifica permisos del navegador
- No uses modo incógnito
- Intenta de nuevo

### Error: "SecurityError"
**Causa**: Problema con el dominio o HTTPS
**Solución**: 
- Verifica que el dominio sea válido
- Asegúrate de usar HTTPS

## 📱 Compatibilidad por dispositivo

### Android
- **Chrome 70+**: ✅ Completo
- **Firefox 92+**: ✅ Completo
- **Samsung Internet**: ✅ Desde versión 13
- **Opera**: ⚠️ Limitado

### iOS
- **Safari 14+**: ✅ Completo (Face ID / Touch ID)
- **Chrome iOS**: ⚠️ Usa motor de Safari
- **Firefox iOS**: ⚠️ Usa motor de Safari

### Requisitos de OS
- Android 9+ (API 28+)
- iOS 14+

## 🔧 Debugging en móvil

### Android (Chrome)
1. Conecta el móvil por USB
2. Habilita "Depuración USB" en opciones de desarrollador
3. En Chrome desktop: `chrome://inspect`
4. Selecciona tu dispositivo
5. Ve a la consola para ver errores

### iOS (Safari)
1. En iPhone: Ajustes → Safari → Avanzado → Web Inspector (activar)
2. Conecta por cable al Mac
3. En Mac Safari: Desarrollador → [Tu iPhone] → [Tu página]
4. Ve a la consola

## ✅ Checklist final

Antes de reportar un problema, verifica:

- [ ] Estoy usando HTTPS (no HTTP)
- [ ] Tengo biométricos configurados en mi dispositivo
- [ ] Estoy usando un navegador compatible (Chrome/Safari/Firefox)
- [ ] No estoy en modo incógnito
- [ ] He dado permisos al navegador
- [ ] La página `/test-biometric` muestra todo en verde
- [ ] He probado cerrar y abrir el navegador

## 🚀 Próximos pasos

Si después de estos cambios sigue sin funcionar:

1. Accede a `/test-biometric` desde el móvil
2. Toma captura de pantalla de los resultados
3. Abre la consola del navegador (ver sección Debugging)
4. Intenta registrar biométrico y copia cualquier error
5. Comparte esa información para diagnóstico específico

## 📚 Referencias

- [WebAuthn Guide](https://webauthn.guide/)
- [Can I Use WebAuthn](https://caniuse.com/webauthn)
- [MDN Web Authentication API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)
