import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";
import { MAX_REGISTROS } from "@/lib/types";
import type { Ingreso, Egreso } from "@/lib/types";

export async function GET() {
  return NextResponse.json(readData());
}

export async function POST(req: NextRequest) {
  const { action, payload } = await req.json();
  const data = readData();
  const total = data.ingresos.length + data.egresos.length;

  if (action === "addIngreso") {
    if (total >= MAX_REGISTROS) return NextResponse.json({ ok: false, error: "limite" });
    const nuevo: Ingreso = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
    data.ingresos.push(nuevo);
    writeData(data);
    return NextResponse.json({ ok: true, item: nuevo });
  }

  if (action === "addEgreso") {
    if (total >= MAX_REGISTROS) return NextResponse.json({ ok: false, error: "limite" });
    const nuevo: Egreso = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
    data.egresos.push(nuevo);
    writeData(data);
    return NextResponse.json({ ok: true, item: nuevo });
  }

  if (action === "deleteIngreso") {
    data.ingresos = data.ingresos.filter((i) => i.id !== payload.id);
    writeData(data);
    return NextResponse.json({ ok: true });
  }

  if (action === "deleteEgreso") {
    data.egresos = data.egresos.filter((e) => e.id !== payload.id);
    writeData(data);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
