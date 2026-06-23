"use client";

import { useCallback, useEffect, useState } from "react";
import type { Bill } from "./types";
import { loadBills, saveBills } from "./storage";

/**
 * Client-side store for bills, backed by localStorage. Loads once on mount,
 * persists on every change, and stays in sync across tabs via the `storage`
 * event.
 */
export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setBills(loadBills());
    setLoaded(true);

    function onStorage(e: StorageEvent) {
      if (e.key === null || e.key === "splitwrite.bills.v1") {
        setBills(loadBills());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (loaded) saveBills(bills);
  }, [bills, loaded]);

  const addBill = (bill: Bill) => setBills((prev) => [bill, ...prev]);

  const deleteBill = (id: string) =>
    setBills((prev) => prev.filter((b) => b.id !== id));

  const updateBill = (id: string, updater: (bill: Bill) => Bill) =>
    setBills((prev) => prev.map((b) => (b.id === id ? updater(b) : b)));

  return { bills, loaded, addBill, deleteBill, updateBill };
}
