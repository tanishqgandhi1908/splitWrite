"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useBills } from "@/lib/useBills";
import { createEmptyBill } from "@/lib/storage";
import { computeSplit } from "@/lib/split";
import { formatMoney } from "@/lib/money";

export default function HomePage() {
  const { bills, loaded, addBill, deleteBill } = useBills();
  const [name, setName] = useState("");

  const totals = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of bills) map.set(b.id, computeSplit(b).grandTotal);
    return map;
  }, [bills]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const bill = createEmptyBill(name);
    addBill(bill);
    setName("");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-semibold">Your bills</h1>
        <p className="mt-1 text-sm text-slate-500">
          Create a bill, add items and participants, then let everyone pick what
          they shared.
        </p>
        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Bill name (e.g. Dinner at Luigi's)"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <button
            type="submit"
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            + New bill
          </button>
        </form>
      </section>

      {!loaded ? (
        <p className="text-sm text-slate-400">Loading…</p>
      ) : bills.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white/50 p-10 text-center text-sm text-slate-500">
          No bills yet. Create your first one above.
        </div>
      ) : (
        <ul className="space-y-3">
          {bills.map((bill) => (
            <li
              key={bill.id}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-300"
            >
              <Link href={`/bills/${bill.id}`} className="flex-1">
                <div className="font-medium">{bill.name}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {bill.participants.length} participant
                  {bill.participants.length === 1 ? "" : "s"} · {bill.items.length}{" "}
                  item{bill.items.length === 1 ? "" : "s"} ·{" "}
                  {new Date(bill.createdAt).toLocaleDateString()}
                </div>
              </Link>
              <div className="flex items-center gap-4 pl-4">
                <span className="text-base font-semibold text-slate-800">
                  {formatMoney(totals.get(bill.id) ?? 0)}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${bill.name}"? This cannot be undone.`)) {
                      deleteBill(bill.id);
                    }
                  }}
                  className="rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  aria-label="Delete bill"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
