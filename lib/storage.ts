import { kv } from "@vercel/kv";
import type { CrmData } from "./types";

const KEY = "crm:data";

export async function readData(): Promise<CrmData> {
  try {
    const d = await kv.get<CrmData>(KEY);
    if (!d) return { clientes: [], movimientos: [] };
    return {
      clientes: Array.isArray(d.clientes) ? d.clientes : [],
      movimientos: Array.isArray(d.movimientos) ? d.movimientos : [],
    };
  } catch {
    return { clientes: [], movimientos: [] };
  }
}

export async function writeData(data: CrmData): Promise<void> {
  await kv.set(KEY, data);
}
