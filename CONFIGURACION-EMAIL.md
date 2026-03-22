# Configuración de Notificaciones por Email

## Paso 1: Configurar el email destino

Edita el archivo `email-config.json` en la raíz del proyecto:

```json
{
  "destinatario": "tu-email@ejemplo.com"
}
```

Cambia `tu-email@ejemplo.com` por el email donde quieres recibir las notificaciones.

## Paso 2: Configurar credenciales de Gmail

En el archivo `.env.local`, asegúrate de tener:

```
MAIL_USER=tu-email@gmail.com
MAIL_PASS=tu-contraseña-de-aplicacion
```

### Cómo obtener una contraseña de aplicación de Gmail:

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en dos pasos (actívala si no la tienes)
3. Contraseñas de aplicaciones: https://myaccount.google.com/apppasswords
4. Genera una nueva contraseña para "Correo"
5. Copia la contraseña de 16 caracteres
6. Pégala en `MAIL_PASS` en tu `.env.local`

## Uso

En la página de detalle del cliente:

1. Marca las casillas de **WhatsApp** y/o **Email**
2. Haz clic en **Enviar**
3. El resumen financiero se enviará por los canales seleccionados

## Notas

- El archivo `email-config.json` está en `.gitignore` para no subir datos sensibles
- Puedes cambiar el email destino en cualquier momento editando el archivo
- No necesitas reiniciar el servidor después de cambiar el email
