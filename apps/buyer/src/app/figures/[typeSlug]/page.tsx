import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveType } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import { PRODUCT_TYPES, MIN_PRODUCTS_TYPE } from '@/lib/seo/data/product-types';
import { SERIES } from '@/lib/seo/data/series';
import { PRICE_BANDS } from '@/lib/seo/data/price-bands';
import {
  selectProducts,
  seriesMatcher,
  seriesTypeMatcher,
  HUB_GRID_LIMIT,
} from '@/lib/seo/hub';
import {
  typeTitle,
  typeDescription,
  typeSummary,
  typeFaqs,
  hubSpecs,
} from '@/lib/seo/content';
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
  return PRODUCT_TYPES.map((t) => ({ typeSlug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { typeSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveType(params.typeSlug);
  if (!resolved) return { title: 'Format not found', robots: { index: false } };
  const { def, products } = resolved;

  return {
    title: typeTitle(def),
    description: typeDescription(def, products),
    alternates: { canonical: absoluteUrl(routes.type(def.slug)) },
    openGraph: {
      title: typeTitle(def),
      description: typeDescription(def, products),
      url: absoluteUrl(routes.type(def.slug)),
      type: 'website',
    },
    ...(products.length < MIN_PRODUCTS_TYPE
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function TypeHubPage({
  params,
}: {
  params: { typeSlug: string };
}) {
  const resolved = await resolveType(params.typeSlug);
  if (!resolved) notFound();
  const { def, products, all } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Formats', path: routes.typesIndex() },
    { name: def.name },
  ];

  // Which licences appear in this format, most-stocked first. Drives both the
  // quotable summary sentence and the cross links below it.
  const seriesHere = SERIES.map((s) => ({
    def: s,
    count: def.crossWithSeries
      ? selectProducts(all, seriesTypeMatcher(s, def)).length
      : selectProducts(products, seriesMatcher(s)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const faqs = typeFaqs(def, products);
  const shown = products.slice(0, HUB_GRID_LIMIT);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: typeTitle(def),
        path: routes.type(def.slug),
        description: typeDescription(def, products),
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
      h1={def.name}
      crumbs={crumbs}
      summary={typeSummary(
        def,
        products,
        seriesHere.map((s) => s.def.name),
      )}
      specs={hubSpecs(products, [
        { label: 'Format', value: def.name },
        {
          label: 'Licences listed',
          value: seriesHere.length ? String(seriesHere.length) : '',
        },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Frequently asked questions about ${def.name.toLowerCase()}`}
      emptyMessage={
        <>
          No {def.name.toLowerCase()} are listed right now.{' '}
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
          title: `${def.name} by series`,
          links: seriesHere.map((s) => ({
            label: s.def.name,
            // Only a crossable format has its own series page; otherwise send
            // the visitor to the series hub rather than to a URL that has no
            // page behind it.
            href: def.crossWithSeries
              ? routes.seriesType(s.def.slug, def.slug)
              : routes.series(s.def.slug),
            count: s.count,
          })),
        },
        {
          title: 'Other formats',
          links: PRODUCT_TYPES.filter((t) => t.slug !== def.slug).map((t) => ({
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
      ]}
      jsonLd={jsonLd}
    />
  );
}
