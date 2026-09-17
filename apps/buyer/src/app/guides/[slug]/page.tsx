import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuidePage from '@/components/seo/GuidePage';
import GuidePriceTable from '@/components/seo/GuidePriceTable';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import {
  GUIDES,
  guideBySlug,
  relatedGuidesOf,
  GUIDE_CATEGORY_LABEL,
} from '@/lib/seo/data/guides';
import { seriesBySlug } from '@/lib/seo/data/series';
import { productTypeBySlug } from '@/lib/seo/data/product-types';
import { priceBandBySlug } from '@/lib/seo/data/price-bands';
import { manufacturerBySlug } from '@/lib/seo/data/manufacturers';
import {
  graph,
  breadcrumbSchema,
  guideArticleSchema,
  faqPageSchema,
  organizationSchema,
  webSiteSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';

/**
 * Guides are hand-written and change only when somebody edits this repo, so
 * unlike the catalogue-driven hubs they do not need a short revalidation
 * window. A day is generous; the one guide carrying live data (the price
 * tables) is the reason it is not longer.
 */
export const revalidate = 86400;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

/** Rough body word count, for the Article node's `wordCount`. */
function wordCountOf(slug: string): number {
  const guide = guideBySlug(slug);
  if (!guide) return 0;
  const text = [
    guide.answer,
    ...guide.sections.flatMap((s) => [
      s.heading,
      ...(s.paras ?? []),
      ...(s.bullets ?? []),
      ...(s.table?.rows.flatMap((r) => [r.label, r.value]) ?? []),
    ]),
    ...guide.faqs.flatMap((f) => [f.question, f.answer]),
  ].join(' ');
  return text.trim().split(/\s+/).length;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = guideBySlug(params.slug);
  if (!guide) return { title: 'Guide not found', robots: { index: false } };

  return {
    title: guide.title,
    description: guide.metaDescription,
    alternates: { canonical: absoluteUrl(routes.guide(guide.slug)) },
    openGraph: {
      title: guide.title,
      description: guide.metaDescription,
      url: absoluteUrl(routes.guide(guide.slug)),
      // `article` is the correct og:type for a reference page and is one of
      // the values Next 14's metadata types actually permit.
      type: 'article',
      publishedTime: guide.updated,
      modifiedTime: guide.updated,
    },
  };
}

export default async function GuideRoute({ params }: { params: { slug: string } }) {
  const guide = guideBySlug(params.slug);
  if (!guide) notFound();

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Guides', path: routes.guidesIndex() },
    { name: guide.h1 },
  ];

  // Only the price guide reads the catalogue. Every other guide renders from
  // static data alone, so it costs nothing and cannot fail on an API blip.
  let dataBlock: React.ReactNode = null;
  if (guide.dataBlock === 'price-table') {
    try {
      dataBlock = <GuidePriceTable catalog={listable(await getCatalog())} />;
    } catch {
      // A guide whose prose is intact should not 500 because a table could
      // not be built. The rest of the page is the answer either way.
      dataBlock = null;
    }
  }

  const related = relatedGuidesOf(guide);

  const linkGroups = [
    {
      title: 'Shop what this guide covers',
      links: [
        ...(guide.relatedTypes ?? [])
          .map((slug) => productTypeBySlug(slug))
          .filter((t): t is NonNullable<typeof t> => !!t)
          .map((t) => ({ label: t.name, href: routes.type(t.slug) })),
        ...(guide.relatedManufacturers ?? [])
          .map((slug) => manufacturerBySlug(slug))
          .filter((m): m is NonNullable<typeof m> => !!m)
          .map((m) => ({ label: m.name, href: routes.manufacturer(m.slug) })),
        ...(guide.relatedSeries ?? [])
          .map((slug) => seriesBySlug(slug))
          .filter((s): s is NonNullable<typeof s> => !!s)
          .map((s) => ({ label: s.name, href: routes.series(s.slug) })),
        ...(guide.relatedPriceBands ?? [])
          .map((slug) => priceBandBySlug(slug))
          .filter((b): b is NonNullable<typeof b> => !!b)
          .map((b) => ({ label: b.name, href: routes.price(b.slug) })),
      ],
    },
    {
      title: 'Related guides',
      links: related.map((g) => ({ label: g.h1, href: routes.guide(g.slug) })),
    },
  ];

  const jsonLd = [
    graph(
      guideArticleSchema({
        title: guide.title,
        slug: guide.slug,
        description: guide.metaDescription,
        updated: guide.updated,
        wordCount: wordCountOf(guide.slug),
        section: GUIDE_CATEGORY_LABEL[guide.category],
      }),
      breadcrumbSchema(crumbs),
      faqPageSchema(guide.faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <GuidePage
      guide={guide}
      crumbs={crumbs}
      categoryLabel={GUIDE_CATEGORY_LABEL[guide.category]}
      dataBlock={dataBlock}
      linkGroups={linkGroups}
      jsonLd={jsonLd}
    />
  );
}
