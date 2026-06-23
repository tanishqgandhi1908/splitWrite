import type { Bill } from "./types";

const STORAGE_KEY = "splitwrite.bills.v1";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadBills(): Bill[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Bill[];
  } catch {
    return [];
  }
}

export function saveBills(bills: Bill[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
  } catch {
    // Storage may be full or unavailable; fail silently.
  }
}

/** Generate a reasonably unique id, with a fallback for older browsers. */
export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createEmptyBill(name: string): Bill {
  return {
    id: newId(),
    name: name.trim() || "Untitled bill",
    createdAt: Date.now(),
    participants: [],
    items: [],
    tax: 0,
    discount: 0,
  };
}
