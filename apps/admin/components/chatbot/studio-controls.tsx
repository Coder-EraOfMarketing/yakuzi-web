"use client";

import React from "react";

/**
 * The building blocks of the Studio.
 *
 * Every control here explains itself in words. A dial is not labelled "detail:
 * 45" — it is labelled with the sentence the assistant will follow at that
 * setting, so somebody who has never written a prompt can predict what moving
 * it will do before they move it.
 */

export function Dial({
  label,
  hint,
  low,
  high,
  value,
  onChange,
  reading,
}: {
  label: string;
  hint: string;
  low: string;
  high: string;
  value: number;
  onChange: (v: number) => void;
  /** What the assistant is told at this setting, in plain words. */
  reading: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <label className="text-sm font-semibold text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-primary"
        aria-label={label}
      />

      <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
        <span>{low}</span>
        <span>{high}</span>
      </div>

      {/* The whole point: you see the instruction, not the number. */}
      <p className="mt-2 rounded-lg bg-muted/40 px-3 py-2 text-xs leading-relaxed text-foreground/80">
        {reading}
      </p>
    </div>
  );
}

export function Toggle({
  label,
  description,
  whenOff,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  /** What the assistant does instead when this is switched off. */
  whenOff: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full rounded-2xl border p-4 text-left transition-colors ${
        checked
          ? "border-primary/40 bg-primary/5"
          : "border-border/60 bg-card/40 hover:border-border"
      }`}
      aria-pressed={checked}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {checked ? description : whenOff}
          </p>
        </div>
        <span
          className={`mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            checked ? "bg-primary" : "bg-muted-foreground/30"
          }`}
        >
          <span
            className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-[22px]" : "translate-x-0.5"
            }`}
          />
        </span>
      </div>
    </button>
  );
}

/**
 * A list of short phrases — "never say", "always do", blocked subjects.
 * Add with Enter, remove with the ×. No JSON, no commas to get wrong.
 */
export function PhraseList({
  label,
  description,
  placeholder,
  items,
  onChange,
  max = 50,
  tone = "neutral",
}: {
  label: string;
  description: string;
  placeholder: string;
  items: string[];
  onChange: (items: string[]) => void;
  max?: number;
  tone?: "neutral" | "danger";
}) {
  const [draft, setDraft] = React.useState("");

  const add = () => {
    const value = draft.trim();
    if (!value || items.length >= max) return;
    // Silently ignoring a duplicate is friendlier than an error nobody caused
    // on purpose.
    if (!items.some((i) => i.toLowerCase() === value.toLowerCase())) {
      onChange([...items, value]);
    }
    setDraft("");
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <p className="text-sm font-semibold text-foreground">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>

      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={add}
          disabled={!draft.trim() || items.length >= max}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
        >
          Add
        </button>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <li
              key={item}
              className={`inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1.5 text-xs ${
                tone === "danger"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-muted text-foreground/80"
              }`}
            >
              <span className="truncate">{item}</span>
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                aria-label={`Remove ${item}`}
                className="shrink-0 opacity-60 hover:opacity-100"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {items.length >= max && (
        <p className="mt-2 text-xs text-muted-foreground">
          That&apos;s the maximum of {max}. Remove one to add another.
        </p>
      )}
    </div>
  );
}

/** A number with its unit spelled out, and what 0 means where 0 is allowed. */
export function NumberField({
  label,
  description,
  value,
  onChange,
  min,
  max,
  unit,
  zeroMeans,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  zeroMeans?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4">
      <label className="text-sm font-semibold text-foreground">{label}</label>
      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            // Clamp here as well as on the server: a typo should not be
            // saveable in the first place.
            onChange(Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : min);
          }}
          className="w-32 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      {zeroMeans && value === 0 && (
        <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">{zeroMeans}</p>
      )}
    </div>
  );
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
