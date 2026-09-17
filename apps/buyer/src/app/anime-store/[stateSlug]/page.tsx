import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveState } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import { STATES, placeIsIndexable } from '@/lib/seo/data/locations';
import { SERIES } from '@/lib/seo/data/series';
import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
import { selectProducts, seriesMatcher, HUB_GRID_LIMIT } from '@/lib/seo/hub';
import {
  placeTitle,
  placeDescription,
  placeSummary,
  placeFaqs,
  hubSpecs,
  listSentence,
} from '@/lib/seo/content';
import {
  graph,
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  onlineStoreServingSchema,
  organizationSchema,
  webSiteSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';

export const revalidate = 3600;

export function generateStaticParams() {
  return STATES.map((s) => ({ stateSlug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { stateSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveState(params.stateSlug);
  if (!resolved) return { title: 'Not found', robots: { index: false } };
  const { def, products } = resolved;

  return {
    title: placeTitle(def.name),
    description: placeDescription(def.name, products),
    alternates: { canonical: absoluteUrl(routes.state(def.slug)) },
    openGraph: {
      title: placeTitle(def.name),
      description: placeDescription(def.name, products),
      url: absoluteUrl(routes.state(def.slug)),
      type: 'website',
    },
    ...(placeIsIndexable(def) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function StatePage({
  params,
}: {
  params: { stateSlug: string };
}) {
  const resolved = await resolveState(params.stateSlug);
  if (!resolved) notFound();
  const { def, products } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Delivery', path: routes.storesIndex() },
    { name: def.name },
  ];

  const faqs = placeFaqs(def.name, products);
  const shown = products.slice(0, HUB_GRID_LIMIT);

  const seriesHere = SERIES.map((s) => ({
    def: s,
    count: selectProducts(products, seriesMatcher(s)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: placeTitle(def.name),
        path: routes.state(def.slug),
        description: placeDescription(def.name, products),
        items: shown.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      onlineStoreServingSchema({
        placeName: def.name,
        placeType: 'State',
        path: routes.state(def.slug),
      }),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={`Anime Figures & Collectibles Delivered Across ${def.name}`}
      crumbs={crumbs}
      summary={placeSummary(def.name, null, def.note, products)}
      intro={[
        `Yukizi delivers to ${listSentence(
          def.cities.map((c) => c.name),
          8,
        )} and every other serviceable pin code in ${def.name}. Each city below has its own page with the same catalogue and the same prices — there is no ${def.name}-specific pricing, because sellers price nationally.`,
      ]}
      specs={hubSpecs(products, [
        { label: 'State', value: def.name },
        { label: 'Also known as', value: def.aka ?? '' },
        { label: 'Cities covered', value: String(def.cities.length) },
        { label: 'Typical delivery', value: '4–7 business days from dispatch' },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Delivery to ${def.name} — frequently asked questions`}
      emptyMessage="No products are listed right now — new arrivals appear here automatically."
      linkGroups={[
        {
          title: `Cities in ${def.name}`,
          links: def.cities.map((c) => ({
            label: c.name,
            href: routes.city(def.slug, c.slug),
          })),
        },
        {
          title: 'Popular series',
          links: seriesHere.map((s) => ({
            label: s.def.name,
            href: routes.series(s.def.slug),
            count: s.count,
          })),
        },
        {
          title: 'Shop by format',
          links: PRODUCT_TYPES.map((t) => ({
            label: t.name,
            href: routes.type(t.slug),
          })),
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
