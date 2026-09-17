import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveCity } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import {
  ALL_CITIES,
  stateBySlug,
  placeIsIndexable,
} from '@/lib/seo/data/locations';
import { SERIES } from '@/lib/seo/data/series';
import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
import { PRICE_BANDS } from '@/lib/seo/data/price-bands';
import { selectProducts, seriesMatcher, HUB_GRID_LIMIT } from '@/lib/seo/hub';
import {
  placeTitle,
  placeDescription,
  placeSummary,
  placeFaqs,
  hubSpecs,
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
  return ALL_CITIES.map((c) => ({ stateSlug: c.stateSlug, citySlug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { stateSlug: string; citySlug: string };
}): Promise<Metadata> {
  const resolved = await resolveCity(params.stateSlug, params.citySlug);
  if (!resolved) return { title: 'Not found', robots: { index: false } };
  const { def, products } = resolved;
  const title = placeTitle(def.name);
  const description = placeDescription(def.name, products);

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(routes.city(def.stateSlug, def.slug)) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(routes.city(def.stateSlug, def.slug)),
      type: 'website',
    },
    // The gate described in data/locations.ts: a place page with no
    // hand-written local copy says nothing its forty siblings do not say
    // identically, which is the definition of a doorway page. It renders, it
    // links onward, and it stays out of the index.
    ...(placeIsIndexable(def) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function CityPage({
  params,
}: {
  params: { stateSlug: string; citySlug: string };
}) {
  const resolved = await resolveCity(params.stateSlug, params.citySlug);
  if (!resolved) notFound();
  const { def, products } = resolved;
  const state = stateBySlug(def.stateSlug);

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Delivery', path: routes.storesIndex() },
    ...(state ? [{ name: state.name, path: routes.state(state.slug) }] : []),
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

  const siblings = (state?.cities ?? []).filter((c) => c.slug !== def.slug);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: placeTitle(def.name),
        path: routes.city(def.stateSlug, def.slug),
        description: placeDescription(def.name, products),
        items: shown.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      onlineStoreServingSchema({
        placeName: def.name,
        placeType: 'City',
        containedIn: state?.name ?? null,
        path: routes.city(def.stateSlug, def.slug),
      }),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={`Anime Figures & Collectibles Delivered in ${def.name}`}
      crumbs={crumbs}
      summary={placeSummary(def.name, state?.name ?? null, def.note, products)}
      specs={hubSpecs(products, [
        { label: 'Delivering to', value: def.name },
        { label: 'State', value: state?.name ?? '' },
        { label: 'Also known as', value: def.aka ?? '' },
        { label: 'Typical delivery', value: '4–7 business days from dispatch' },
        { label: 'Physical store', value: 'None — online marketplace only' },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Buying anime collectibles in ${def.name} — frequently asked questions`}
      emptyMessage="No products are listed right now — new arrivals appear here automatically."
      linkGroups={[
        {
          title: `Popular series delivered to ${def.name}`,
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
        {
          title: 'Shop by budget',
          links: PRICE_BANDS.map((b) => ({
            label: b.name,
            href: routes.price(b.slug),
          })),
        },
        ...(siblings.length
          ? [
              {
                title: `Other cities in ${state?.name ?? 'this state'}`,
                links: siblings.map((c) => ({
                  label: c.name,
                  href: routes.city(def.stateSlug, c.slug),
                })),
              },
            ]
          : []),
      ]}
      jsonLd={jsonLd}
    />
  );
}
