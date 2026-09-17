import { getCategories, getProducts } from '@yukizi/api-client';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, ORG_LEGAL_NAME } from '@/lib/seo/site';
import { COMPANY } from '@/config/company';
import { fetchSupportContact } from '@/lib/seo/support-contact';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { routes } from '@/lib/seo/url';
import {
  countSeries,
  countCharacters,
  countTypes,
  countPriceBands,
} from '@/lib/seo/hub';
import { MIN_PRODUCTS_SERIES } from '@/lib/seo/data/series';
import { MIN_PRODUCTS_CHARACTER } from '@/lib/seo/data/characters';
import { MIN_PRODUCTS_TYPE } from '@/lib/seo/data/product-types';

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
  try {
    const rows: { name?: string; slug?: string; id: string; price?: number | null; mrp?: number | null; stock?: number }[] = [];
    for (let page = 1; page <= 5; page++) {
      const res = await getProducts({ page, limit: 100 });
      rows.push(...(res.data as typeof rows));
      if (page * res.limit >= res.total || rows.length >= MAX_PRODUCTS) break;
    }
    productCount = rows.length;
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

    facetSections = [
      seriesLines && `## Series (anime, game and comic franchises)\n${seriesLines}`,
      characterLines && `## Characters\n${characterLines}`,
      typeLines && `## Formats\n${typeLines}`,
      priceLines && `## Price bands\n${priceLines}`,
    ]
      .filter(Boolean)
      .join('\n\n');
  } catch {
    /* fail-open: a catalogue blip costs detail here, never the file */
  }

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

${SITE_NAME} (${ORG_LEGAL_NAME}) is an online marketplace for anime, manga and pop-culture collectibles in India. Products are listed by verified third-party sellers; ${SITE_NAME} handles ordering, payment and buyer support.

## Key facts
- Marketplace model: multiple verified sellers may list the same product; the price shown is the best current offer.
- Ships across India. Delivery is tracked from dispatch.
- Returns: accepted for damaged or incorrect deliveries, reported within 3 days of delivery with photographs. Change-of-mind returns are not accepted.
- Seller verification: every seller is verified before they can list.
- Payments: online payment at checkout.
- Support: ${support.email}${support.phone ? ` / ${support.phone}` : ''}

## Categories
${catLines}

${facetSections}

## Products${productCount ? ` (${productCount} listed, live prices)` : ''}
${productLines}

## Key pages
- [All products](${SITE_URL}/)
- [Browse by series](${SITE_URL}${routes.seriesIndex()})
- [Browse by character](${SITE_URL}${routes.charactersIndex()})
- [Browse by format](${SITE_URL}${routes.typesIndex()})
- [Browse by budget](${SITE_URL}${routes.pricesIndex()})
- [Delivery across India](${SITE_URL}${routes.storesIndex()})
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
