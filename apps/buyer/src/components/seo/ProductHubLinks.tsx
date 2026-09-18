import Link from 'next/link';
import { routes } from '@/lib/seo/url';
import { hubsForProduct } from '@/lib/seo/hub';
import type { CatalogProduct } from '@/lib/seo/catalog';
import { bandForPrice } from '@/lib/seo/data/price-bands';
import { seriesBySlug } from '@/lib/seo/data/series';
import { collectionsForProduct } from '@/data/collections';

/**
 * The guide most worth reading before buying each format.
 *
 * Hand-mapped rather than derived: the useful guide for a Funko buyer is the
 * fake-spotting one, and for a prize figure it is the one explaining why it
 * costs so little. A generic "buying guide" link would be ignored.
 */
const GUIDE_FOR_TYPE: Record<string, string> = {
  'funko-pop': 'how-to-spot-a-fake-funko-pop',
  'collectible-statues': 'how-to-spot-a-bootleg-anime-figure',
  'action-figures': 'action-figure-vs-statue',
  'noodle-stopper-figures': 'what-is-a-noodle-stopper-figure',
  'miniature-figures': 'prize-figure-vs-scale-figure',
  'diorama-figures': 'how-to-display-anime-figures',
  'prop-replicas': 'shipping-large-statues-in-india',
  'figure-sets': 'prize-figure-vs-scale-figure',
  'led-figures': 'how-to-stop-figures-yellowing',
  'manga-comics': 'where-to-buy-authentic-anime-figures-in-india',
  'trading-cards': 'where-to-buy-authentic-anime-figures-in-india',
  keychains: 'prize-figure-vs-scale-figure',
};

const GUIDE_LABELS: Record<string, string> = {
  'how-to-spot-a-fake-funko-pop': 'How to spot a fake Funko',
  'how-to-spot-a-bootleg-anime-figure': 'How to spot a bootleg figure',
  'action-figure-vs-statue': 'Action figure vs statue',
  'what-is-a-noodle-stopper-figure': 'What is a noodle stopper?',
  'prize-figure-vs-scale-figure': 'Prize vs scale figure',
  'how-to-display-anime-figures': 'How to display figures',
  'shipping-large-statues-in-india': 'Shipping large statues',
  'how-to-stop-figures-yellowing': 'Stopping yellowing',
  'where-to-buy-authentic-anime-figures-in-india': 'Buying authentic figures',
};

/**
 * The product page's links into every hub family.
 *
 * This replaces a chip row that pointed only at `/collections`. The
 * difference it makes is the single clearest structural gap measured between
 * the two sites: a PharmaBag product page carries 140 unique internal links
 * reaching four separate hub systems, a Yukizi product page carried 53
 * reaching one. Products are the most numerous page type on any catalogue
 * site, so they are also the largest available source of internal links — a
 * hub family that the product pages do not link to is a family relying
 * entirely on a footer and a sitemap, and that is the configuration where
 * Google crawls a page once and then loses interest.
 *
 * Every link here is server-rendered into the HTML, and every one points at a
 * hub that this product is genuinely a member of — computed by the same
 * matcher the hub page itself uses, so a chip can never lead to a page that
 * does not contain the product you clicked from.
 *
 * Visually it is the chip row that was already there, with more chips in it.
 */

export interface ProductHubLinksProps {
  /**
   * The detail payload. Loosely typed on purpose: the PDP's product comes
   * from `formatMasterDetail`, which carries more fields than the grid shape
   * and is typed `any` at the call site already. Only the fields `matchText`
   * reads are actually required.
   */
  product: Partial<CatalogProduct> & { id?: string };
}

export default function ProductHubLinks({ product }: ProductHubLinksProps) {
  const { series, characters, types, manufacturers } = hubsForProduct(
    product as CatalogProduct,
  );

  const price =
    typeof product.price === 'number'
      ? product.price
      : typeof product.mrp === 'number'
        ? product.mrp
        : null;
  const band = bandForPrice(price);

  // The curated hubs from the original chip row, kept so nothing that used to
  // be reachable from a product page stops being reachable.
  const collections = collectionsForProduct({
    name: product.name,
    slug: product.slug,
    description: product.description ?? undefined,
  });

  const groups: Array<{ label: string; links: Array<{ label: string; href: string }> }> = [
    {
      label: 'Series',
      links: series.map((s) => ({ label: s.name, href: routes.series(s.slug) })),
    },
    {
      label: 'Character',
      links: characters.map((c) => ({
        label: c.name,
        href: routes.character(c.slug),
      })),
    },
    {
      label: 'Format',
      links: types.map((t) => ({ label: t.name, href: routes.type(t.slug) })),
    },
    {
      // Series x format crosses, but only for series/type pairs that both
      // apply to this product — these are the deepest, most commercial URLs
      // in the tree and they get almost no other inbound links.
      label: 'More like this',
      links: series.flatMap((s) =>
        types
          .filter((t) => t.crossWithSeries)
          .map((t) => ({
            label: `${s.name} ${t.name}`,
            href: routes.seriesType(s.slug, t.slug),
          })),
      ),
    },
    {
      label: 'Maker',
      links: manufacturers.map((m) => ({
        label: m.name,
        href: routes.manufacturer(m.slug),
      })),
    },
    {
      label: 'Budget',
      links: band ? [{ label: band.name, href: routes.price(band.slug) }] : [],
    },
    {
      // One contextual guide per format present on this product. The guide
      // family otherwise has no inbound links from the product pages, which
      // are the site's largest source of them.
      label: 'Read first',
      links: types
        .map((t) => GUIDE_FOR_TYPE[t.slug])
        .filter((slug): slug is string => !!slug)
        .filter((slug, i, arr) => arr.indexOf(slug) === i)
        .map((slug) => ({
          label: GUIDE_LABELS[slug] ?? 'Buying guide',
          href: routes.guide(slug),
        })),
    },
    {
      label: 'Collections',
      links: collections.map((c) => ({
        label: c.name,
        href: routes.collection(c.slug),
      })),
    },
  ].filter((g) => g.links.length > 0);

  if (groups.length === 0) return null;

  // Deduplicate across groups: a product can match a series hub and a
  // collection hub with the same destination, and the same href twice in one
  // nav is a duplicate link, not a second vote.
  const seen = new Set<string>();

  return (
    <nav
      aria-label="Related collections"
      // `--nav-clearance`, not `pb-6`.
      //
      // This block renders as a SIBLING after <ProductPageClient />, outside
      // the <main> that reserves room for the floating bottom bar — so it
      // inherited none of that reservation and only had 24px of its own. That
      // was survivable when this was a single row of collection chips; it is
      // not now that it is up to eight rows.
      //
      // Measured on production at a 658px viewport: the bar sits at y=217-321
      // (it lifts off the bottom edge to avoid the footer, so it is 104px
      // tall and floating, not docked), while this nav's bottom edge was at
      // 321 — leaving the last 104px, the "Read first" and "Collections"
      // rows, underneath it.
      //
      // The variable is published by the navbar from the bar's real measured
      // height plus 24px, which is why it is used here rather than another
      // hardcoded guess; the 150px fallback only applies for the first frame
      // before the navbar has measured itself.
      className="mx-auto w-full max-w-4xl px-4 pb-[var(--nav-clearance,150px)]"
    >
      {groups.map((group) => {
        const links = group.links.filter((l) => {
          if (seen.has(l.href)) return false;
          seen.add(l.href);
          return true;
        });
        if (!links.length) return null;
        return (
          <ul key={group.label} className="mb-2 flex flex-wrap items-center gap-2">
            <li className="text-sm text-gray-500">{group.label}:</li>
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#854cbc] hover:text-[#854cbc]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        );
      })}
    </nav>
  );
}

/** Re-exported so the PDP can name the series in its breadcrumb if it wants. */
export { seriesBySlug };
