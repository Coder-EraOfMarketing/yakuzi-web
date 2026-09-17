import Link from 'next/link';
import HomeNavbar from '@/components/landing/HomeNavbar';
import CollectionGrid from '@/components/collections/CollectionGrid';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import SeoFaq from '@/components/seo/SeoFaq';
import type { BreadcrumbItem } from '@/lib/seo/schema';
import type { SpecRow } from '@/lib/seo/content';

/**
 * One renderer for every facet hub.
 *
 * The series, character, type, cross, price, place and sub-category pages are
 * the same page with a different predicate deciding what is in the grid.
 * Rendering them from one component is what keeps that true: a change to the
 * heading hierarchy, the spec table or the internal-link block lands on all
 * four hundred URLs at once instead of on whichever three someone remembered.
 *
 * It introduces NO new visual language. Navbar, grid, breadcrumb, FAQ and the
 * chip-style link lists are the components the collection hubs already use,
 * with the same class strings, so a new hub is visually indistinguishable from
 * the `/collections/[slug]` pages that shipped before it.
 *
 * Structure, in the order a crawler reads it:
 *
 *   h1        the entity, named in full
 *   summary   the quotable paragraph — self-contained, numeric, no pronouns
 *   specs     label/value pairs, which models mis-attribute far less often
 *             than the same facts buried in prose
 *   grid      server-rendered product links (never a client carousel — see
 *             CollectionGrid for why that distinction cost every hub its
 *             entire product list once already)
 *   faq       entity-named heading, visible answers matching the JSON-LD
 *   links     onward links into sibling and parent hubs
 */

export interface HubLinkGroup {
  title: string;
  links: Array<{ label: string; href: string; count?: number }>;
}

export interface HubPageProps {
  h1: string;
  crumbs: BreadcrumbItem[];
  /** The paragraph written to survive being quoted on its own. */
  summary: string;
  /** Extra hand-written paragraphs, rendered after the summary. */
  intro?: string[];
  specs: SpecRow[];
  /** The products actually rendered — already capped by the caller. */
  products: any[];
  /**
   * How many members the hub really has, when the grid is capped.
   *
   * Passing it makes the truncation VISIBLE. A page that quietly renders 60 of
   * 400 matches while its spec table says 400 is telling a crawler it covered
   * everything when it did not, and the missing 340 have no crawlable path
   * from here. The note below both states the gap and links onward.
   */
  total?: number;
  faqs: Array<{ question: string; answer: string }>;
  /** Entity-named, e.g. "Frequently asked questions about Gojo figures". */
  faqTitle: string;
  /** Shown instead of the grid when the hub has no live products. */
  emptyMessage: React.ReactNode;
  linkGroups?: HubLinkGroup[];
  jsonLd: object[];
  /** Rendered between the summary and the specs — used by place pages. */
  children?: React.ReactNode;
}

export default function HubPage({
  h1,
  crumbs,
  summary,
  intro,
  specs,
  products,
  total,
  faqs,
  faqTitle,
  emptyMessage,
  linkGroups = [],
  jsonLd,
  children,
}: HubPageProps) {
  const truncated = typeof total === 'number' && total > products.length;
  return (
    <main className="w-full min-h-screen relative pb-[var(--nav-clearance,150px)]">
      <JsonLd data={jsonLd} />
      <HomeNavbar />

      <div className="w-full max-w-[1600px] mx-auto flex flex-col">
        <header className="mx-auto w-full max-w-4xl px-4 pt-6 sm:pt-10">
          <Breadcrumbs items={crumbs} className="mb-3" />
          {/* A real, visible H1 in text — these pages exist to rank, so the
              headline is never banner artwork. */}
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">{h1}</h1>
          <div className="mt-4 flex flex-col gap-3 text-sm sm:text-base leading-relaxed text-gray-600">
            <p>{summary}</p>
            {intro?.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          {children}
        </header>

        {specs.length > 0 && (
          <section
            aria-label="At a glance"
            className="mx-auto w-full max-w-4xl px-4 pt-6"
          >
            <h2 className="mb-3 text-base font-semibold text-gray-800">
              {h1} at a glance
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-sm">
                <tbody>
                  {specs.map((row) => (
                    <tr key={row.label} className="border-b border-gray-100 last:border-0">
                      <th
                        scope="row"
                        className="w-[45%] bg-gray-50 px-4 py-2.5 text-left font-medium text-gray-600"
                      >
                        {row.label}
                      </th>
                      <td className="px-4 py-2.5 text-gray-900">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section aria-label={`${h1} products`} className="mt-2">
          {products.length > 0 ? (
            <CollectionGrid products={products} />
          ) : (
            <p className="px-4 py-10 text-center text-gray-500">{emptyMessage}</p>
          )}
          {truncated && (
            <p className="px-4 pb-4 text-center text-sm text-gray-500">
              Showing {products.length} of {total}.{' '}
              <Link
                href="/products"
                className="text-[#854cbc] underline underline-offset-4"
              >
                See the full catalogue
              </Link>
              .
            </p>
          )}
        </section>

        <SeoFaq faqs={faqs} title={faqTitle} />

        {linkGroups
          .filter((g) => g.links.length > 0)
          .map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="mx-auto w-full max-w-4xl px-4 pb-8"
            >
              <h2 className="mb-3 text-base font-semibold text-gray-800">
                {group.title}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#854cbc] hover:text-[#854cbc]"
                    >
                      {l.label}
                      {typeof l.count === 'number' && l.count > 0 && (
                        <span className="ml-1.5 text-xs text-gray-400">{l.count}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
      </div>
    </main>
  );
}
