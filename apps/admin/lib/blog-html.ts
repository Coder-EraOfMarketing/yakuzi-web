/**
 * What a post's HTML actually contains, for the editor to show back.
 *
 * The editor has H2 and H3 buttons and applies neither on its own, so a post
 * pasted as plain text is a wall of <p> with no headings at all — and nothing
 * said so until it was live. Everything here is read-only analysis of the
 * content string the form is about to save: an outline, the counts, and the
 * structural problems worth stopping for.
 *
 * Regex rather than DOMParser: this renders on the server too, and the input
 * is the editor's own schema-constrained output, not arbitrary documents.
 */

export interface BlogHeading {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

export interface BlogAnalysis {
  words: number;
  /** Reading time in minutes, at 200 words per minute, never below 1. */
  minutes: number;
  headings: BlogHeading[];
  images: number;
  imagesMissingAlt: number;
  links: number;
  isEmpty: boolean;
}

export interface BlogWarning {
  id: string;
  /** `error` is worth blocking publish over; `warning` is worth reading. */
  severity: 'error' | 'warning';
  message: string;
}

const HEADING_RE = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1\s*>/gi;
const IMG_RE = /<img\b([^>]*)>/gi;
const LINK_RE = /<a\b[^>]*\bhref\s*=/gi;

function textOf(fragment: string): string {
  return fragment
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function hasNonEmptyAlt(attrs: string): boolean {
  const match = attrs.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
  if (!match) return false;
  return (match[2] ?? match[3] ?? '').trim() !== '';
}

export function analyzeBlogHtml(html: string): BlogAnalysis {
  const source = html ?? '';
  const plain = textOf(source);
  const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;

  const headings: BlogHeading[] = [];
  for (const m of source.matchAll(HEADING_RE)) {
    const text = textOf(m[2]);
    if (text) headings.push({ level: Number(m[1]) as BlogHeading['level'], text });
  }

  let images = 0;
  let imagesMissingAlt = 0;
  for (const m of source.matchAll(IMG_RE)) {
    images += 1;
    if (!hasNonEmptyAlt(m[1])) imagesMissingAlt += 1;
  }

  return {
    words,
    minutes: Math.max(1, Math.round(words / 200)),
    headings,
    images,
    imagesMissingAlt,
    links: (source.match(LINK_RE) ?? []).length,
    // What Tiptap emits for an untouched editor.
    isEmpty: words === 0 && images === 0,
  };
}

/** Roughly where a heading stops being a heading and starts being a sentence. */
const LONG_HEADING_CHARS = 70;
/** Below this a post is a note, and headings are not expected. */
const MIN_WORDS_FOR_HEADINGS = 150;

export function blogStructureWarnings(analysis: BlogAnalysis): BlogWarning[] {
  const out: BlogWarning[] = [];
  if (analysis.isEmpty) return out;

  const h2s = analysis.headings.filter((h) => h.level === 2);
  const firstBelowH1 = analysis.headings.find((h) => h.level > 1);

  if (analysis.headings.some((h) => h.level === 1)) {
    out.push({
      id: 'h1-in-body',
      severity: 'error',
      message:
        'The body contains an H1. The post title is already the page\'s H1 — make these H2 instead, or a search engine sees two competing page headings.',
    });
  }

  if (!h2s.length && analysis.words >= MIN_WORDS_FOR_HEADINGS) {
    out.push({
      id: 'no-h2',
      severity: 'error',
      message:
        'This post has no H2 headings, so it publishes as one undivided block of text. Select each section heading and click H2 — pasted text arrives as plain paragraphs.',
    });
  }

  if (firstBelowH1 && firstBelowH1.level === 3) {
    out.push({
      id: 'h3-before-h2',
      severity: 'warning',
      message:
        `The first heading is an H3 ("${firstBelowH1.text.slice(0, 40)}…"). An H3 is a sub-section of an H2; starting there leaves the outline with a gap.`,
    });
  }

  const long = analysis.headings.filter((h) => h.text.length > LONG_HEADING_CHARS);
  if (long.length) {
    out.push({
      id: 'long-heading',
      severity: 'warning',
      message: `${long.length} heading${long.length > 1 ? 's are' : ' is'} longer than ${LONG_HEADING_CHARS} characters. A heading is a label for a section, not its first sentence.`,
    });
  }

  if (analysis.imagesMissingAlt) {
    out.push({
      id: 'image-alt',
      severity: 'warning',
      message: `${analysis.imagesMissingAlt} image${analysis.imagesMissingAlt > 1 ? 's have' : ' has'} no alt text. Select the image and use the Alt text button — it is what image search and screen readers read.`,
    });
  }

  if (!analysis.links && analysis.words >= MIN_WORDS_FOR_HEADINGS) {
    out.push({
      id: 'no-links',
      severity: 'warning',
      message:
        'This post links nowhere. A post on a shop should point at the products or guides it talks about.',
    });
  }

  return out;
}
