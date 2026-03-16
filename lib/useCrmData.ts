"use client";

import { useState, useEffect, useCallback } from "react";
import type { CrmData } from "./types";
import { MAX_REGISTROS, SALDO_INICIAL } from "./types";

async function api(action: string, payload?: object) {
  const res = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  return res.json();
}

async function sendNotification(tipo: "ingreso" | "egreso", payload: object) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, ...payload }),
    });
  } catch (_) {}
}

export function useCrmData() {
  const [data, setData] = useState<CrmData>({ saldoInicial: SALDO_INICIAL, ingresos: [], egresos: [] });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const d = await fetch("/api/data").then((r) => r.json());
    setData(d);
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const addIngreso = async (payload: Omit<CrmData["ingresos"][0], "id" | "createdAt">): Promise<boolean> => {
    const res = await api("addIngreso", payload);
    if (res.ok) { await refresh(); sendNotification("ingreso", payload); }
    return res.ok;
  };

  const addEgreso = async (payload: Omit<CrmData["egresos"][0], "id" | "createdAt">): Promise<boolean> => {
    const res = await api("addEgreso", payload);
    if (res.ok) { await refresh(); sendNotification("egreso", payload); }
    return res.ok;
  };

  const deleteIngreso = async (id: string) => {
    await api("deleteIngreso", { id });
    await refresh();
  };

  const deleteEgreso = async (id: string) => {
    await api("deleteEgreso", { id });
    await refresh();
  };

  const totalRegistros = data.ingresos.length + data.egresos.length;

  return {
    data,
    isLoading,
    addIngreso,
    addEgreso,
    deleteIngreso,
    deleteEgreso,
    refresh,
    totalRegistros,
    maxRegistros: MAX_REGISTROS,
    limiteAlcanzado: totalRegistros >= MAX_REGISTROS,
  };
}
