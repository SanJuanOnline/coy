export const SALDO_INICIAL = 35000;
export const MAX_REGISTROS = 3000;

export interface Ingreso {
  id: string;
  nombre: string;
  monto: number;
  concepto: string;
  fecha: string;
  createdAt: number;
}

export interface Egreso {
  id: string;
  concepto: string;
  monto: number;
  fecha: string;
  comentarios: string;
  createdAt: number;
}

export interface CrmData {
  saldoInicial: number;
  ingresos: Ingreso[];
  egresos: Egreso[];
}

export function getSaldoActual(data: CrmData): number {
  const totalIngresos = data.ingresos.reduce((s, i) => s + i.monto, 0);
  const totalEgresos = data.egresos.reduce((s, e) => s + e.monto, 0);
  return data.saldoInicial + totalIngresos - totalEgresos;
}
