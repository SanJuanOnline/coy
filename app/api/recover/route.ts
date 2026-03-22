import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { kv } from "@vercel/kv";

type Users = Record<string, string>;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
});

export async function POST() {
  try {
    const users = (await kv.get<Users>("crm:users")) ?? {};
    const entries = Object.entries(users);

    if (entries.length === 0) {
      return NextResponse.json({ ok: false, error: "No hay usuarios registrados" }, { status: 400 });
    }

    const rows = entries.map(([u, p]) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;">${u}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e5e7eb;">${p}</td>
      </tr>`).join("");

    const html = `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#3b82f6,#7c3aed);padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:22px;">🔐 Recuperación de Credenciales</h1>
        </div>
        <div style="padding:24px;">
          <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:10px 16px;text-align:left;color:#6b7280;font-size:12px;">USUARIO</th>
                <th style="padding:10px 16px;text-align:left;color:#6b7280;font-size:12px;">CONTRASEÑA</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <p style="text-align:center;font-size:11px;color:#9ca3af;padding:16px;">CRM Coy</p>
      </div>`;

    await transporter.sendMail({
      from: `"CRM Coy" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "🔐 Recuperación de Credenciales - CRM Coy",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ ok: false, error: "Error al enviar el correo" }, { status: 500 });
  }
}
