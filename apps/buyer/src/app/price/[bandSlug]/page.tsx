import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolvePriceBand } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import { PRICE_BANDS, MIN_PRODUCTS_PRICE } from '@/lib/seo/data/price-bands';
import { SERIES } from '@/lib/seo/data/series';
import { selectProducts, seriesMatcher, HUB_GRID_LIMIT } from '@/lib/seo/hub';
import { priceSummary, hubSpecs, typesPresent } from '@/lib/seo/content';
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
  return PRICE_BANDS.map((b) => ({ bandSlug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { bandSlug: string };
}): Promise<Metadata> {
  const resolved = await resolvePriceBand(params.bandSlug);
  if (!resolved) return { title: 'Not found', robots: { index: false } };
  const { def, products } = resolved;

  return {
    title: def.title,
    description: def.metaDescription,
    alternates: { canonical: absoluteUrl(routes.price(def.slug)) },
    openGraph: {
      title: def.title,
      description: def.metaDescription,
      url: absoluteUrl(routes.price(def.slug)),
      type: 'website',
    },
    ...(products.length < MIN_PRODUCTS_PRICE
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function PriceHubPage({
  params,
}: {
  params: { bandSlug: string };
}) {
  const resolved = await resolvePriceBand(params.bandSlug);
  if (!resolved) notFound();
  const { def, products } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Shop by budget', path: routes.pricesIndex() },
    { name: def.name },
  ];

  const seriesHere = SERIES.map((s) => ({
    def: s,
    count: selectProducts(products, seriesMatcher(s)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const formats = typesPresent(products);
  const shown = products.slice(0, HUB_GRID_LIMIT);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: def.title,
        path: routes.price(def.slug),
        description: def.metaDescription,
        items: shown.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      breadcrumbSchema(crumbs),
      faqPageSchema(def.faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={def.h1}
      crumbs={crumbs}
      summary={priceSummary(
        def.name,
        products,
        seriesHere.map((s) => s.def.name),
      )}
      intro={def.intro}
      specs={hubSpecs(products, [
        {
          label: 'Budget',
          // States the bound explicitly rather than leaving the reader to
          // infer it from the title — an answer engine quoting this row needs
          // the numbers to travel with it.
          value: def.max
            ? `₹${def.min.toLocaleString('en-IN')} to under ₹${def.max.toLocaleString('en-IN')}`
            : `₹${def.min.toLocaleString('en-IN')} and above`,
        },
      ])}
      products={shown}
      total={products.length}
      faqs={def.faqs}
      faqTitle={`Frequently asked questions about collectibles ${def.name.toLowerCase()}`}
      emptyMessage={
        <>
          Nothing is listed in this price band right now.{' '}
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
          title: 'Other budgets',
          links: PRICE_BANDS.filter((b) => b.slug !== def.slug).map((b) => ({
            label: b.name,
            href: routes.price(b.slug),
          })),
        },
        {
          title: `Series available ${def.name.toLowerCase()}`,
          links: seriesHere.map((s) => ({
            label: s.def.name,
            href: routes.series(s.def.slug),
            count: s.count,
          })),
        },
        {
          title: 'Formats in this band',
          links: formats.map((f) => ({
            label: f.def.name,
            href: routes.type(f.def.slug),
            count: f.count,
          })),
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
