import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const DESTINATARIO = "giovanycoy5@gmail.com";

// Configura tu cuenta de correo aquí.
// Para Gmail necesitas una "Contraseña de aplicación":
// https://myaccount.google.com/apppasswords
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

function formatMonto(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(n);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tipo, nombre, monto, concepto, fecha, comentarios } = body;

  const esIngreso = tipo === "ingreso";
  const emoji = esIngreso ? "💰" : "💸";
  const titulo = esIngreso ? "Nuevo Ingreso / Depósito" : "Nuevo Egreso / Pago";

  const filas = [
    ["Tipo", esIngreso ? "Ingreso (Depósito)" : "Egreso (Pago)"],
    ...(nombre ? [["Nombre", nombre]] : []),
    ["Concepto", concepto],
    ["Monto", formatMonto(Number(monto))],
    ["Fecha", fecha],
    ...(comentarios ? [["Comentarios", comentarios]] : []),
  ] as [string, string][];

  const filasHtml = filas
    .map(
      ([k, v]) => `
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:#7c3aed;background:#f5f3ff;border-bottom:1px solid #ede9fe;">${k}</td>
        <td style="padding:8px 12px;color:#1f2937;border-bottom:1px solid #ede9fe;">${v}</td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;border:1px solid #fbcfe8;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#db2777,#7c3aed);padding:24px;text-align:center;">
        <h1 style="color:#fff;margin:0;font-size:22px;">${emoji} ${titulo}</h1>
        <p style="color:#fce7f3;margin:4px 0 0;font-size:13px;">CRM Coy — Gestión financiera</p>
      </div>
      <table style="width:100%;border-collapse:collapse;">
        ${filasHtml}
      </table>
      <p style="text-align:center;font-size:11px;color:#9ca3af;padding:16px;">
        Registro generado automáticamente por CRM Coy
      </p>
    </div>`;

  try {
    await transporter.sendMail({
      from: `"CRM Coy" <${process.env.MAIL_USER}>`,
      to: DESTINATARIO,
      subject: `${emoji} ${titulo} — ${formatMonto(Number(monto))}`,
      html,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando correo:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
