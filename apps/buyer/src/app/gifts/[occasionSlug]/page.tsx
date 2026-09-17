import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveGift } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import {
  GIFT_OCCASIONS,
  MIN_PRODUCTS_GIFT,
  giftBudgetText,
} from '@/lib/seo/data/gift-occasions';
import { SERIES } from '@/lib/seo/data/series';
import { selectProducts, seriesMatcher, HUB_GRID_LIMIT } from '@/lib/seo/hub';
import {
  hubSpecs,
  typesPresent,
  rangeText,
  listSentence,
  squash,
  inr,
} from '@/lib/seo/content';
import { priceRange } from '@/lib/seo/hub';
import {
  graph,
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  organizationSchema,
  webSiteSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';

export const revalidate = 300;

export function generateStaticParams() {
  return GIFT_OCCASIONS.map((o) => ({ occasionSlug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { occasionSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveGift(params.occasionSlug);
  if (!resolved) return { title: 'Not found', robots: { index: false } };
  const { def, products } = resolved;

  return {
    title: def.title,
    description: def.metaDescription,
    alternates: { canonical: absoluteUrl(routes.gift(def.slug)) },
    openGraph: {
      title: def.title,
      description: def.metaDescription,
      url: absoluteUrl(routes.gift(def.slug)),
      type: 'website',
    },
    ...(products.length < MIN_PRODUCTS_GIFT
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function GiftOccasionPage({
  params,
}: {
  params: { occasionSlug: string };
}) {
  const resolved = await resolveGift(params.occasionSlug);
  if (!resolved) notFound();
  const { def, products } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Gifts', path: routes.giftsIndex() },
    { name: def.name },
  ];

  const range = priceRange(products);
  const formats = typesPresent(products);
  const seriesHere = SERIES.map((s) => ({
    def: s,
    count: selectProducts(products, seriesMatcher(s)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);

  // States the budget bound out loud rather than implying a curated set that
  // does not exist — see the module comment in data/gift-occasions.ts.
  const summary = [
    `${SITE_NAME} lists ${products.length} ${products.length === 1 ? 'gift option' : 'gift options'} in the ${giftBudgetText(def).toLowerCase()} range for ${def.name}${range ? `, priced ${rangeText(products)}` : ''}.`,
    def.timing,
    formats.length
      ? `Formats in this range include ${listSentence(formats.map((f) => f.def.name.toLowerCase()), 4)}.`
      : '',
    seriesHere.length
      ? `Series available include ${listSentence(seriesHere.map((s) => s.def.name), 6)}.`
      : '',
    def.leadTime,
  ]
    .filter(Boolean)
    .join(' ');

  const faqs = [
    ...def.faqs,
    {
      question: `Does ${SITE_NAME} deliver gifts across India in time?`,
      answer: `Orders are processed within 24–48 hours of payment and typically deliver in 4–7 business days from dispatch to any serviceable pin code in India, tracked throughout. ${def.leadTime}`,
    },
  ];

  const shown = products.slice(0, HUB_GRID_LIMIT);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: def.title,
        path: routes.gift(def.slug),
        description: def.metaDescription,
        items: shown.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={def.h1}
      crumbs={crumbs}
      summary={summary}
      intro={def.intro}
      specs={hubSpecs(products, [
        { label: 'Occasion', value: def.name },
        { label: 'When', value: def.timing },
        { label: 'Budget shown', value: giftBudgetText(def) },
        ...(range ? [{ label: 'Cheapest option', value: inr(range.min) }] : []),
        { label: 'Order by', value: def.leadTime },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`${def.h1} — frequently asked questions`}
      emptyMessage={
        <>
          Nothing is listed in this budget right now.{' '}
          <Link
            href={routes.products()}
            className="text-[#854cbc] underline underline-offset-4"
          >
            Browse the full catalogue
          </Link>
          .
        </>
      }
      linkGroups={[
        {
          title: 'Other occasions',
          links: GIFT_OCCASIONS.filter((o) => o.slug !== def.slug).map((o) => ({
            label: o.name,
            href: routes.gift(o.slug),
          })),
        },
        {
          title: 'Series in this budget',
          links: seriesHere.map((s) => ({
            label: s.def.name,
            href: routes.series(s.def.slug),
            count: s.count,
          })),
        },
        {
          title: 'Formats in this budget',
          links: formats.map((f) => ({
            label: f.def.name,
            href: routes.type(f.def.slug),
            count: f.count,
          })),
        },
        {
          // Contextual links into the guides, which is where a gift buyer
          // who has never bought a figure before actually needs to go.
          title: 'Before you buy',
          links: [
            {
              label: 'How to spot a bootleg figure',
              href: routes.guide('how-to-spot-a-bootleg-anime-figure'),
            },
            {
              label: 'Prize figure vs scale figure',
              href: routes.guide('prize-figure-vs-scale-figure'),
            },
            {
              label: 'What each budget buys in India',
              href: routes.guide('anime-figure-prices-in-india'),
            },
          ],
        },
      ]}
      jsonLd={jsonLd}
    >
      {/* The selection reasoning. This is the actual content of a gift page —
          the products are the same catalogue as everywhere else, and what
          differs is the budget bound above and the criteria here. */}
      <section aria-label="How to choose" className="mt-5">
        <h2 className="text-base font-semibold text-gray-800">
          How to choose a {def.name.toLowerCase()} gift
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {def.criteria.map((c, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-gray-600 sm:text-base"
            >
              <span aria-hidden="true" className="mt-[2px] text-[#854cbc]">
                &bull;
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>
    </HubPage>
  );
}
