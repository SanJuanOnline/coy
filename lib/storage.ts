import { kv } from "@vercel/kv";
import type { CrmData } from "./types";

export function getKey(username: string) {
  return `crm:data:${username}`;
}

export async function readData(username: string): Promise<CrmData> {
  try {
    const d = await kv.get<CrmData>(getKey(username));
    if (!d) return { clientes: [], movimientos: [] };
    return {
      clientes: Array.isArray(d.clientes) ? d.clientes : [],
      movimientos: Array.isArray(d.movimientos) ? d.movimientos : [],
    };
  } catch {
    return { clientes: [], movimientos: [] };
  }
}

export async function writeData(username: string, data: CrmData): Promise<void> {
  await kv.set(getKey(username), data);
}
