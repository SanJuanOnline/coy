import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CREDENTIALS_FILE = path.join(process.cwd(), "user-credentials.json");

interface Credentials {
  username: string;
  password: string;
}

function readCredentials(): Credentials | null {
  try {
    const data = fs.readFileSync(CREDENTIALS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function writeCredentials(username: string, password: string): void {
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify({ username, password }, null, 2), "utf-8");
}

export async function GET() {
  const credentials = readCredentials();
  return NextResponse.json({ hasUser: !!credentials, username: credentials?.username || null });
}

export async function POST(req: NextRequest) {
  const { action, username, password } = await req.json();

  if (action === "create") {
    const existing = readCredentials();
    if (existing) {
      return NextResponse.json({ ok: false, error: "Ya existe un usuario configurado" }, { status: 400 });
    }
    writeCredentials(username, password);
    return NextResponse.json({ ok: true });
  }

  if (action === "verify") {
    const credentials = readCredentials();
    if (!credentials) {
      return NextResponse.json({ ok: false, error: "No hay usuario configurado" }, { status: 400 });
    }
    if (username === credentials.username && password === credentials.password) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  if (action === "recover") {
    const credentials = readCredentials();
    if (!credentials) {
      return NextResponse.json({ ok: false, error: "No hay usuario configurado" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, username: credentials.username, password: credentials.password });
  }

  return NextResponse.json({ ok: false, error: "Acción no válida" }, { status: 400 });
}
