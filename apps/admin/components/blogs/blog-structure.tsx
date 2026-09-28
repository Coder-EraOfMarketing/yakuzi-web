"use client";
import { useMemo } from "react";
import { AlertTriangle, AlertCircle, CheckCircle2, Eye } from "lucide-react";
import { Button } from "@/components/ui";
import { analyzeBlogHtml, blogStructureWarnings } from "@/lib/blog-html";
import { cn } from "@/lib/utils";

/**
 * The outline of the post as it will actually publish, plus anything wrong
 * with it.
 *
 * The editor's H2/H3 buttons apply nothing on their own: paste an article in
 * and every line — "Introduction" included — is a paragraph. Nothing said so
 * until the post was live and Google had already seen a page with no
 * headings. This is the readback: what the structure is, not what the author
 * meant it to be.
 */
export function BlogStructure({ html, onPreview }: { html: string; onPreview: () => void }) {
  const analysis = useMemo(() => analyzeBlogHtml(html), [html]);
  const warnings = useMemo(() => blogStructureWarnings(analysis), [analysis]);
  const outline = analysis.headings.filter((h) => h.level >= 2 && h.level <= 3);

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-foreground">Structure</h3>
        <Button type="button" variant="outline" size="sm" leftIcon={<Eye className="h-3.5 w-3.5" />} onClick={onPreview}>
          Preview
        </Button>
      </div>

      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        {[
          ["Words", analysis.words.toLocaleString()],
          ["Read time", `${analysis.minutes} min`],
          ["Headings", `${outline.length}`],
          ["Links", `${analysis.links}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-muted/40 px-3 py-2">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      {warnings.length > 0 ? (
        <ul className="space-y-2">
          {warnings.map((w) => (
            <li
              key={w.id}
              className={cn(
                "flex gap-2 rounded-xl px-3 py-2 text-xs leading-relaxed",
                w.severity === "error"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400",
              )}
            >
              {w.severity === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0 mt-px" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0 mt-px" />
              )}
              <span>{w.message}</span>
            </li>
          ))}
        </ul>
      ) : (
        !analysis.isEmpty && (
          <p className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Headings, images and links all look right.
          </p>
        )
      )}

      {outline.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Outline — this is what Google reads as the page&apos;s structure
          </p>
          <ol className="space-y-0.5 text-sm">
            {outline.map((h, i) => (
              <li
                key={`${h.level}-${i}-${h.text}`}
                className={cn("truncate text-foreground", h.level === 3 && "ml-5 text-muted-foreground")}
              >
                <span className="mr-1.5 text-[10px] font-semibold uppercase text-primary">H{h.level}</span>
                {h.text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
