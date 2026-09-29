"use client";
import { useState } from "react";
import { AlertCircle, Check, Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Select, Input, Button } from "@/components/ui";

/**
 * Pick several authors, or several categories, and say which is primary.
 *
 * The first one chosen is the primary: it becomes BlogPost.authorId /
 * BlogPost.categoryId on the API, which is what the storefront byline, the
 * author pages and the Article schema's articleSection read. That is not an
 * implementation detail to hide — an author choosing two categories needs to
 * know which of them owns the post, so the first chip says so and can be
 * changed.
 */
export function MultiSelectWithCreate({
  label,
  singular,
  options,
  values,
  onChange,
  onCreate,
  detail,
  loadFailed,
  helpText,
}: {
  label: string;
  /** For messages: "category", "author". */
  singular: string;
  options: Array<{ id: string; name: string }>;
  values: string[];
  onChange: (next: string[]) => void;
  onCreate: (name: string, detail?: string) => Promise<{ id: string } | void>;
  /** An optional second field captured when creating (an author's bio). */
  detail?: { label: string; placeholder: string };
  loadFailed?: boolean;
  helpText?: string;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [detailDraft, setDetailDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const byId = new Map(options.map((o) => [o.id, o]));
  const chosen = values.filter((id) => byId.has(id));
  const available = options.filter((o) => !values.includes(o.id));

  const add = (id: string) => {
    if (!id || values.includes(id)) return;
    onChange([...values, id]);
  };

  const remove = (id: string) => onChange(values.filter((v) => v !== id));

  /** Promote to primary — the one the storefront treats as the post's own. */
  const makePrimary = (id: string) => onChange([id, ...values.filter((v) => v !== id)]);

  const submit = async () => {
    const name = draft.trim();
    if (!name) return;

    // Typing a name already in the list is a selection, not a creation.
    const existing = options.find(
      (o) => o.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      add(existing.id);
      setDraft("");
      setDetailDraft("");
      setAdding(false);
      toast.success(
        values.includes(existing.id)
          ? `"${existing.name}" is already selected.`
          : `Added the existing ${singular} "${existing.name}".`,
      );
      return;
    }

    setSaving(true);
    try {
      const created = await onCreate(name, detailDraft.trim() || undefined);
      if (created && "id" in created) add(created.id);
      setDraft("");
      setDetailDraft("");
      setAdding(false);
      toast.success(`${label} "${name}" created.`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? `Could not create that ${singular}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <Plus className="h-3 w-3" /> New
        </button>
      </div>

      {chosen.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {chosen.map((id, index) => {
            const option = byId.get(id)!;
            const primary = index === 0;
            return (
              <li
                key={id}
                className={
                  "group flex items-center gap-1 rounded-lg border px-2 py-1 text-xs " +
                  (primary
                    ? "border-primary/40 bg-primary/10 text-foreground"
                    : "border-border bg-muted/40 text-muted-foreground")
                }
              >
                {primary && (
                  <span className="text-[10px] font-semibold uppercase text-primary">Primary</span>
                )}
                <span className="max-w-[12rem] truncate">{option.name}</span>
                {!primary && (
                  <button
                    type="button"
                    onClick={() => makePrimary(id)}
                    title={`Make this the primary ${singular}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Check className="h-3 w-3" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(id)}
                  title={`Remove ${option.name}`}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {adding ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <Input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={`New ${singular} name`}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); submit(); }
                if (e.key === "Escape") setAdding(false);
              }}
            />
            <Button type="button" size="sm" loading={saving} onClick={submit} className="px-2.5">
              <Check className="h-4 w-4" />
            </Button>
            <Button
              type="button" size="sm" variant="ghost" className="px-2.5"
              onClick={() => { setAdding(false); setDraft(""); setDetailDraft(""); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {detail && (
            <>
              <Input
                value={detailDraft}
                onChange={(e) => setDetailDraft(e.target.value)}
                placeholder={detail.placeholder}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); submit(); }
                  if (e.key === "Escape") setAdding(false);
                }}
              />
              <p className="text-xs text-muted-foreground">{detail.label}</p>
            </>
          )}
        </div>
      ) : (
        // Value resets to "" on every pick, so the control reads as "add one
        // more" rather than as the current selection — the chips above are
        // the selection.
        <Select value="" onChange={(e) => add(e.target.value)} disabled={available.length === 0}>
          <option value="">
            {available.length === 0
              ? chosen.length
                ? `All ${label.toLowerCase()} selected`
                : `No ${label.toLowerCase()} yet — use “New”`
              : chosen.length
                ? `Add another ${singular}…`
                : `Select ${singular}`}
          </option>
          {available.map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </Select>
      )}

      {helpText && chosen.length > 1 && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}

      {loadFailed && (
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-px" />
          Could not load the {label.toLowerCase()} list. Anything you create may already exist —
          reload before adding a duplicate.
        </p>
      )}
    </div>
  );
}
