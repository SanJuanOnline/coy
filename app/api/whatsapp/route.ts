import { NextRequest, NextResponse } from "next/server";

function formatMonto(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}

export async function POST(req: NextRequest) {
  const { tipo, clienteNombre, clienteTelefono, monto, concepto, interes, fecha } = await req.json();

  // Limpiar número de teléfono (solo dígitos)
  const telefono = clienteTelefono.replace(/\D/g, "");
  
  // Construir mensaje
  let mensaje = "";
  
  if (tipo === "ingreso") {
    mensaje = `🟢 *NUEVO PRÉSTAMO REGISTRADO*\n\n`;
    mensaje += `👤 Cliente: ${clienteNombre}\n`;
    mensaje += `💰 Monto: ${formatMonto(monto)}\n`;
    if (interes) {
      mensaje += `📈 Interés: ${interes}%\n`;
    }
    mensaje += `📅 Fecha: ${formatFecha(fecha)}\n`;
    mensaje += `\n_Préstamo registrado en CRM Coy_`;
  } else if (tipo === "pago") {
    mensaje = `🟢 *PAGO RECIBIDO*\n\n`;
    mensaje += `👤 Cliente: ${clienteNombre}\n`;
    mensaje += `💵 Monto: ${formatMonto(monto)}\n`;
    mensaje += `📝 Concepto: ${concepto}\n`;
    if (interes) {
      mensaje += `📈 Interés: ${interes}%\n`;
    }
    mensaje += `📅 Fecha: ${formatFecha(fecha)}\n`;
    mensaje += `\n_Pago registrado en CRM Coy_`;
  }

  // Crear enlace de WhatsApp
  const mensajeCodificado = encodeURIComponent(mensaje);
  const whatsappUrl = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

  return NextResponse.json({ ok: true, url: whatsappUrl });
}
