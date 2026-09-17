import type { SeoFaqEntry } from '@/lib/seo/overrides';

/**
 * Server-rendered, VISIBLE FAQ section for admin-authored Q&As. Google's rich
 * result policy requires FAQPage JSON-LD content to be visible on the page —
 * this renders the same entries the JSON-LD advertises, so there is no
 * hidden-text cloaking. Native <details> keeps it dependency-free and
 * crawlable without JavaScript.
 */
export default function SeoFaq({
  faqs,
  title = 'Frequently Asked Questions',
}: {
  faqs: SeoFaqEntry[];
  /**
   * Entity-named heading, e.g. "Frequently asked questions about Nezuko
   * figures". A generic "Frequently Asked Questions" gives a retrieval system
   * no anchor for what the answers below are ABOUT, so every hub passes its
   * own. Defaults to the original string, so existing callers are unchanged.
   */
  title?: string;
}) {
  if (!faqs.length) return null;
  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8" aria-label="Frequently asked questions">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex flex-col gap-2">
        {faqs.map((f, i) => (
          <details
            key={i}
            className="group rounded-lg border border-gray-200 bg-white px-4 py-3"
          >
            <summary className="cursor-pointer list-none font-medium text-gray-800 flex items-center justify-between">
              {f.question}
              <span className="ml-2 text-gray-400 transition-transform group-open:rotate-180">⌄</span>
            </summary>
            <p className="mt-2 text-sm text-gray-600 whitespace-pre-line">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
