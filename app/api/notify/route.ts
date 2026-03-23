import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function formatMonto(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

function formatFecha(f: string) {
  return new Date(f).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clienteNombre, totalPrestado, totalPagado, totalInteres, pendiente, destinatario, movimientos } = body;

  const movimientosHtml = movimientos?.map((m: any) => {
    const color = m.tipo === "pago" ? "#10b981" : m.tipo === "prestamo" ? "#8b5cf6" : "#3b82f6";
    const bgColor = m.tipo === "pago" ? "#f0fdf4" : m.tipo === "prestamo" ? "#faf5ff" : "#eff6ff";
    const icon = m.tipo === "pago" ? "✅" : "💰";
    
    return `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;">${formatFecha(m.fecha)}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;">
          <span style="background:${bgColor};color:${color};padding:4px 8px;border-radius:4px;font-size:12px;font-weight:600;">${icon} ${m.tipo.toUpperCase()}</span>
        </td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;color:#1f2937;font-size:13px;">${m.concepto}</td>
        <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;color:${color};font-size:14px;">${formatMonto(m.monto)}</td>
      </tr>
    `;
  }).join("") || "";

  const html = `
    <div style="font-family:sans-serif;max-width:700px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#3b82f6,#7c3aed);padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:24px;">📊 Resumen Financiero</h1>
        <p style="color:#dbeafe;margin:8px 0 0;font-size:16px;font-weight:600;">${clienteNombre}</p>
      </div>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:16px;font-weight:600;color:#3b82f6;background:#eff6ff;border-bottom:1px solid #dbeafe;">💰 Total Prestado</td>
          <td style="padding:16px;color:#1f2937;border-bottom:1px solid #dbeafe;text-align:right;font-weight:700;">${formatMonto(totalPrestado)}</td>
        </tr>
        <tr>
          <td style="padding:16px;font-weight:600;color:#10b981;background:#f0fdf4;border-bottom:1px solid #bbf7d0;">✅ Total Pagado</td>
          <td style="padding:16px;color:#1f2937;border-bottom:1px solid #bbf7d0;text-align:right;font-weight:700;">${formatMonto(totalPagado)}</td>
        </tr>
        <tr>
          <td style="padding:16px;font-weight:600;color:#f59e0b;background:#fffbeb;border-bottom:1px solid #fde68a;">📈 Total Interés</td>
          <td style="padding:16px;color:#1f2937;border-bottom:1px solid #fde68a;text-align:right;font-weight:700;">${formatMonto(totalInteres)}</td>
        </tr>
        <tr>
          <td style="padding:16px;font-weight:600;color:#ef4444;background:#fef2f2;border-bottom:1px solid #fecaca;">⏳ Pendiente</td>
          <td style="padding:16px;color:#ef4444;border-bottom:1px solid #fecaca;text-align:right;font-weight:900;font-size:18px;">${formatMonto(pendiente)}</td>
        </tr>
      </table>

      ${movimientos?.length > 0 ? `
      <div style="padding:24px;background:#f9fafb;">
        <h2 style="color:#1f2937;font-size:18px;margin:0 0 16px 0;">📋 Detalle de Movimientos</h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;">
          <thead>
            <tr style="background:#f3f4f6;">
              <th style="padding:12px;text-align:left;color:#6b7280;font-size:12px;font-weight:600;">FECHA</th>
              <th style="padding:12px;text-align:left;color:#6b7280;font-size:12px;font-weight:600;">TIPO</th>
              <th style="padding:12px;text-align:left;color:#6b7280;font-size:12px;font-weight:600;">CONCEPTO</th>
              <th style="padding:12px;text-align:right;color:#6b7280;font-size:12px;font-weight:600;">MONTO</th>
            </tr>
          </thead>
          <tbody>
            ${movimientosHtml}
          </tbody>
        </table>
      </div>
      ` : ""}

      <p style="text-align:center;font-size:11px;color:#9ca3af;padding:16px;">
        Resumen generado automáticamente por CRM Coy
      </p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"CRM Coy" <${process.env.MAIL_USER}>`,
      to: destinatario,
      subject: `📊 Resumen Financiero - ${clienteNombre}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando correo:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
