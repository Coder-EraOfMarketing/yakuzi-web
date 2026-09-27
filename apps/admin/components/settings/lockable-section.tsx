"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Lock } from "lucide-react";
import { Button, Input } from "@/components/ui";

interface Field {
  key: string;
  label: string;
  type?: string;
}

/**
 * A settings section whose fields are locked against accidental edits.
 *
 * These fields hold a live connection (Merchant Center account/data-source
 * IDs, the Meta Pixel ID). Clearing or mistyping one silently breaks the
 * integration, so the fields render read-only until the admin deliberately
 * unlocks them: a warning appears and they must type the word "change" to
 * enable editing. Nothing here weakens server-side permissions — it only
 * stops a fat-finger edit by someone who already has Settings access.
 */
export function LockableSection({
  icon: Icon,
  title,
  warning,
  fields,
  delay,
  form,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  /** One line naming what breaks if this is changed carelessly. */
  warning: string;
  fields: Field[];
  delay: number;
  form: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const canEnable = typed.trim().toLowerCase() === "change";

  const enableEditing = () => {
    if (!canEnable) return;
    setUnlocked(true);
    setConfirming(false);
    setTyped("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-4.5 w-4.5 text-primary" aria-hidden />
          </div>
          <h2 className="font-semibold text-foreground">{title}</h2>
        </div>
        {!unlocked ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
          >
            <Lock className="h-3.5 w-3.5" /> Locked — click to change
          </button>
        ) : (
          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
            Editing enabled
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, type }) => (
          <Input
            key={key}
            label={label}
            type={type}
            value={(form[key] as string | number | undefined) ?? ""}
            disabled={!unlocked}
            onChange={(e) => onChange(key, type === "number" ? Number(e.target.value) : e.target.value)}
          />
        ))}
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Confirm changing ${title}`}
        >
          <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-xl border border-border">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Change {title}?</h3>
                <p className="mt-1 text-sm text-muted-foreground">{warning}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-foreground">
              To enable editing, type <span className="font-semibold">change</span> below.
            </p>
            <input
              autoFocus
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enableEditing();
              }}
              placeholder="change"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirming(false);
                  setTyped("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={enableEditing} disabled={!canEnable}>
                Enable editing
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
