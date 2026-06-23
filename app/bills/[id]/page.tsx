"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBills } from "@/lib/useBills";
import { newId } from "@/lib/storage";
import { computeSplit } from "@/lib/split";
import type { Bill, Item } from "@/lib/types";
import ParticipantsManager from "@/components/ParticipantsManager";
import ItemsManager from "@/components/ItemsManager";
import ChargesEditor from "@/components/ChargesEditor";
import SummaryPanel from "@/components/SummaryPanel";

export default function BillPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { bills, loaded, updateBill } = useBills();

  const bill = bills.find((b) => b.id === id);

  const update = (updater: (b: Bill) => Bill) => updateBill(id, updater);

  const summary = useMemo(
    () => (bill ? computeSplit(bill) : null),
    [bill]
  );

  if (!loaded) {
    return <p className="text-sm text-slate-400">Loading…</p>;
  }

  if (!bill || !summary) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">This bill could not be found.</p>
        <Link
          href="/"
          className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
        >
          ← Back to all bills
        </Link>
      </div>
    );
  }

  // ---- Participant mutations ----
  const addParticipant = (name: string) =>
    update((b) => ({
      ...b,
      participants: [...b.participants, { id: newId(), name }],
    }));

  const removeParticipant = (pid: string) =>
    update((b) => ({
      ...b,
      participants: b.participants.filter((p) => p.id !== pid),
      // Also unselect this participant from every item.
      items: b.items.map((it) => ({
        ...it,
        participantIds: it.participantIds.filter((x) => x !== pid),
      })),
    }));

  const renameParticipant = (pid: string, name: string) =>
    update((b) => ({
      ...b,
      participants: b.participants.map((p) =>
        p.id === pid ? { ...p, name } : p
      ),
    }));

  // ---- Item mutations ----
  const addItem = (name: string, quantity: number, price: number) =>
    update((b) => ({
      ...b,
      items: [
        ...b.items,
        { id: newId(), name, quantity, price, participantIds: [] },
      ],
    }));

  const updateItem = (itemId: string, patch: Partial<Item>) =>
    update((b) => ({
      ...b,
      items: b.items.map((it) =>
        it.id === itemId ? { ...it, ...patch } : it
      ),
    }));

  const removeItem = (itemId: string) =>
    update((b) => ({
      ...b,
      items: b.items.filter((it) => it.id !== itemId),
    }));

  const toggleParticipant = (itemId: string, pid: string) =>
    update((b) => ({
      ...b,
      items: b.items.map((it) => {
        if (it.id !== itemId) return it;
        const has = it.participantIds.includes(pid);
        return {
          ...it,
          participantIds: has
            ? it.participantIds.filter((x) => x !== pid)
            : [...it.participantIds, pid],
        };
      }),
    }));

  const setAllParticipants = (itemId: string, select: boolean) =>
    update((b) => ({
      ...b,
      items: b.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              participantIds: select ? b.participants.map((p) => p.id) : [],
            }
          : it
      ),
    }));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/"
          className="text-sm text-slate-400 transition hover:text-slate-600"
        >
          ← All bills
        </Link>
        <input
          value={bill.name}
          onChange={(e) => update((b) => ({ ...b, name: e.target.value }))}
          className="mt-1 w-full rounded-md border border-transparent bg-transparent text-2xl font-semibold tracking-tight outline-none hover:border-slate-200 focus:border-brand-500 focus:px-2"
          aria-label="Bill name"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <ParticipantsManager
            bill={bill}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            onRename={renameParticipant}
          />
          <ItemsManager
            bill={bill}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onRemoveItem={removeItem}
            onToggleParticipant={toggleParticipant}
            onSetAllParticipants={setAllParticipants}
          />
        </div>

        <div className="lg:col-span-2">
          <div className="space-y-6 lg:sticky lg:top-6">
            <ChargesEditor
              bill={bill}
              onChange={(patch) => update((b) => ({ ...b, ...patch }))}
            />
            <SummaryPanel summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
