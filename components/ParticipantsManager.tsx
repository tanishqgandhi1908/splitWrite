"use client";

import { useState } from "react";
import type { Bill } from "@/lib/types";

interface Props {
  bill: Bill;
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
}

export default function ParticipantsManager({
  bill,
  onAdd,
  onRemove,
  onRename,
}: Props) {
  const [name, setName] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim());
    setName("");
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Participants</h2>
        <span className="text-xs text-slate-400">
          {bill.participants.length} total
        </span>
      </div>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a person"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-900"
        >
          Add
        </button>
      </form>

      {bill.participants.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">
          Add the people sharing this bill.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {bill.participants.map((p) => (
            <li
              key={p.id}
              className="group flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 py-1 pl-3 pr-1 text-sm"
            >
              <input
                value={p.name}
                onChange={(e) => onRename(p.id, e.target.value)}
                className="w-24 bg-transparent outline-none focus:w-32"
                aria-label="Participant name"
              />
              <button
                onClick={() => onRemove(p.id)}
                className="grid h-5 w-5 place-items-center rounded-full text-slate-400 transition hover:bg-red-100 hover:text-red-600"
                aria-label={`Remove ${p.name}`}
                title="Remove"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
