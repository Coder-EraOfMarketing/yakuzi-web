import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveSeries } from '@/lib/seo/resolve';
import { SERIES, MIN_PRODUCTS_SERIES, KIND_LABEL } from '@/lib/seo/data/series';
import { CROSSABLE_TYPES, MIN_PRODUCTS_SERIES_TYPE } from '@/lib/seo/data/product-types';
import { selectProducts, seriesTypeMatcher } from '@/lib/seo/hub';
import {
  seriesTitle,
  seriesDescription,
  seriesSummary,
  seriesFaqs,
  hubSpecs,
  charactersPresent,
} from '@/lib/seo/content';
import {
  graph,
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  brandEntitySchema,
  organizationSchema,
  webSiteSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';
import { latestUpdate } from '@/lib/seo/catalog';

// ISR, like the collection hubs: no searchParams are read here, so the CDN
// serves this cached and revalidates in the background. Landing pages must be
// fast for crawlers, and a dynamic render on every crawler hit is how a
// 400-page family becomes an API incident.
export const revalidate = 300;

export function generateStaticParams() {
  return SERIES.map((s) => ({ seriesSlug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { seriesSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveSeries(params.seriesSlug);
  if (!resolved) return { title: 'Series not found', robots: { index: false } };
  const { def, products } = resolved;

  return {
    title: seriesTitle(def),
    description: seriesDescription(def, products),
    alternates: { canonical: absoluteUrl(routes.series(def.slug)) },
    openGraph: {
      title: seriesTitle(def),
      description: seriesDescription(def, products),
      url: absoluteUrl(routes.series(def.slug)),
      type: 'website',
    },
    // A franchise Yukizi barely stocks stays out of the index rather than
    // ranking as a near-empty shell. `follow` stays on so the links out of it
    // still pass authority to the products it does have.
    ...(products.length < MIN_PRODUCTS_SERIES
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function SeriesHubPage({
  params,
}: {
  params: { seriesSlug: string };
}) {
  const resolved = await resolveSeries(params.seriesSlug);
  if (!resolved) notFound();
  const { def, products, all } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Series', path: routes.seriesIndex() },
    { name: def.name },
  ];

  const characters = charactersPresent(def.slug, products);
  const faqs = seriesFaqs(def, products);

  // Only crosses that clear the threshold are linked. Linking a cross page
  // that renders noindex would be advertising a dead end to crawlers.
  const crosses = CROSSABLE_TYPES.map((type) => ({
    type,
    count: selectProducts(all, seriesTypeMatcher(def, type)).length,
  })).filter((c) => c.count >= MIN_PRODUCTS_SERIES_TYPE);

  const siblings = SERIES.filter((s) => s.kind === def.kind && s.slug !== def.slug);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: seriesTitle(def),
        path: routes.series(def.slug),
        description: seriesDescription(def, products),
        items: products.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      brandEntitySchema({
        name: def.name,
        description: def.note,
        path: routes.series(def.slug),
        alternateNames: def.aka,
      }),
      breadcrumbSchema(crumbs),
      faqs.length ? faqPageSchema(faqs) : null,
      // The site entity travels with every hub: Google does not resolve @id
      // references across URLs, so a page naming the publisher without
      // defining it leaves the reference dangling.
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={`${def.name} Figures & Collectibles`}
      crumbs={crumbs}
      summary={seriesSummary(def, products)}
      specs={hubSpecs(products, [
        { label: 'Category', value: KIND_LABEL[def.kind] },
        { label: 'Also known as', value: (def.aka ?? []).join(', ') },
        {
          label: 'Characters listed',
          value: characters.length ? String(characters.length) : '',
        },
      ])}
      products={products}
      faqs={faqs}
      faqTitle={`Frequently asked questions about ${def.name} figures`}
      emptyMessage={
        <>
          No {def.name} products are listed right now — new arrivals appear here
          automatically as sellers list them.{' '}
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
          title: `${def.name} characters`,
          links: characters.map((c) => ({
            label: c.def.short,
            href: routes.character(c.def.slug),
            count: c.count,
          })),
        },
        {
          title: `${def.name} by format`,
          links: crosses.map((c) => ({
            label: c.type.name,
            href: routes.seriesType(def.slug, c.type.slug),
            count: c.count,
          })),
        },
        {
          title: `More ${KIND_LABEL[def.kind].toLowerCase()}`,
          links: siblings.map((s) => ({
            label: s.name,
            href: routes.series(s.slug),
          })),
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
