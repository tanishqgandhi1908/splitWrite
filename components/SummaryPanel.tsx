"use client";

import { useState } from "react";
import type { BillSummary } from "@/lib/split";
import { formatMoney } from "@/lib/money";

interface Props {
  summary: BillSummary;
}

export default function SummaryPanel({ summary }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Who owes what</h2>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
          Total {formatMoney(summary.grandTotal)}
        </span>
      </div>

      {summary.participants.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">
          Add participants to see the split.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100">
          {summary.participants.map((p) => {
            const isOpen = expanded === p.participantId;
            return (
              <li key={p.participantId} className="py-2">
                <button
                  onClick={() =>
                    setExpanded(isOpen ? null : p.participantId)
                  }
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400 transition" aria-hidden>
                      {isOpen ? "▾" : "▸"}
                    </span>
                    <span className="font-medium">{p.name}</span>
                  </span>
                  <span className="text-base font-semibold tabular-nums">
                    {formatMoney(p.total)}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-2 space-y-1 pl-6 text-sm text-slate-600">
                    {p.items.length === 0 ? (
                      <p className="text-slate-400">No items selected.</p>
                    ) : (
                      p.items.map((it) => (
                        <div
                          key={it.itemId}
                          className="flex justify-between"
                        >
                          <span>{it.itemName}</span>
                          <span className="tabular-nums">
                            {formatMoney(it.share)}
                          </span>
                        </div>
                      ))
                    )}
                    <div className="mt-1 flex justify-between border-t border-slate-100 pt-1 text-slate-500">
                      <span>Items subtotal</span>
                      <span className="tabular-nums">
                        {formatMoney(p.itemsSubtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Tax</span>
                      <span className="tabular-nums">
                        +{formatMoney(p.taxShare)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Discount</span>
                      <span className="tabular-nums">
                        −{formatMoney(p.discountShare)}
                      </span>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {summary.chargesPending && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Tax &amp; discount will apply once items are assigned to participants.
        </p>
      )}

      <dl className="mt-4 space-y-1 border-t border-slate-100 pt-3 text-sm">
        <div className="flex justify-between text-slate-500">
          <dt>Items (assigned)</dt>
          <dd className="tabular-nums">{formatMoney(summary.itemsTotal)}</dd>
        </div>
        {summary.unassignedTotal > 0 && (
          <div className="flex justify-between text-amber-600">
            <dt>Unassigned items (excluded)</dt>
            <dd className="tabular-nums">
              {formatMoney(summary.unassignedTotal)}
            </dd>
          </div>
        )}
        <div className="flex justify-between text-slate-500">
          <dt>Tax</dt>
          <dd className="tabular-nums">+{formatMoney(summary.tax)}</dd>
        </div>
        <div className="flex justify-between text-slate-500">
          <dt>Discount</dt>
          <dd className="tabular-nums">−{formatMoney(summary.discount)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-100 pt-1 font-semibold">
          <dt>Grand total</dt>
          <dd className="tabular-nums">{formatMoney(summary.grandTotal)}</dd>
        </div>
      </dl>
    </section>
  );
}
