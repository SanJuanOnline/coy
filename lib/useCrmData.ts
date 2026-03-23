"use client";

import { useState, useEffect, useCallback } from "react";
import type { Cliente, Movimiento } from "./types";

interface CrmData {
  clientes: Cliente[];
  movimientos: Movimiento[];
}

function getUsername() {
  return typeof window !== "undefined" ? sessionStorage.getItem("username") || "" : "";
}

async function api(action: string, payload?: object) {
  const res = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload, username: getUsername() }),
  });
  return res.json();
}

export function useCrmData() {
  const [data, setData] = useState<CrmData>({ clientes: [], movimientos: [] });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    const username = getUsername();
    const res = await fetch(`/api/data?username=${encodeURIComponent(username)}`);
    const d = await res.json();
    setData(d);
  }, []);

  useEffect(() => {
    refresh().finally(() => setIsLoading(false));
  }, [refresh]);

  const addCliente = async (payload: Omit<Cliente, "id" | "createdAt">): Promise<string | null> => {
    const res = await api("addCliente", payload);
    if (res.ok) { await refresh(); return res.item.id; }
    return null;
  };

  const deleteCliente = async (id: string) => {
    await api("deleteCliente", { id });
    await refresh();
  };

  const addMovimiento = async (payload: Omit<Movimiento, "id" | "createdAt">): Promise<boolean> => {
    const res = await api("addMovimiento", payload);
    if (res.ok) { await refresh(); return true; }
    return false;
  };

  const deleteMovimiento = async (id: string) => {
    await api("deleteMovimiento", { id });
    await refresh();
  };

  const togglePagado = async (id: string) => {
    await api("togglePagado", { id });
    await refresh();
  };

  const resetAll = async () => {
    await api("resetAll");
    await refresh();
  };

  return { data, isLoading, addCliente, deleteCliente, addMovimiento, deleteMovimiento, togglePagado, resetAll, refresh };
}
