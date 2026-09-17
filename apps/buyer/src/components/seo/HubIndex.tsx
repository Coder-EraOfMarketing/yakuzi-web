import Link from 'next/link';
import HomeNavbar from '@/components/landing/HomeNavbar';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import SeoFaq from '@/components/seo/SeoFaq';
import type { BreadcrumbItem } from '@/lib/seo/schema';

/**
 * The directory page for a facet axis — /anime, /characters, /figures, /price,
 * /anime-store.
 *
 * These exist for crawl reachability more than for traffic. A hub that is
 * linked only from the collapsed footer block and from one sitemap line is
 * reachable in principle; a hub that also sits in a flat, fully-linked
 * directory one click from the homepage is reachable in practice. PharmaBag
 * has the same five pages (`/brands`, `/generics`, `/categories`,
 * `/wholesale-medicine-suppliers`) and its `/brands` index ranks in its own
 * right.
 *
 * Entries carrying a zero count are still rendered and still linked. They are
 * noindex at the far end, so they cost nothing in the index, and leaving them
 * visible means the directory does not silently shrink and grow as stock
 * moves — which would make it useless as a map of what the site covers.
 */

export interface HubIndexItem {
  label: string;
  href: string;
  count?: number;
  /** One factual line, shown under the label. */
  note?: string;
}

export interface HubIndexGroup {
  title: string;
  /** Optional lead-in for the group. */
  blurb?: string;
  items: HubIndexItem[];
}

export default function HubIndex({
  h1,
  crumbs,
  summary,
  groups,
  faqs = [],
  faqTitle = 'Frequently Asked Questions',
  jsonLd,
}: {
  h1: string;
  crumbs: BreadcrumbItem[];
  summary: string;
  groups: HubIndexGroup[];
  faqs?: Array<{ question: string; answer: string }>;
  faqTitle?: string;
  jsonLd: object[];
}) {
  return (
    <main className="w-full min-h-screen relative pb-[var(--nav-clearance,150px)]">
      <JsonLd data={jsonLd} />
      <HomeNavbar />

      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        <header className="mx-auto w-full max-w-4xl px-4 pt-6 sm:pt-10">
          <Breadcrumbs items={crumbs} className="mb-3" />
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{h1}</h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-gray-600">
            {summary}
          </p>
        </header>

        {groups
          .filter((g) => g.items.length > 0)
          .map((group) => (
            <section
              key={group.title}
              aria-label={group.title}
              className="mx-auto w-full max-w-4xl px-4 pt-8"
            >
              <h2 className="text-lg font-bold text-gray-900">{group.title}</h2>
              {group.blurb && (
                <p className="mt-1 text-sm text-gray-600">{group.blurb}</p>
              )}
              <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group block h-full rounded-xl border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-md"
                    >
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium text-gray-900 group-hover:text-[#854cbc]">
                          {item.label}
                        </span>
                        {typeof item.count === 'number' && (
                          <span className="shrink-0 text-xs text-gray-400">
                            {item.count}
                          </span>
                        )}
                      </span>
                      {item.note && (
                        <span className="mt-1 block line-clamp-2 text-xs leading-relaxed text-gray-500">
                          {item.note}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}

        <SeoFaq faqs={faqs} title={faqTitle} />
      </div>
    </main>
  );
}
