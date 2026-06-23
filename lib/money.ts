/** Money helpers. All internal math is done in integer cents to avoid
 *  floating-point rounding errors, then surfaced as 2-decimal dollars. */

/** Convert a dollar amount to integer cents (rounded to nearest cent). */
export function toCents(dollars: number): number {
  if (!Number.isFinite(dollars)) return 0;
  return Math.round(dollars * 100);
}

/** Convert integer cents back to a 2-decimal dollar number. */
export function toDollars(cents: number): number {
  return Math.round(cents) / 100;
}

/** Clamp an arbitrary numeric input to a non-negative 2-decimal value. */
export function clampMoney(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.round(value * 100) / 100;
}

/** Format a dollar amount as a 2-decimal string with a leading $. */
export function formatMoney(dollars: number): string {
  return `$${(Math.round(dollars * 100) / 100).toFixed(2)}`;
}

/**
 * Split `totalCents` into `n` integer parts that sum exactly to `totalCents`.
 * Any leftover cents are distributed one-by-one to the first parts so the
 * totals always reconcile (no money lost or invented to rounding).
 */
export function splitCents(totalCents: number, n: number): number[] {
  if (n <= 0) return [];
  const rounded = Math.round(totalCents);
  const base = Math.trunc(rounded / n);
  let remainder = rounded - base * n; // sign matches `rounded`
  const parts = new Array<number>(n).fill(base);
  const step = remainder >= 0 ? 1 : -1;
  remainder = Math.abs(remainder);
  for (let i = 0; i < remainder; i++) {
    parts[i] += step;
  }
  return parts;
}

/**
 * Distribute `totalCents` across recipients in proportion to `weights`, in
 * integer cents that sum exactly to `totalCents`. Uses the largest-remainder
 * method: floor every raw share, then hand the leftover cents to the
 * recipients with the biggest fractional parts. If all weights are zero (e.g.
 * no items assigned yet) it falls back to an even split so nothing is lost.
 */
export function allocateProportional(
  totalCents: number,
  weights: number[]
): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const total = Math.round(totalCents);
  const sumW = weights.reduce((a, w) => a + Math.max(0, w), 0);

  if (sumW <= 0) return splitCents(total, n);

  const raw = weights.map((w) => (total * Math.max(0, w)) / sumW);
  const floors = raw.map((r) => Math.floor(r));
  let remainder = total - floors.reduce((a, f) => a + f, 0);

  // Order recipients by descending fractional part, then ascending index.
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);

  const parts = floors.slice();
  for (let k = 0; k < remainder; k++) {
    parts[order[k % n].i] += 1;
  }
  return parts;
}
