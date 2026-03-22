import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

const KEY = "crm:credentials";

interface Credentials {
  username: string;
  password: string;
}

async function readCredentials(): Promise<Credentials | null> {
  return await kv.get<Credentials>(KEY);
}

async function writeCredentials(username: string, password: string): Promise<void> {
  await kv.set(KEY, { username, password });
}

export async function GET() {
  const credentials = await readCredentials();
  return NextResponse.json({ hasUser: !!credentials, username: credentials?.username || null });
}

export async function POST(req: NextRequest) {
  const { action, username, password } = await req.json();

  if (action === "create") {
    const existing = await readCredentials();
    if (existing) {
      return NextResponse.json({ ok: false, error: "Ya existe un usuario configurado" }, { status: 400 });
    }
    await writeCredentials(username, password);
    return NextResponse.json({ ok: true });
  }

  if (action === "verify") {
    const credentials = await readCredentials();
    if (!credentials) {
      return NextResponse.json({ ok: false, error: "No hay usuario configurado" }, { status: 400 });
    }
    if (username === credentials.username && password === credentials.password) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "Usuario o contraseña incorrectos" }, { status: 401 });
  }

  if (action === "recover") {
    const credentials = await readCredentials();
    if (!credentials) {
      return NextResponse.json({ ok: false, error: "No hay usuario configurado" }, { status: 400 });
    }
    return NextResponse.json({ ok: true, username: credentials.username, password: credentials.password });
  }

  return NextResponse.json({ ok: false, error: "Acción no válida" }, { status: 400 });
}
