"use client";

import { useEffect, useState } from "react";
import { clampMoney } from "@/lib/money";

interface MoneyInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * A numeric money field. Lets the user type freely (including a trailing dot
 * while entering), reports a clamped non-negative number on change, and
 * normalizes to exactly 2 decimals on blur.
 */
export default function MoneyInput({
  value,
  onChange,
  placeholder,
  className,
  ariaLabel,
}: MoneyInputProps) {
  const [text, setText] = useState(value ? String(value) : "");

  // Keep the field in sync when the value changes from outside (e.g. reset).
  useEffect(() => {
    const current = parseFloat(text);
    if (!Number.isFinite(current) || clampMoney(current) !== value) {
      setText(value ? String(value) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow only digits and a single decimal point, max 2 decimal places.
    if (raw !== "" && !/^\d*\.?\d{0,2}$/.test(raw)) return;
    setText(raw);
    const parsed = parseFloat(raw);
    onChange(Number.isFinite(parsed) ? clampMoney(parsed) : 0);
  }

  function handleBlur() {
    if (text === "" || text === ".") {
      setText("");
      onChange(0);
      return;
    }
    const normalized = clampMoney(parseFloat(text));
    setText(normalized ? normalized.toFixed(2) : "");
    onChange(normalized);
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder ?? "0.00"}
        aria-label={ariaLabel}
        className={
          className ??
          "w-full rounded-lg border border-slate-300 py-2 pl-6 pr-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }
      />
    </div>
  );
}
