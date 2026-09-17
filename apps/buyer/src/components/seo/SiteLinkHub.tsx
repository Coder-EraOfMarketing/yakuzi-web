import Link from 'next/link';
import { SERIES } from '@/lib/seo/data/series';
import { CHARACTERS } from '@/lib/seo/data/characters';
import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
import { PRICE_BANDS } from '@/lib/seo/data/price-bands';
import { TIER_1_CITIES } from '@/lib/seo/data/locations';
import { routes } from '@/lib/seo/url';

/**
 * The sitewide internal link hub.
 *
 * This is the structural half of the SEO work, and it is the half that is easy
 * to skip. Sitemaps solve DISCOVERY — they tell Google a URL exists. Internal
 * links are what distribute authority, and a page with no inbound internal
 * links tends to get crawled once and then quietly ignored no matter how many
 * times it appears in a sitemap. PharmaBag renders the equivalent of this
 * block on every page and its product pages carry 140 internal links against
 * Yukizi's 53; that gap is most of the difference in how the two sites' hub
 * pages get treated.
 *
 * Three properties are load-bearing:
 *
 *  1. It is a SERVER component with no data fetching. Every link below comes
 *     from a static data file, so this costs zero API calls on every page of
 *     the site — which is what makes putting it in the root layout safe.
 *  2. The links are in the initial HTML. Crawlers that do not execute
 *     JavaScript still see all of them.
 *  3. It is collapsed by default via native <details>. That keeps the footer
 *     looking exactly as it did while still shipping the links in the markup.
 *     This is NOT cloaking: <details> content is real, user-reachable content
 *     that Google indexes normally, and nothing here is hidden from users
 *     while being shown to crawlers.
 *
 * Set SHOW_SITE_LINK_HUB to false to remove it from every page at once.
 */

export const SHOW_SITE_LINK_HUB = true;

/** How many entries each column shows before deferring to its index page. */
const PER_COLUMN = 16;

const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: 'Shop by series',
    links: [
      ...SERIES.slice(0, PER_COLUMN).map((s) => ({
        label: s.name,
        href: routes.series(s.slug),
      })),
      { label: 'All series', href: routes.seriesIndex() },
    ],
  },
  {
    title: 'Popular characters',
    links: [
      ...CHARACTERS.slice(0, PER_COLUMN).map((c) => ({
        label: c.short,
        href: routes.character(c.slug),
      })),
      { label: 'All characters', href: routes.charactersIndex() },
    ],
  },
  {
    title: 'Shop by format',
    links: [
      ...PRODUCT_TYPES.map((t) => ({ label: t.name, href: routes.type(t.slug) })),
      { label: 'All formats', href: routes.typesIndex() },
    ],
  },
  {
    title: 'Shop by budget',
    links: [
      ...PRICE_BANDS.map((b) => ({ label: b.name, href: routes.price(b.slug) })),
      { label: 'All budgets', href: routes.pricesIndex() },
    ],
  },
  {
    title: 'Delivery across India',
    links: [
      ...TIER_1_CITIES.map((c) => ({
        label: c.name,
        href: routes.city(c.stateSlug, c.slug),
      })),
      { label: 'All cities', href: routes.storesIndex() },
    ],
  },
];

export default function SiteLinkHub() {
  if (!SHOW_SITE_LINK_HUB) return null;

  return (
    <details className="mb-6 border-b border-gray-100 pb-6">
      <summary className="cursor-pointer list-none text-center text-sm text-gray-500 transition-colors hover:text-[#562996]">
        Browse Yukizi <span aria-hidden="true">⌄</span>
      </summary>
      <nav
        aria-label="Browse Yukizi"
        className="mt-6 grid grid-cols-2 gap-x-6 gap-y-8 text-left sm:grid-cols-3 lg:grid-cols-5"
      >
        {columns.map((col) => (
          <div key={col.title}>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-700">
              {col.title}
            </h2>
            <ul className="flex flex-col gap-1.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-500 transition-colors hover:text-[#562996] hover:underline underline-offset-4"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </details>
  );
}
