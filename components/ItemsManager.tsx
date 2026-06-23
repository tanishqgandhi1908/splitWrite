"use client";

import { useState } from "react";
import type { Bill, Item } from "@/lib/types";
import { clampMoney, formatMoney, splitCents, toCents, toDollars } from "@/lib/money";
import MoneyInput from "./MoneyInput";

interface Props {
  bill: Bill;
  onAddItem: (name: string, quantity: number, price: number) => void;
  onUpdateItem: (id: string, patch: Partial<Item>) => void;
  onRemoveItem: (id: string) => void;
  onToggleParticipant: (itemId: string, participantId: string) => void;
  onSetAllParticipants: (itemId: string, select: boolean) => void;
}

export default function ItemsManager({
  bill,
  onAddItem,
  onUpdateItem,
  onRemoveItem,
  onToggleParticipant,
  onSetAllParticipants,
}: Props) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState(0);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const qty = Math.max(1, Math.trunc(Number(quantity) || 1));
    onAddItem(name.trim(), qty, clampMoney(price));
    setName("");
    setQuantity("1");
    setPrice(0);
  }

  const hasParticipants = bill.participants.length > 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">Items</h2>

      <form onSubmit={submit} className="mt-3 grid grid-cols-12 gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="col-span-12 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:col-span-5"
        />
        <input
          type="number"
          min={1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Qty"
          aria-label="Quantity"
          className="col-span-4 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 sm:col-span-2"
        />
        <div className="col-span-5 sm:col-span-3">
          <MoneyInput value={price} onChange={setPrice} ariaLabel="Unit price" />
        </div>
        <button
          type="submit"
          className="col-span-3 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-600 sm:col-span-2"
        >
          Add
        </button>
      </form>

      {bill.items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">
          No items yet. Add what was ordered above.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {bill.items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              bill={bill}
              hasParticipants={hasParticipants}
              onUpdateItem={onUpdateItem}
              onRemoveItem={onRemoveItem}
              onToggleParticipant={onToggleParticipant}
              onSetAllParticipants={onSetAllParticipants}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function ItemRow({
  item,
  bill,
  hasParticipants,
  onUpdateItem,
  onRemoveItem,
  onToggleParticipant,
  onSetAllParticipants,
}: {
  item: Item;
  bill: Bill;
  hasParticipants: boolean;
  onUpdateItem: Props["onUpdateItem"];
  onRemoveItem: Props["onRemoveItem"];
  onToggleParticipant: Props["onToggleParticipant"];
  onSetAllParticipants: Props["onSetAllParticipants"];
}) {
  const lineCents = toCents(item.price) * Math.max(0, Math.trunc(item.quantity));
  const lineTotal = toDollars(lineCents);
  const validIds = new Set(bill.participants.map((p) => p.id));
  const selectors = item.participantIds.filter((id) => validIds.has(id));
  const shares = splitCents(lineCents, selectors.length);
  const shareByParticipant = new Map<string, number>();
  selectors.forEach((id, i) => shareByParticipant.set(id, shares[i]));
  const allSelected =
    bill.participants.length > 0 && selectors.length === bill.participants.length;

  return (
    <li className="rounded-lg border border-slate-200 p-3">
      <div className="grid grid-cols-12 items-center gap-2">
        <input
          value={item.name}
          onChange={(e) => onUpdateItem(item.id, { name: e.target.value })}
          className="col-span-12 rounded-md border border-transparent px-2 py-1 text-sm font-medium outline-none hover:border-slate-200 focus:border-brand-500 sm:col-span-5"
          aria-label="Item name"
        />
        <div className="col-span-4 flex items-center gap-1 sm:col-span-2">
          <input
            type="number"
            min={1}
            step={1}
            value={item.quantity}
            onChange={(e) =>
              onUpdateItem(item.id, {
                quantity: Math.max(1, Math.trunc(Number(e.target.value) || 1)),
              })
            }
            className="w-full rounded-md border border-slate-300 px-2 py-1 text-sm outline-none focus:border-brand-500"
            aria-label="Quantity"
          />
        </div>
        <div className="col-span-5 sm:col-span-3">
          <MoneyInput
            value={item.price}
            onChange={(v) => onUpdateItem(item.id, { price: v })}
            ariaLabel="Unit price"
          />
        </div>
        <div className="col-span-3 flex items-center justify-end gap-2 sm:col-span-2">
          <span className="text-sm font-semibold tabular-nums">
            {formatMoney(lineTotal)}
          </span>
          <button
            onClick={() => onRemoveItem(item.id)}
            className="grid h-6 w-6 place-items-center rounded-md text-slate-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${item.name}`}
            title="Remove item"
          >
            ×
          </button>
        </div>
      </div>

      {hasParticipants ? (
        <div className="mt-3 border-t border-dashed border-slate-200 pt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Who shared this?
            </span>
            <button
              onClick={() => onSetAllParticipants(item.id, !allSelected)}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              {allSelected ? "Clear all" : "Select everyone"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {bill.participants.map((p) => {
              const selected = shareByParticipant.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => onToggleParticipant(item.id, p.id)}
                  className={
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition " +
                    (selected
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300")
                  }
                >
                  <span
                    className={
                      "grid h-4 w-4 place-items-center rounded-full text-[10px] " +
                      (selected ? "bg-brand-500 text-white" : "bg-slate-200 text-transparent")
                    }
                  >
                    ✓
                  </span>
                  {p.name}
                  {selected && (
                    <span className="tabular-nums text-xs text-brand-600">
                      {formatMoney(toDollars(shareByParticipant.get(p.id) ?? 0))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectors.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">
              Nobody selected — this item is excluded from the split.
            </p>
          )}
        </div>
      ) : (
        <p className="mt-2 text-xs text-slate-400">
          Add participants to assign who shared this item.
        </p>
      )}
    </li>
  );
}
