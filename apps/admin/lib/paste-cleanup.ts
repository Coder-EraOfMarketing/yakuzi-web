/**
 * Repair for text pasted out of Google Docs (and Word, and PDFs).
 *
 * What arrives on the clipboard is not what it looks like on screen. Verified
 * by running real Google Docs clipboard HTML through this editor's own schema:
 *
 *   <p>Why Anime Is One of the Most Inclusive</p>
 *   <p>&nbsp;</p>                                    ← blank line
 *   <p>Fan Communities Today</p>
 *   <p>&nbsp;</p>
 *   <p>&nbsp;</p>
 *   <p>In a world where entertainment is not just sellable but malleable and</p>
 *   <p>woke culture, anime has built something remarkable: a community where</p>
 *   <p>almost everyone can find a place.</p>
 *
 * Two separate problems, and both survive into the saved content:
 *
 *  - **Blank paragraphs.** Docs writes every empty line as a paragraph holding
 *    a non-breaking space. That is a real character, so ProseMirror keeps the
 *    paragraph — and `prose` then gives it a full line box plus two margins.
 *    Three in a row is the gap authors describe as "so much space".
 *  - **Hard-wrapped sentences.** One sentence arrives as three paragraphs, cut
 *    where it wrapped in the source. Every fragment gets paragraph margins, so
 *    the whole body reads as double-spaced — and the Article schema's
 *    wordCount is computed over broken sentences.
 *
 * Runs on paste and from the toolbar, so content pasted before this existed
 * can be repaired in place rather than by hand.
 */

/** A line that wrapped ends mid-thought; a finished paragraph does not. */
const ENDS_A_THOUGHT = /[.!?:;…”’"')\]]\s*$/;
/** A continuation resumes in lower case; a new paragraph opens in upper. */
const RESUMES_MID_SENTENCE = /^[a-z(à-ÿ]/;
/**
 * Short lines are labels ("Introduction", "Conclusion", a heading the author
 * has not marked up yet), not wrapped prose — never absorb the line after one.
 * A line that genuinely wrapped is close to full measure.
 */
const MIN_WRAPPED_LENGTH = 40;

function textOf(el: Element): string {
  return (el.textContent ?? '').replace(/\u00a0/g, ' ').trim();
}

/** Nothing a reader would see: no text, no image, no embed. */
function isBlank(el: Element): boolean {
  if (el.querySelector('img, iframe, video')) return false;
  return (el.textContent ?? '').replace(/[\s\u00a0]/g, '') === '';
}

function unwrap(el: Element): void {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

export function cleanPastedHtml(html: string): string {
  // The editor is client-only, but setContent can run during hydration.
  if (typeof window === 'undefined' || !html) return html;

  const doc = new window.DOMParser().parseFromString(html, 'text/html');

  // Google Docs wraps the whole selection in <b style="font-weight:normal">.
  // Harmless today because ProseMirror reads the inline style, but it is one
  // schema change away from bolding an entire pasted article.
  doc.querySelectorAll('b[id^="docs-internal-guid"]').forEach(unwrap);

  // Blank paragraphs — the visible gaps.
  doc.querySelectorAll('p').forEach((p) => {
    if (isBlank(p)) p.remove();
  });

  // Rejoin what was one sentence before it met a page width.
  const paragraphs = Array.from(doc.body.querySelectorAll('p'));
  for (const p of paragraphs) {
    const previous = p.previousElementSibling;
    // Only ever merge a paragraph into a paragraph: a heading, list or quote
    // in between is a real boundary the author (or the source) intended.
    if (!previous || previous.tagName !== 'P') continue;
    const before = textOf(previous);
    const here = textOf(p);
    if (!before || !here) continue;
    if (before.length < MIN_WRAPPED_LENGTH) continue;
    if (ENDS_A_THOUGHT.test(before)) continue;
    if (!RESUMES_MID_SENTENCE.test(here)) continue;

    previous.appendChild(doc.createTextNode(' '));
    while (p.firstChild) previous.appendChild(p.firstChild);
    p.remove();
  }

  return doc.body.innerHTML;
}

/** Whether cleanup would change anything — so the toolbar can say "nothing to
 *  clean" instead of silently doing nothing. */
export function needsCleanup(html: string): boolean {
  if (typeof window === 'undefined' || !html) return false;
  return cleanPastedHtml(html) !== html;
}
