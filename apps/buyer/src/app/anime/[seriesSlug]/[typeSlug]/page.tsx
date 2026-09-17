import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveSeriesType } from '@/lib/seo/resolve';
import { getCatalog, listable, latestUpdate } from '@/lib/seo/catalog';
import { SERIES } from '@/lib/seo/data/series';
import {
  CROSSABLE_TYPES,
  MIN_PRODUCTS_SERIES_TYPE,
} from '@/lib/seo/data/product-types';
import {
  selectProducts,
  seriesTypeMatcher,
  HUB_GRID_LIMIT,
} from '@/lib/seo/hub';
import {
  seriesTypeTitle,
  seriesTypeDescription,
  seriesTypeSummary,
  hubSpecs,
  charactersPresent,
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

/**
 * Only the crosses that actually have stock are prerendered.
 *
 * The full grid is 41 series x 8 crossable formats = 328 combinations, and
 * the overwhelming majority are empty — nobody sells Haikyuu trading cards on
 * this catalogue today. Prerendering the populated ones keeps the build
 * proportional to real stock while `dynamicParams` (default true) still
 * renders the rest on demand if anything ever links to them.
 *
 * Returning [] when the API is unreachable at build time is deliberate and
 * matches the product page: every URL then falls back to on-demand rendering,
 * which is a slower site, not a broken one.
 */
export async function generateStaticParams() {
  try {
    const all = listable(await getCatalog());
    const params: Array<{ seriesSlug: string; typeSlug: string }> = [];
    for (const series of SERIES) {
      for (const type of CROSSABLE_TYPES) {
        const count = selectProducts(all, seriesTypeMatcher(series, type)).length;
        if (count >= MIN_PRODUCTS_SERIES_TYPE) {
          params.push({ seriesSlug: series.slug, typeSlug: type.slug });
        }
      }
    }
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { seriesSlug: string; typeSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveSeriesType(params.seriesSlug, params.typeSlug);
  if (!resolved) return { title: 'Not found', robots: { index: false } };
  const { series, type, products } = resolved;
  const title = seriesTypeTitle(series, type);
  const description = seriesTypeDescription(series, type, products);

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(routes.seriesType(series.slug, type.slug)),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(routes.seriesType(series.slug, type.slug)),
      type: 'website',
    },
    // Cross pages are the family most at risk of reading as templated
    // doorways, so the bar is the highest here. Below it, the page exists,
    // links onward and stays out of the index.
    ...(products.length < MIN_PRODUCTS_SERIES_TYPE
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function SeriesTypeHubPage({
  params,
}: {
  params: { seriesSlug: string; typeSlug: string };
}) {
  const resolved = await resolveSeriesType(params.seriesSlug, params.typeSlug);
  if (!resolved) notFound();
  const { series, type, products, all } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Series', path: routes.seriesIndex() },
    { name: series.name, path: routes.series(series.slug) },
    { name: type.name },
  ];

  const faqs = [
    {
      question: `How much do ${series.name} ${type.name.toLowerCase()} cost in India?`,
      answer: seriesTypeSummary(series, type, products),
    },
    {
      question: `What is ${/^[aeiou]/i.test(type.singular) ? 'an' : 'a'} ${type.singular}?`,
      answer: type.note,
    },
    {
      question: `Are ${series.name} ${type.name.toLowerCase()} on Yukizi authentic?`,
      answer: `Every seller on Yukizi is verified before they are allowed to list, and each listing carries photographs of the actual item and its packaging. Yukizi operates as a marketplace, so more than one verified seller may list the same ${series.name} piece and the price shown is the best current offer.`,
    },
  ];

  const siblingTypes = CROSSABLE_TYPES.map((t) => ({
    type: t,
    count: selectProducts(all, seriesTypeMatcher(series, t)).length,
  })).filter((c) => c.count >= MIN_PRODUCTS_SERIES_TYPE && c.type.slug !== type.slug);

  const characters = charactersPresent(series.slug, products);

  const shown = products.slice(0, HUB_GRID_LIMIT);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: seriesTypeTitle(series, type),
        path: routes.seriesType(series.slug, type.slug),
        description: seriesTypeDescription(series, type, products),
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
      h1={`${series.name} ${type.name}`}
      crumbs={crumbs}
      summary={seriesTypeSummary(series, type, products)}
      specs={hubSpecs(products, [
        { label: 'Series', value: series.name },
        { label: 'Format', value: type.name },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Frequently asked questions about ${series.name} ${type.name.toLowerCase()}`}
      emptyMessage={
        <>
          No {series.name} {type.name.toLowerCase()} are listed right now.{' '}
          <Link
            href={routes.series(series.slug)}
            className="text-[#854cbc] underline underline-offset-4"
          >
            See every {series.name} collectible
          </Link>
          .
        </>
      }
      linkGroups={[
        {
          title: `Other ${series.name} formats`,
          links: siblingTypes.map((c) => ({
            label: c.type.name,
            href: routes.seriesType(series.slug, c.type.slug),
            count: c.count,
          })),
        },
        {
          title: `${series.name} characters`,
          links: characters.map((c) => ({
            label: c.def.short,
            href: routes.character(c.def.slug),
            count: c.count,
          })),
        },
        {
          title: `All ${type.name.toLowerCase()}`,
          links: [{ label: `Browse every ${type.singular}`, href: routes.type(type.slug) }],
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
