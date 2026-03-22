import fs from "fs";
import path from "path";
import type { CrmData } from "./types";

const FILE = path.join(process.cwd(), "data.json");

export function readData(): CrmData {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    const d = JSON.parse(raw) as CrmData;
    return {
      clientes: Array.isArray(d.clientes) ? d.clientes : [],
      movimientos: Array.isArray(d.movimientos) ? d.movimientos : [],
    };
  } catch {
    return { clientes: [], movimientos: [] };
  }
}

export function writeData(data: CrmData): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}
