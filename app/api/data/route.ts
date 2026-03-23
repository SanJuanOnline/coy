import { NextRequest, NextResponse } from "next/server";
import { readData, writeData } from "@/lib/storage";
import type { Cliente, Movimiento } from "@/lib/types";

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username") || "";
  return NextResponse.json(await readData(username));
}

export async function POST(req: NextRequest) {
  const { action, payload, username } = await req.json();
  const data = await readData(username);

  if (action === "addCliente") {
    const nuevo: Cliente = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
    data.clientes.push(nuevo);
    await writeData(username, data);
    return NextResponse.json({ ok: true, item: nuevo });
  }

  if (action === "deleteCliente") {
    data.clientes = data.clientes.filter((c) => c.id !== payload.id);
    data.movimientos = data.movimientos.filter((m) => m.clienteId !== payload.id);
    await writeData(username, data);
    return NextResponse.json({ ok: true });
  }

  if (action === "addMovimiento") {
    const nuevo: Movimiento = { ...payload, id: crypto.randomUUID(), createdAt: Date.now() };
    data.movimientos.push(nuevo);
    await writeData(username, data);
    return NextResponse.json({ ok: true, item: nuevo });
  }

  if (action === "deleteMovimiento") {
    data.movimientos = data.movimientos.filter((m) => m.id !== payload.id);
    await writeData(username, data);
    return NextResponse.json({ ok: true });
  }

  if (action === "togglePagado") {
    const movimiento = data.movimientos.find((m) => m.id === payload.id);
    if (movimiento) {
      movimiento.pagado = !movimiento.pagado;
      await writeData(username, data);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "not found" });
  }

  if (action === "resetAll") {
    await writeData(username, { clientes: [], movimientos: [] });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
}
