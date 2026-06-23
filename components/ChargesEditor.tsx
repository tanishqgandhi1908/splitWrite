"use client";

import type { Bill } from "@/lib/types";
import MoneyInput from "./MoneyInput";

interface Props {
  bill: Bill;
  onChange: (patch: { tax?: number; discount?: number }) => void;
}

export default function ChargesEditor({ bill, onChange }: Props) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">Tax &amp; discount</h2>
      <p className="mt-1 text-xs text-slate-500">
        Distributed proportionally to each person&apos;s item subtotal.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Tax
          </label>
          <MoneyInput
            value={bill.tax}
            onChange={(v) => onChange({ tax: v })}
            ariaLabel="Tax amount"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Discount
          </label>
          <MoneyInput
            value={bill.discount}
            onChange={(v) => onChange({ discount: v })}
            ariaLabel="Discount amount"
          />
        </div>
      </div>
    </section>
  );
}
