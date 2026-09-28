"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui";
import { aiWrite, type AiWriteKind } from "@/api/seo.api";

const LABELS: Record<AiWriteKind, string> = {
  summary: "summary",
  meta_description: "meta description",
  excerpt: "excerpt",
  keywords: "keywords",
};

/**
 * Draft one SEO field from the post that is open, and hand it back for the
 * author to edit.
 *
 * Deliberately a draft and not a save: every one of these fields is published
 * — the excerpt on the blog index, the description in a search result, the
 * keywords in a meta tag — and an admin should have read the sentence that
 * goes out under the store's name.
 */
export function AiFillButton({
  kind,
  title,
  content,
  onText,
  onKeywords,
  hasValue,
}: {
  kind: AiWriteKind;
  title?: string;
  /** The post body. The button is inert without one — there is nothing to read. */
  content: string;
  onText?: (text: string) => void;
  onKeywords?: (keywords: string[]) => void;
  /** Whether the field already has something in it, so the label can say so. */
  hasValue?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const empty = !content || !content.replace(/<[^>]+>/g, "").trim();

  const run = async () => {
    setLoading(true);
    try {
      const { text, keywords } = await aiWrite({ kind, title, content });
      if (kind === "keywords") {
        if (!keywords.length) throw new Error("no keywords");
        onKeywords?.(keywords);
      } else {
        onText?.(text);
      }
      toast.success(`Draft ${LABELS[kind]} written — edit it before saving.`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? `Could not write the ${LABELS[kind]}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      loading={loading}
      disabled={empty}
      onClick={run}
      leftIcon={<Sparkles className="h-3.5 w-3.5" />}
      className="h-6 px-2 text-xs"
      title={empty ? "Write the post first — there is nothing to read yet" : undefined}
    >
      {hasValue ? "Rewrite" : "Write with AI"}
    </Button>
  );
}
