import { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { getCategoriesCachedShared } from '@/lib/server-cache';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveSubCategory } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import { SERIES } from '@/lib/seo/data/series';
import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
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

/**
 * Sub-category landing pages.
 *
 * These URLs are the fix for a problem the sitemap already documented: 45
 * sub-collections existed only as `?sub=` query parameters on the parent
 * category page, every one of them canonicalising to the parent and sharing
 * the parent's title and meta description verbatim. Google crawled them,
 * filed them as "Alternate page with proper canonical tag", and discarded
 * them — 45 built pages earning nothing.
 *
 * The note left in app/sitemap.ts said the right answer was to make them
 * indexable in their own right, which needs distinct titles, distinct
 * descriptions and enough products not to be thin. That is what this route
 * is. It is ADDITIVE: `/category/[slug]?sub=` keeps working exactly as it did
 * for the filter UI, and this path-based page is the canonical, indexable
 * surface for the same set.
 */

export const revalidate = 300;

interface SubCatRef {
  categoryName: string;
  categorySlug: string;
  subName: string;
  subSlug: string;
}

const allSubCategories = cache(async (): Promise<SubCatRef[]> => {
  try {
    const cats = (await getCategoriesCachedShared()) as any[];
    const out: SubCatRef[] = [];
    for (const c of Array.isArray(cats) ? cats : []) {
      if (!c?.slug) continue;
      for (const s of c.subCategories ?? []) {
        if (!s?.slug) continue;
        out.push({
          categoryName: c.name,
          categorySlug: c.slug,
          subName: s.name,
          subSlug: s.slug,
        });
      }
    }
    return out;
  } catch {
    return [];
  }
});

const findSubCategory = cache(
  async (categorySlug: string, subSlug: string): Promise<SubCatRef | null> => {
    const all = await allSubCategories();
    return (
      all.find((s) => s.categorySlug === categorySlug && s.subSlug === subSlug) ?? null
    );
  },
);

export async function generateStaticParams() {
  const all = await allSubCategories();
  return all.map((s) => ({ slug: s.categorySlug, subSlug: s.subSlug }));
}

/** "Action Figures in Figurines" reads badly; "Action Figures" does not. */
function displayName(ref: SubCatRef): string {
  // Several categories carry a sub-category literally called "General", which
  // is meaningless on its own and must borrow its parent's name to mean
  // anything at all.
  return /^(general|others?)$/i.test(ref.subName)
    ? `${ref.categoryName}`
    : ref.subName;
}

function pageTitle(ref: SubCatRef): string {
  const name = displayName(ref);
  return /^(general|others?)$/i.test(ref.subName)
    ? `${ref.categoryName} — Buy Online in India`
    : `${name} — ${ref.categoryName} | Buy Online in India`;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; subSlug: string };
}): Promise<Metadata> {
  const ref = await findSubCategory(params.slug, params.subSlug);
  if (!ref) return { title: 'Not found', robots: { index: false } };
  const { products } = await resolveSubCategory(params.slug, params.subSlug);
  const range = priceRange(products);
  const name = displayName(ref);

  const description = squash(
    `Shop ${name.toLowerCase()} on ${SITE_NAME}. ${products.length} ${
      products.length === 1 ? 'listing' : 'listings'
    }${range ? ` from ${inr(range.min)}` : ''} in ${ref.categoryName}, from verified sellers with tracked delivery across India.`,
  );

  return {
    title: pageTitle(ref),
    description,
    // The canonical points HERE, not at the parent. That is the whole change:
    // the sitemap and the canonical now make the same claim about which URL
    // is the real one for this set.
    alternates: {
      canonical: absoluteUrl(routes.subCategory(ref.categorySlug, ref.subSlug)),
    },
    openGraph: {
      title: pageTitle(ref),
      description,
      url: absoluteUrl(routes.subCategory(ref.categorySlug, ref.subSlug)),
      type: 'website',
    },
    // Most of the 45 sub-categories have zero products today. An empty one
    // stays out of the index and lights up when a seller files something
    // under it.
    ...(products.length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function SubCategoryPage({
  params,
}: {
  params: { slug: string; subSlug: string };
}) {
  const ref = await findSubCategory(params.slug, params.subSlug);
  if (!ref) notFound();
  const { products } = await resolveSubCategory(params.slug, params.subSlug);

  const name = displayName(ref);
  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: ref.categoryName, path: routes.category(ref.categorySlug) },
    { name: ref.subName },
  ];

  const range = rangeText(products);
  const formats = typesPresent(products);
  const seriesHere = SERIES.map((s) => ({
    def: s,
    count: selectProducts(products, seriesMatcher(s)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 18);

  const summary = [
    `${SITE_NAME} lists ${products.length} ${
      products.length === 1 ? 'product' : 'products'
    } under ${ref.subName} in ${ref.categoryName}${range ? `, priced ${range}` : ''}.`,
    formats.length
      ? `The range covers ${listSentence(
          formats.map((f) => f.def.name.toLowerCase()),
          4,
        )}.`
      : '',
    seriesHere.length
      ? `Licences represented include ${listSentence(
          seriesHere.map((s) => s.def.name),
          6,
        )}.`
      : '',
    `Every seller is verified before listing, and orders ship across India with tracking from dispatch.`,
  ]
    .filter(Boolean)
    .join(' ');

  const faqs = [
    {
      question: `What is listed under ${ref.subName} on ${SITE_NAME}?`,
      answer: summary,
    },
    ...(range
      ? [
          {
            question: `How much do ${name.toLowerCase()} cost on ${SITE_NAME}?`,
            answer: `${name} listings on ${SITE_NAME} are priced ${range}. Prices are set by individual verified sellers and change with the size, format and licence of the piece.`,
          },
        ]
      : []),
    {
      question: `How long does delivery take?`,
      answer: `Orders are processed within 24–48 hours of payment and typically deliver in 4–7 business days from dispatch anywhere in India. Damaged or incorrect deliveries are covered when reported within 3 days with photographs; change-of-mind returns are not accepted.`,
    },
  ];

  const siblings = (await allSubCategories()).filter(
    (s) => s.categorySlug === ref.categorySlug && s.subSlug !== ref.subSlug,
  );

  const shown = products.slice(0, HUB_GRID_LIMIT);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: pageTitle(ref),
        path: routes.subCategory(ref.categorySlug, ref.subSlug),
        description: summary,
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
      h1={name}
      crumbs={crumbs}
      summary={summary}
      specs={hubSpecs(products, [
        { label: 'Category', value: ref.categoryName },
        { label: 'Sub-category', value: ref.subName },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Frequently asked questions about ${name.toLowerCase()}`}
      emptyMessage={
        <>
          Nothing is listed under {ref.subName} right now.{' '}
          <Link
            href={routes.category(ref.categorySlug)}
            className="text-[#854cbc] underline underline-offset-4"
          >
            Browse all {ref.categoryName}
          </Link>
          .
        </>
      }
      linkGroups={[
        {
          title: `More in ${ref.categoryName}`,
          links: siblings.map((s) => ({
            label: s.subName,
            href: routes.subCategory(s.categorySlug, s.subSlug),
          })),
        },
        {
          title: 'Shop by series',
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
