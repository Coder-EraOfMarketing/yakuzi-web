"use client";
import { useState } from "react";
import { Plus, X, Check, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Select, Input, Button } from "@/components/ui";

export function SelectWithCreate({ label, options, value, onChange, onCreate, placeholder, detail, loadFailed }: {
  label: string;
  options: Array<{ id: string; name: string }>;
  value: string;
  onChange: (id: string) => void;
  onCreate: (name: string, detail?: string) => Promise<{ id: string } | void>;
  placeholder?: string;
  /**
   * An optional second field captured with the name. Authors were created
   * name-only even though the API accepts a bio, so every byline published as
   * a bare name with no credentials behind it — and this inline form is the
   * only place an author can be created at all.
   */
  detail?: { label: string; placeholder: string };
  /** The list could not be fetched — say so, instead of rendering "none". */
  loadFailed?: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const [detailDraft, setDetailDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const name = draft.trim();
    if (!name) return;

    // Typing a name that is already in the list is a selection, not a
    // creation. Sending it produced "Unique constraint failed on the fields:
    // (`name`)" — and for authors, where nothing is unique, four rows called
    // some case of "Yukizi". Case- and space-insensitive, because "Social"
    // and "social " are the same category to everyone except the database.
    const existing = options.find(
      (o) => o.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (existing) {
      onChange(existing.id);
      setDraft("");
      setDetailDraft("");
      setAdding(false);
      toast.success(`Selected the existing ${label.toLowerCase()} "${existing.name}".`);
      return;
    }

    setSaving(true);
    try {
      const created = await onCreate(name, detailDraft.trim() || undefined);
      if (created && "id" in created) onChange(created.id);
      setDraft("");
      setDetailDraft("");
      setAdding(false);
      toast.success(`${label} "${name}" created.`);
    } catch (e: any) {
      // Silence here was how a broken list endpoint read as "the button does
      // nothing": the row was created every time, the refetch failed, and
      // nothing on screen said either had happened.
      toast.error(e?.response?.data?.message ?? `Could not create that ${label.toLowerCase()}.`);
    } finally {
      setSaving(false);
    }
  };

  if (adding) {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <div className="flex items-center gap-1.5">
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`New ${label.toLowerCase()} name`}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } if (e.key === "Escape") setAdding(false); }}
          />
          <Button type="button" size="sm" loading={saving} onClick={submit} className="px-2.5"><Check className="h-4 w-4" /></Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => { setAdding(false); setDraft(""); setDetailDraft(""); }} className="px-2.5"><X className="h-4 w-4" /></Button>
        </div>
        {detail && (
          <Input
            value={detailDraft}
            onChange={(e) => setDetailDraft(e.target.value)}
            placeholder={detail.placeholder}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } if (e.key === "Escape") setAdding(false); }}
          />
        )}
        {detail && <p className="text-xs text-muted-foreground">{detail.label}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        <button type="button" onClick={() => setAdding(true)} className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          <Plus className="h-3 w-3" /> New
        </button>
      </div>
      <Select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder ?? `Select ${label.toLowerCase()}`}</option>
        {options.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
      </Select>
      {loadFailed && (
        // An empty dropdown and an unreachable one look identical, and the
        // difference decides whether you should create a new one or not.
        <p className="flex items-start gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-px" />
          Could not load the {label.toLowerCase()} list. Anything you create may already exist —
          reload before adding a duplicate.
        </p>
      )}
    </div>
  );
}
