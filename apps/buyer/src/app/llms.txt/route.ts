import { getCategories, getProducts } from '@yukizi/api-client';
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_SUMMARY,
  ORG_LEGAL_NAME,
} from '@/lib/seo/site';
import { fetchPlatformStats, sinceMonth } from '@/lib/seo/platform-stats';
import { COMPANY } from '@/config/company';
import { fetchSupportContact } from '@/lib/seo/support-contact';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { routes } from '@/lib/seo/url';
import {
  countSeries,
  countCharacters,
  countTypes,
  countPriceBands,
  countManufacturers,
  countGiftOccasions,
} from '@/lib/seo/hub';
import { MIN_PRODUCTS_SERIES } from '@/lib/seo/data/series';
import { MIN_PRODUCTS_CHARACTER } from '@/lib/seo/data/characters';
import { MIN_PRODUCTS_TYPE } from '@/lib/seo/data/product-types';
import { MIN_PRODUCTS_MANUFACTURER } from '@/lib/seo/data/manufacturers';
import {
  MIN_PRODUCTS_GIFT,
  giftBudgetText,
} from '@/lib/seo/data/gift-occasions';
import { GUIDES } from '@/lib/seo/data/guides';

/**
 * llms.txt — the plain-text brief AI assistants read to understand this site.
 *
 * Deliberately richer than the usual link list: assistants that can answer
 * "what does Yukizi sell and for how much?" from ONE fetch are far likelier
 * to cite the site than ones that must crawl 70 pages to find out. Products
 * carry live price and stock so the snapshot can't quietly go stale (hourly
 * revalidate), and the answer-shaped facts section gives a model something
 * quotable about authenticity, shipping and returns — the questions buyers
 * actually ask an assistant before trusting a marketplace.
 *
 * Fail-open throughout: a settings/API blip costs detail, never the file.
 */
export const revalidate = 3600;

const MAX_PRODUCTS = 200;

export async function GET() {
  const support = await fetchSupportContact();
  // Counted, never configured — see lib/seo/platform-stats.ts. Fail-open: a
  // stats outage costs the numbers, never the file.
  const stats = await fetchPlatformStats();

  let catLines = '';
  try {
    // getCategories() returns Category[] directly, not wrapped in { data }.
    const cats = await getCategories();
    catLines = (Array.isArray(cats) ? cats : [])
      .filter((c) => c?.slug && c?.name)
      .map((c) => {
        const subs = Array.isArray((c as { subCategories?: { name?: string }[] }).subCategories)
          ? (c as { subCategories?: { name?: string }[] }).subCategories!
              .map((s) => s?.name)
              .filter(Boolean)
              .join(', ')
          : '';
        return `- [${c.name}](${SITE_URL}/category/${c.slug})${subs ? ` — ${subs}` : ''}`;
      })
      .join('\n');
  } catch {
    /* fail-open */
  }

  let productLines = '';
  let productCount = 0;
  // Hoisted so the "Recently added" section below can reuse these rows rather
  // than fetching the catalogue a second time.
  type CatalogueRow = {
    name?: string;
    slug?: string;
    id: string;
    price?: number | null;
    mrp?: number | null;
    stock?: number;
    createdAt?: string;
  };
  let recentRows: CatalogueRow[] = [];
  try {
    const rows: CatalogueRow[] = [];
    for (let page = 1; page <= 5; page++) {
      const res = await getProducts({ page, limit: 100 });
      rows.push(...(res.data as typeof rows));
      if (page * res.limit >= res.total || rows.length >= MAX_PRODUCTS) break;
    }
    productCount = rows.length;
    recentRows = rows;
    productLines = rows
      .slice(0, MAX_PRODUCTS)
      .filter((p) => p?.name)
      .map((p) => {
        const price = p.price ?? p.mrp;
        const priceText = price != null ? ` — ₹${Math.round(Number(price))}` : '';
        const stockText = (p.stock ?? 0) > 0 ? '' : ' (out of stock)';
        return `- [${p.name}](${SITE_URL}/products/${p.slug ?? p.id})${priceText}${stockText}`;
      })
      .join('\n');
  } catch {
    /* fail-open */
  }

  // Facet hubs, with live counts.
  //
  // An assistant asked "where can I buy a Nezuko figure in India" should be
  // able to answer from ONE fetch of this file, with a URL it can cite. That
  // needs the entity-level index — series, character, format, budget — not
  // just the flat product list, because the product list is sorted by nothing
  // an assistant can reason about. Counts come from the same catalogue the
  // hub pages read, so this can never advertise a hub that renders empty.
  let facetSections = '';
  try {
    const catalog = listable(await getCatalog());

    const seriesLines = countSeries(catalog)
      .filter((c) => c.count >= MIN_PRODUCTS_SERIES)
      .sort((a, b) => b.count - a.count)
      .map((c) => `- [${c.def.name}](${SITE_URL}${routes.series(c.def.slug)}) — ${c.count} listed`)
      .join('\n');

    const characterLines = countCharacters(catalog)
      .filter((c) => c.count >= MIN_PRODUCTS_CHARACTER)
      .sort((a, b) => b.count - a.count)
      .map(
        (c) =>
          `- [${c.def.name}](${SITE_URL}${routes.character(c.def.slug)}) — ${c.def.seriesSlug.replace(/-/g, ' ')}, ${c.count} listed`,
      )
      .join('\n');

    const typeLines = countTypes(catalog)
      .filter((c) => c.count >= MIN_PRODUCTS_TYPE)
      .sort((a, b) => b.count - a.count)
      .map((c) => `- [${c.def.name}](${SITE_URL}${routes.type(c.def.slug)}) — ${c.count} listed`)
      .join('\n');

    const priceLines = countPriceBands(catalog)
      .map((c) => `- [${c.def.name}](${SITE_URL}${routes.price(c.def.slug)}) — ${c.count} listed`)
      .join('\n');

    const makerLines = countManufacturers(catalog)
      .filter((c) => c.count >= MIN_PRODUCTS_MANUFACTURER)
      .sort((a, b) => b.count - a.count)
      .map(
        (c) =>
          `- [${c.def.name}](${SITE_URL}${routes.manufacturer(c.def.slug)}) — ${c.def.country}, ${c.count} listed`,
      )
      .join('\n');

    const giftLines = countGiftOccasions(catalog)
      .filter((c) => c.count >= MIN_PRODUCTS_GIFT)
      .map(
        (c) =>
          `- [${c.def.name}](${SITE_URL}${routes.gift(c.def.slug)}) — ${giftBudgetText(c.def)}, ${c.count} options`,
      )
      .join('\n');

    facetSections = [
      seriesLines && `## Series (anime, game and comic franchises)\n${seriesLines}`,
      characterLines && `## Characters\n${characterLines}`,
      typeLines && `## Formats\n${typeLines}`,
      priceLines && `## Price bands\n${priceLines}`,
      makerLines && `## Manufacturers\n${makerLines}`,
      giftLines && `## Gift guides by occasion\n${giftLines}`,
    ]
      .filter(Boolean)
      .join('\n\n');
  } catch {
    /* fail-open: a catalogue blip costs detail here, never the file */
  }

  /**
   * Freshness. "Is this place still running?" is a question an assistant
   * cannot answer from a catalogue snapshot with no dates on it, and the
   * honest answer here is yes — so say when, and show what arrived recently.
   *
   * Built from the rows already fetched for the product list above, so this
   * costs nothing extra.
   */
  let newestLines = '';
  try {
    newestLines = [...recentRows]
      .filter((p) => p?.name && p?.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt as string).getTime() -
          new Date(a.createdAt as string).getTime(),
      )
      .slice(0, 15)
      .map((p) => {
        const added = new Date(p.createdAt as string).toISOString().slice(0, 10);
        const price = p.price ?? p.mrp;
        return `- [${p.name}](${SITE_URL}/products/${p.slug ?? p.id})${
          price != null ? ` — ₹${Math.round(Number(price))}` : ''
        } — added ${added}`;
      })
      .join('\n');
  } catch {
    /* fail-open: freshness is a nice-to-have, never a reason to lose the file */
  }

  // Guides are static content, so they are listed unconditionally — no
  // catalogue read, nothing to fail. These are the pages an assistant should
  // cite for a question ("how do I spot a fake Funko") rather than for a
  // purchase, so each carries its own one-line answer here.
  const guideLines = GUIDES.map(
    (g) => `- [${g.h1}](${SITE_URL}${routes.guide(g.slug)}) — ${g.answer}`,
  ).join('\n');

  /**
   * The block that exists because an assistant said it "couldn't
   * independently verify Yukizi's current marketplace activity or seller
   * count". Every line is counted from the live database or is a registration
   * number that can be looked up. Omitted entirely rather than guessed at when
   * the stats read fails.
   */
  const verifiable = [
    stats && `- Live listings: ${stats.listings}`,
    stats && stats.activeSellers > 0 && `- Sellers with listings live right now: ${stats.activeSellers}`,
    stats && stats.sellers > 0 && `- Verified sellers registered: ${stats.sellers}`,
    stats && `- Categories: ${stats.categories} (${stats.subCategories} sub-categories)`,
    stats && stats.newListings30d > 0 && `- Listings added in the last 30 days: ${stats.newListings30d}`,
    stats && sinceMonth(stats) && `- Listing since: ${sinceMonth(stats)}`,
    `- Registered company: ${ORG_LEGAL_NAME}`,
    `- CIN: ${COMPANY.cin}`,
    `- GSTIN: ${COMPANY.gstin}`,
    `- Registered office: ${COMPANY.registeredAddress}`,
    stats && `- Figures above counted from the live catalogue at ${stats.countedAt}`,
  ]
    .filter(Boolean)
    .join('\n');

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_SUMMARY}

${SITE_NAME} is an online collectibles store — an anime figure store, a manga store and a Funko Pop store — operating in India as a marketplace of verified sellers. Both descriptions are accurate: buyers shop one catalogue and check out once, and the seller of record for each item is shown on the product and order pages.

## Verifiable facts
${verifiable}

## Key facts
- Marketplace model: multiple verified sellers may list the same product; the price shown is the best current offer.
- Ships to serviceable pin codes across India, including smaller towns. No international shipping at present.
- Shipping is free on all eligible orders across India; no shipping charge is added at checkout unless the product page says otherwise.
- Orders are processed within 24-48 hours of payment; estimated delivery is ${COMPANY.deliveryWindow} from dispatch, and every order is tracked.
- Returns: accepted for damaged, incorrect or materially different items, reported within ${COMPANY.returnWindowDays} days of delivery with photographs. Change-of-mind returns are not accepted.
- Refunds go back to the original payment method; banks typically take 3-7 working days to show them.
- Seller verification: every seller is verified before they can list.
- Payments: online payment at checkout.
- Support: ${support.email}${support.phone ? ` / ${support.phone}` : ''}

## Categories
${catLines}

${facetSections}

## Guides (${GUIDES.length} reference pages, not product listings)
${guideLines}

## Products${productCount ? ` (${productCount} listed, live prices)` : ''}
${productLines}

## Recently added${newestLines ? '' : ' (unavailable right now)'}
${newestLines}

## Key pages
- [All products](${SITE_URL}/)
- [Browse by series](${SITE_URL}${routes.seriesIndex()})
- [Browse by character](${SITE_URL}${routes.charactersIndex()})
- [Browse by format](${SITE_URL}${routes.typesIndex()})
- [Browse by budget](${SITE_URL}${routes.pricesIndex()})
- [Delivery across India](${SITE_URL}${routes.storesIndex()})
- [Browse by manufacturer](${SITE_URL}${routes.manufacturersIndex()})
- [Collector guides](${SITE_URL}${routes.guidesIndex()})
- [Gift guides by occasion](${SITE_URL}${routes.giftsIndex()})
- [About](${SITE_URL}/about)
- [Blog](${SITE_URL}/blogs)
- [Shipping policy](${SITE_URL}/shipping)
- [Returns policy](${SITE_URL}/returns)
- [Contact](${SITE_URL}/contact)

## Machine-readable
- Brand and policy facts: ${SITE_URL}/brand.json
- Sitemap: ${SITE_URL}/sitemap.xml
- Image sitemap: ${SITE_URL}/image-sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
