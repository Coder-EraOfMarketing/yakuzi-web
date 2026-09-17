import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveCharacter } from '@/lib/seo/resolve';
import { getCatalog, listable, latestUpdate } from '@/lib/seo/catalog';
import {
  CHARACTERS,
  MIN_PRODUCTS_CHARACTER,
  charactersOfSeries,
} from '@/lib/seo/data/characters';
import { seriesBySlug } from '@/lib/seo/data/series';
import { selectProducts, characterMatcher, HUB_GRID_LIMIT } from '@/lib/seo/hub';
import {
  characterTitle,
  characterDescription,
  characterSummary,
  characterFaqs,
  hubSpecs,
  typesPresent,
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

/** Characters with stock are prerendered; the rest render on demand. */
export async function generateStaticParams() {
  try {
    const all = listable(await getCatalog());
    return CHARACTERS.filter(
      (c) => selectProducts(all, characterMatcher(c)).length >= MIN_PRODUCTS_CHARACTER,
    ).map((c) => ({ characterSlug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { characterSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveCharacter(params.characterSlug);
  if (!resolved) return { title: 'Character not found', robots: { index: false } };
  const { def, products } = resolved;
  const seriesName = seriesBySlug(def.seriesSlug)?.name ?? 'anime';
  const title = characterTitle(def, seriesName);
  const description = characterDescription(def, seriesName, products);

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(routes.character(def.slug)) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(routes.character(def.slug)),
      type: 'website',
    },
    // One product is enough here, unlike the series hubs. A character page
    // carrying a single figure is still the complete and correct answer to
    // "nezuko figure price india"; a series page with one product is not.
    ...(products.length < MIN_PRODUCTS_CHARACTER
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function CharacterHubPage({
  params,
}: {
  params: { characterSlug: string };
}) {
  const resolved = await resolveCharacter(params.characterSlug);
  if (!resolved) notFound();
  const { def, products, all } = resolved;

  const series = seriesBySlug(def.seriesSlug);
  const seriesName = series?.name ?? 'anime';

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Characters', path: routes.charactersIndex() },
    ...(series ? [{ name: series.name, path: routes.series(series.slug) }] : []),
    { name: def.name },
  ];

  const faqs = characterFaqs(def, seriesName, products);
  const formats = typesPresent(products);
  const shown = products.slice(0, HUB_GRID_LIMIT);

  // Siblings from the same series that have stock of their own. Linking a
  // character with nothing listed sends a crawler to a noindex page.
  const siblings = charactersOfSeries(def.seriesSlug)
    .filter((c) => c.slug !== def.slug)
    .map((c) => ({ def: c, count: selectProducts(all, characterMatcher(c)).length }))
    .filter((c) => c.count >= MIN_PRODUCTS_CHARACTER);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: characterTitle(def, seriesName),
        path: routes.character(def.slug),
        description: characterDescription(def, seriesName, products),
        items: shown.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      breadcrumbSchema(crumbs),
      faqs.length ? faqPageSchema(faqs) : null,
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={`${def.name} Figures & Collectibles`}
      crumbs={crumbs}
      summary={characterSummary(def, seriesName, products)}
      specs={hubSpecs(products, [
        { label: 'Character', value: def.name },
        { label: 'Series', value: seriesName },
        { label: 'Also known as', value: (def.aka ?? []).join(', ') },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Frequently asked questions about ${def.short} figures`}
      emptyMessage={
        <>
          No {def.name} collectibles are listed right now.{' '}
          {series && (
            <>
              <Link
                href={routes.series(series.slug)}
                className="text-[#854cbc] underline underline-offset-4"
              >
                Browse all {series.name} products
              </Link>
              .
            </>
          )}
        </>
      }
      linkGroups={[
        {
          title: `More ${seriesName} characters`,
          links: siblings.map((c) => ({
            label: c.def.short,
            href: routes.character(c.def.slug),
            count: c.count,
          })),
        },
        {
          title: `${def.short} by format`,
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
