export const MAX_REGISTROS = 3000;

export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  notas: string;
  frecuenciaPago?: "semanal" | "quincenal" | "mensual" | "otro";
  cantidadPagos?: number;
  createdAt: string;
}

export interface Movimiento {
  id: string;
  clienteId: string;
  tipo: "credito" | "prestamo" | "pago" | "interes" | "otro";
  concepto: string;
  monto: number;
  fecha: string;
  interes?: number; // Porcentaje de interés si aplica
  pagado: boolean;
  createdAt: string;
}

export interface CrmData {
  clientes: Cliente[];
  movimientos: Movimiento[];
}

export function getSaldoCliente(clienteId: string, movimientos: Movimiento[]): {
  totalPrestado: number;
  totalPagado: number;
  totalInteres: number;
  pendiente: number;
} {
  const movs = movimientos.filter(m => m.clienteId === clienteId);
  
  const totalPrestado = movs
    .filter(m => m.tipo === "credito" || m.tipo === "prestamo")
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalPagado = movs
    .filter(m => m.tipo === "pago" && m.pagado)
    .reduce((sum, m) => sum + m.monto, 0);
  
  const totalInteres = movs
    .filter(m => m.tipo === "interes")
    .reduce((sum, m) => sum + m.monto, 0);
  
  const pendiente = totalPrestado + totalInteres - totalPagado;
  
  return { totalPrestado, totalPagado, totalInteres, pendiente };
}
