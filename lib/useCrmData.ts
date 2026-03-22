"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "./db";
import type { CrmData, Cliente, Movimiento } from "./types";

// Generar ID único compatible con navegador
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useCrmData() {
  const [data, setData] = useState<CrmData>({ clientes: [], movimientos: [] });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    console.log('🔄 Refrescando datos...');
    const clientes = await db.clientes.toArray();
    const movimientos = await db.movimientos.toArray();
    console.log('📊 Clientes:', clientes.length, 'Movimientos:', movimientos.length);
    setData({ clientes, movimientos });
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const addCliente = async (payload: Omit<Cliente, "id" | "createdAt">): Promise<string | null> => {
    try {
      const id = generateId();
      console.log('🔵 Guardando cliente:', { ...payload, id });
      await db.clientes.add({ ...payload, id, createdAt: new Date().toISOString() });
      console.log('✅ Cliente guardado en IndexedDB');
      await refresh();
      console.log('✅ Refresh completado');
      return id;
    } catch (error) {
      console.error('❌ Error guardando cliente:', error);
      return null;
    }
  };

  const deleteCliente = async (id: string) => {
    await db.clientes.delete(id);
    await db.movimientos.where("clienteId").equals(id).delete();
    await refresh();
  };

  const addMovimiento = async (payload: Omit<Movimiento, "id" | "createdAt">): Promise<boolean> => {
    try {
      const id = generateId();
      await db.movimientos.add({ ...payload, id, createdAt: new Date().toISOString() });
      await refresh();
      return true;
    } catch (error) {
      console.error('❌ Error guardando movimiento:', error);
      return false;
    }
  };

  const deleteMovimiento = async (id: string) => {
    await db.movimientos.delete(id);
    await refresh();
  };

  const togglePagado = async (id: string) => {
    const mov = await db.movimientos.get(id);
    if (mov) {
      await db.movimientos.update(id, { pagado: !mov.pagado });
      await refresh();
    }
  };

  const resetAll = async () => {
    await db.clientes.clear();
    await db.movimientos.clear();
    await refresh();
  };

  return {
    data,
    isLoading,
    addCliente,
    deleteCliente,
    addMovimiento,
    deleteMovimiento,
    togglePagado,
    resetAll,
    refresh,
  };
}
