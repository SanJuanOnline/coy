import Dexie, { Table } from 'dexie';
import { Cliente, Movimiento } from './types';

export class CrmDatabase extends Dexie {
  clientes!: Table<Cliente, string>;
  movimientos!: Table<Movimiento, string>;

  constructor() {
    super('CrmCoyDB');
    
    this.version(1).stores({
      clientes: 'id, nombre, telefono, email, createdAt',
      movimientos: 'id, clienteId, tipo, fecha, pagado, createdAt'
    });
  }
}

export const db = new CrmDatabase();
