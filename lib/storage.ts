import fs from "fs";
import path from "path";
import type { CrmData } from "./types";
import { SALDO_INICIAL } from "./types";

const FILE = path.join(process.cwd(), "data.json");

export function readData(): CrmData {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    const d = JSON.parse(raw) as CrmData;
    return {
      saldoInicial: d.saldoInicial ?? SALDO_INICIAL,
      ingresos: Array.isArray(d.ingresos) ? d.ingresos : [],
      egresos: Array.isArray(d.egresos) ? d.egresos : [],
    };
  } catch {
    return { saldoInicial: SALDO_INICIAL, ingresos: [], egresos: [] };
  }
}

export function writeData(data: CrmData): void {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}
