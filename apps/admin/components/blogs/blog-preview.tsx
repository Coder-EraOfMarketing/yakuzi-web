"use client";
import DOMPurify from "isomorphic-dompurify";
import { Modal } from "@/components/ui";

/**
 * The post as a reader will see it, before it is published.
 *
 * A draft 404s on the storefront by design — `fetchPost` in the buyer app
 * refuses anything that is not PUBLISHED — so until now the only way to see
 * the real rendering was to publish and look. Publishing to check is how a
 * half-finished post ends up in a sitemap.
 *
 * Deliberately the storefront's own container classes and the same sanitiser,
 * so what this shows is what that renders rather than an approximation.
 */
export function BlogPreview({
  open,
  onClose,
  title,
  content,
  excerpt,
  authorName,
  featuredImage,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
  excerpt?: string;
  authorName?: string;
  featuredImage?: string;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Preview" maxWidth="max-w-3xl">
      <article className="max-h-[70vh] overflow-y-auto pr-1">
        {/* The title is the page's only H1 on the storefront — shown here at
            that level so a stray H1 in the body is visible as the duplicate
            it would be. */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          {title || "Untitled post"}
        </h1>
        {(authorName || excerpt) && (
          <div className="mb-6 space-y-1">
            {authorName && <p className="text-sm text-muted-foreground">By {authorName}</p>}
            {excerpt && <p className="text-sm text-muted-foreground italic">{excerpt}</p>}
          </div>
        )}
        {featuredImage && (
          <img
            src={featuredImage}
            alt={title}
            className="mb-6 aspect-video w-full rounded-2xl object-cover"
          />
        )}
        {content ? (
          <div
            className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-headings:font-bold"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Nothing written yet.</p>
        )}
      </article>
    </Modal>
  );
}
