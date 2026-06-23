import type { Bill } from "./types";
import { allocateProportional, splitCents, toCents, toDollars } from "./money";

export interface ItemShare {
  itemId: string;
  itemName: string;
  /** This participant's share of the item, in dollars. */
  share: number;
}

export interface ParticipantBreakdown {
  participantId: string;
  name: string;
  /** Sum of all item shares, in dollars. */
  itemsSubtotal: number;
  /** Equal share of tax, in dollars. */
  taxShare: number;
  /** Equal share of discount, in dollars (a positive number that is subtracted). */
  discountShare: number;
  /** itemsSubtotal + taxShare - discountShare, in dollars. */
  total: number;
  /** Per-item contribution detail. */
  items: ItemShare[];
}

export interface BillSummary {
  participants: ParticipantBreakdown[];
  itemsTotal: number;
  tax: number;
  discount: number;
  /** itemsTotal + tax - discount. */
  grandTotal: number;
  /** Sum of every line total, including items nobody selected. */
  grossItemsTotal: number;
  /** Line total of items with no participants selected (unassigned). */
  unassignedTotal: number;
  /** True when tax/discount were entered but no items are assigned yet, so
   *  they have not been applied (the split hasn't started). */
  chargesPending: boolean;
}

/**
 * Compute the per-participant split for a bill.
 *
 * Rules:
 *  - Each item's line total (unit price x quantity) is split equally among the
 *    participants who selected it.
 *  - Tax is distributed proportionally to each participant's item subtotal
 *    and added.
 *  - Discount is distributed proportionally to each participant's item
 *    subtotal and subtracted.
 *  - All arithmetic is in integer cents so the per-person totals reconcile
 *    exactly with the grand total.
 */
export function computeSplit(bill: Bill): BillSummary {
  const participants = bill.participants;

  // Accumulators keyed by participant id, in cents.
  const itemCents = new Map<string, number>();
  const itemDetail = new Map<string, ItemShare[]>();
  for (const p of participants) {
    itemCents.set(p.id, 0);
    itemDetail.set(p.id, []);
  }

  const validIds = new Set(participants.map((p) => p.id));
  let grossItemsCents = 0;
  let unassignedCents = 0;

  for (const item of bill.items) {
    const lineCents = toCents(item.price) * Math.max(0, Math.trunc(item.quantity));
    grossItemsCents += lineCents;

    const selectors = item.participantIds.filter((id) => validIds.has(id));
    if (selectors.length === 0) {
      unassignedCents += lineCents;
      continue;
    }

    const shares = splitCents(lineCents, selectors.length);
    selectors.forEach((pid, idx) => {
      const shareCents = shares[idx];
      itemCents.set(pid, (itemCents.get(pid) ?? 0) + shareCents);
      itemDetail.get(pid)!.push({
        itemId: item.id,
        itemName: item.name,
        share: toDollars(shareCents),
      });
    });
  }

  // Weight tax/discount by each participant's item subtotal (proportional).
  const weights = participants.map((p) => itemCents.get(p.id) ?? 0);
  const totalWeight = weights.reduce((a, w) => a + w, 0);
  const hasAssignedItems = totalWeight > 0;

  // The split only starts once items are assigned to participants. Until then
  // tax/discount are held back — otherwise a discount would drag everyone
  // negative before anyone has picked anything.
  const taxCents = hasAssignedItems ? toCents(bill.tax) : 0;
  const discountCents = hasAssignedItems ? toCents(bill.discount) : 0;
  const taxShares = allocateProportional(taxCents, weights);
  const discountShares = allocateProportional(discountCents, weights);

  const breakdown: ParticipantBreakdown[] = participants.map((p, idx) => {
    const items = itemCents.get(p.id) ?? 0;
    const tax = taxShares[idx] ?? 0;
    const disc = discountShares[idx] ?? 0;
    const totalCents = items + tax - disc;
    return {
      participantId: p.id,
      name: p.name,
      itemsSubtotal: toDollars(items),
      taxShare: toDollars(tax),
      discountShare: toDollars(disc),
      total: toDollars(totalCents),
      items: itemDetail.get(p.id) ?? [],
    };
  });

  const assignedItemsCents = grossItemsCents - unassignedCents;
  const grandCents = assignedItemsCents + taxCents - discountCents;

  return {
    participants: breakdown,
    itemsTotal: toDollars(assignedItemsCents),
    tax: toDollars(taxCents),
    discount: toDollars(discountCents),
    grandTotal: toDollars(grandCents),
    grossItemsTotal: toDollars(grossItemsCents),
    unassignedTotal: toDollars(unassignedCents),
    chargesPending:
      !hasAssignedItems &&
      (toCents(bill.tax) > 0 || toCents(bill.discount) > 0),
  };
}
