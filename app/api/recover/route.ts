import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

const CREDENTIALS_FILE = path.join(process.cwd(), "user-credentials.json");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
    const credentials = JSON.parse(data);

    const html = `
      <div style="font-family:sans-serif;max-width:500px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#3b82f6,#7c3aed);padding:24px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">🔐 Recuperación de Credenciales</h1>
        </div>
        
        <div style="padding:24px;">
          <p style="color:#1f2937;font-size:14px;margin-bottom:20px;">Tus credenciales de acceso al CRM Coy:</p>
          
          <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin-bottom:12px;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 4px 0;">Usuario:</p>
            <p style="color:#1f2937;font-size:16px;font-weight:700;margin:0;">${credentials.username}</p>
          </div>
          
          <div style="background:#f3f4f6;padding:16px;border-radius:8px;">
            <p style="color:#6b7280;font-size:12px;margin:0 0 4px 0;">Contraseña:</p>
            <p style="color:#1f2937;font-size:16px;font-weight:700;margin:0;">${credentials.password}</p>
          </div>
        </div>

        <p style="text-align:center;font-size:11px;color:#9ca3af;padding:16px;">
          CRM Coy - Sistema de Gestión Financiera
        </p>
      </div>`;

    await transporter.sendMail({
      from: `"CRM Coy" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "🔐 Recuperación de Credenciales - CRM Coy",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: "Error al enviar el correo" }, { status: 500 });
  }
}
