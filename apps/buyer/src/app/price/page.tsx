import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { PRICE_BANDS } from '@/lib/seo/data/price-bands';
import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
import { countPriceBands, priceRange } from '@/lib/seo/hub';
import { inr } from '@/lib/seo/content';
import {
  graph,
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  pageListSchema,
  organizationSchema,
  webSiteSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';

export const revalidate = 300;

const TITLE = 'Anime Collectibles by Price — From Under ₹1,000 to Grail Statues';
const DESCRIPTION =
  'Shop anime figures and collectibles by budget on Yukizi — under ₹1,000, ₹1,000–₹2,500, ₹2,500–₹5,000, ₹5,000–₹10,000 and grail pieces above ₹10,000.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.pricesIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.pricesIndex()),
    type: 'website',
  },
};

export default async function PriceIndexPage() {
  const all = listable(await getCatalog());
  const counts = countPriceBands(all);
  const range = priceRange(all);

  const summary =
    `${SITE_NAME} lists ${all.length} products` +
    (range
      ? ` priced from ${inr(range.min)} to ${inr(range.max)}` : '') +
    `. The five bands below tile that whole range with no overlap, so every product sits in exactly one — a piece cannot appear on two budget pages, and the counts add up to the catalogue. Bands are computed from the live price, so a product moves between them on its own when a seller re-prices it.`;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Shop by budget' },
  ];

  const faqs = [
    {
      question: `What is the cheapest anime figure on ${SITE_NAME}?`,
      answer: range
        ? `The lowest-priced listing on ${SITE_NAME} right now is ${inr(range.min)}. The under-₹1,000 band collects everything at the entry end — small-format prize figures, miniatures, keychains and single manga volumes.`
        : `Prices vary with what sellers have listed. The under-₹1,000 band collects the entry end of the catalogue.`,
    },
    {
      question: 'Do prices include shipping?',
      answer: `No. Shipping is charged per listing and shown on the product page before checkout, so you can see the landed cost rather than discovering it at the last step. Combining items from a single seller is usually the cheaper route.`,
    },
    {
      question: 'Why does the same character cost very different amounts?',
      answer:
        'Format and scale. A 10 cm prize figure and a 50 cm resin statue of the same character are different products with different production costs — the licence is the same, the manufacturing is not.',
    },
  ];

  const groups = [
    {
      title: 'Shop by budget',
      items: counts.map((c) => ({
        label: c.def.name,
        href: routes.price(c.def.slug),
        count: c.count,
        note: c.def.metaDescription,
      })),
    },
    {
      title: 'Shop by format instead',
      blurb: 'Format drives most of the price difference between two pieces.',
      items: PRODUCT_TYPES.map((t) => ({
        label: t.name,
        href: routes.type(t.slug),
        note: t.note,
      })),
    },
  ];

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.pricesIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Price bands on Yukizi',
        PRICE_BANDS.map((b) => ({ name: b.name, path: routes.price(b.slug) })),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Shop by Budget"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle={`Pricing on ${SITE_NAME} — frequently asked questions`}
      jsonLd={jsonLd}
    />
  );
}
