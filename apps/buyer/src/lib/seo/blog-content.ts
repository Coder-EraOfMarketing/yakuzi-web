/**
 * Post-processing for CMS-authored blog HTML, before it is sanitised and
 * injected.
 *
 * Two things the editor cannot do for itself:
 *
 *  - **Anchors.** A post is one URL, but it usually answers several questions,
 *    one per H2. Without an id on each heading there is nothing for Google to
 *    deep-link a passage to and nothing for an assistant to cite beyond "this
 *    article", so a section that answers a question exactly still surfaces as
 *    a whole-page result.
 *  - **Image alt text.** The rich-text editor inserts `<img src>` with no alt
 *    at all, and the admin's per-image ALT overrides (Advanced SEO → Image ALT
 *    overrides, keyed by URL) had nowhere to be applied — the same map product
 *    pages already honour.
 *
 * Runs on the raw HTML, BEFORE sanitizeHtml: `id` and `alt` are both on the
 * sanitiser's allow-list, so anything this adds is still scrubbed by the same
 * pass as the author's own markup.
 */

export interface BlogHeading {
  level: 2 | 3;
  id: string;
  text: string;
}

export interface PreparedBlogContent {
  html: string;
  /** H2/H3 in document order — the post's outline. */
  headings: BlogHeading[];
}

const HEADING_RE = /<(h[23])([^>]*)>([\s\S]*?)<\/\1\s*>/gi;
const IMG_RE = /<img\b([^>]*)>/gi;

/** Visible text of an HTML fragment, for a heading's slug and label. */
function textOf(fragment: string): string {
  return fragment
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

export function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/^-|-$/g, '');
}

function attr(attrs: string, name: string): string | null {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'));
  return match ? (match[2] ?? match[3] ?? '') : null;
}

/**
 * @param imageAlt admin ALT overrides keyed by image URL
 * @param fallbackAlt used for an image with neither an alt nor an override —
 *   usually the post title, so a decorative-looking `<img>` is still described
 */
export function prepareBlogContent(
  html: string,
  options: { imageAlt?: Record<string, string> | null; fallbackAlt?: string } = {},
): PreparedBlogContent {
  const headings: BlogHeading[] = [];
  if (!html) return { html: '', headings };

  const used = new Set<string>();
  let withAnchors = html.replace(HEADING_RE, (whole, tag: string, attrs: string, inner: string) => {
    const text = textOf(inner);
    if (!text) return whole;
    const level = tag.toLowerCase() === 'h2' ? 2 : 3;
    // An author's own id wins: they may already be linking to it from
    // elsewhere, and silently renaming it would break that link.
    const existing = attr(attrs, 'id');
    let id = existing || headingSlug(text);
    if (!id) return whole;
    if (!existing) {
      // Two sections called "Conclusion" must not share an anchor, or the
      // second is unreachable and the first is ambiguous.
      let n = 2;
      const base = id;
      while (used.has(id)) id = `${base}-${n++}`;
    }
    used.add(id);
    headings.push({ level: level as 2 | 3, id, text });
    return existing
      ? whole
      : `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  const overrides = options.imageAlt ?? null;
  const fallback = (options.fallbackAlt ?? '').trim();
  if (overrides || fallback) {
    withAnchors = withAnchors.replace(IMG_RE, (whole, attrs: string) => {
      const src = attr(attrs, 'src') ?? '';
      const override = src && overrides ? overrides[src] : undefined;
      const current = attr(attrs, 'alt');
      // An alt the author wrote is left alone unless an override targets that
      // exact URL; an empty alt="" is a real choice (decorative) only when the
      // author made it, which is indistinguishable here — so treat blank as
      // missing, since this editor cannot set alt at all today.
      const next = (override && override.trim()) || (current && current.trim()) || fallback;
      if (!next) return whole;
      const cleaned = attrs.replace(/\s*\balt\s*=\s*("[^"]*"|'[^']*')/gi, '');
      return `<img${cleaned} alt="${escapeAttr(next)}">`;
    });
  }

  return { html: withAnchors, headings };
}

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
