import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PIN_FILE = path.join(process.cwd(), "user-pin.json");

function readPin(): string | null {
  try {
    const data = fs.readFileSync(PIN_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.pin || null;
  } catch {
    return null;
  }
}

function writePin(pin: string): void {
  fs.writeFileSync(PIN_FILE, JSON.stringify({ pin }, null, 2), "utf-8");
}

export async function GET() {
  const pin = readPin();
  return NextResponse.json({ hasPin: !!pin });
}

export async function POST(req: NextRequest) {
  const { action, pin } = await req.json();

  if (action === "create") {
    const existingPin = readPin();
    if (existingPin) {
      return NextResponse.json({ ok: false, error: "Ya existe un PIN configurado" }, { status: 400 });
    }
    writePin(pin);
    return NextResponse.json({ ok: true });
  }

  if (action === "verify") {
    const correctPin = readPin();
    if (!correctPin) {
      return NextResponse.json({ ok: false, error: "No hay PIN configurado" }, { status: 400 });
    }
    if (pin === correctPin) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "PIN incorrecto" }, { status: 401 });
  }

  return NextResponse.json({ ok: false, error: "Acción no válida" }, { status: 400 });
}
