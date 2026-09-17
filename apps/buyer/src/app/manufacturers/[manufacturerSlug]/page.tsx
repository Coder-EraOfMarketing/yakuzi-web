import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HubPage from '@/components/seo/HubPage';
import { absoluteUrl } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { resolveManufacturer } from '@/lib/seo/resolve';
import { latestUpdate } from '@/lib/seo/catalog';
import {
  MANUFACTURERS,
  MIN_PRODUCTS_MANUFACTURER,
} from '@/lib/seo/data/manufacturers';
import { SERIES } from '@/lib/seo/data/series';
import { selectProducts, seriesMatcher, HUB_GRID_LIMIT } from '@/lib/seo/hub';
import {
  manufacturerTitle,
  manufacturerDescription,
  manufacturerSummary,
  manufacturerFaqs,
  hubSpecs,
  typesPresent,
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

export const revalidate = 300;

export function generateStaticParams() {
  return MANUFACTURERS.map((m) => ({ manufacturerSlug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { manufacturerSlug: string };
}): Promise<Metadata> {
  const resolved = await resolveManufacturer(params.manufacturerSlug);
  if (!resolved) return { title: 'Manufacturer not found', robots: { index: false } };
  const { def, products } = resolved;

  return {
    title: manufacturerTitle(def),
    description: manufacturerDescription(def, products),
    alternates: { canonical: absoluteUrl(routes.manufacturer(def.slug)) },
    openGraph: {
      title: manufacturerTitle(def),
      description: manufacturerDescription(def, products),
      url: absoluteUrl(routes.manufacturer(def.slug)),
      type: 'website',
    },
    // Almost every page in this family is below the bar today, because the
    // `manufacturer` column is unpopulated — see data/manufacturers.ts. They
    // stay out of the index and activate on the first revalidation after the
    // column is filled in, with no code change.
    ...(products.length < MIN_PRODUCTS_MANUFACTURER
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}

export default async function ManufacturerHubPage({
  params,
}: {
  params: { manufacturerSlug: string };
}) {
  const resolved = await resolveManufacturer(params.manufacturerSlug);
  if (!resolved) notFound();
  const { def, products } = resolved;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Manufacturers', path: routes.manufacturersIndex() },
    { name: def.name },
  ];

  const seriesHere = SERIES.map((s) => ({
    def: s,
    count: selectProducts(products, seriesMatcher(s)).length,
  }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  const formats = typesPresent(products);
  const faqs = manufacturerFaqs(def, products);
  const shown = products.slice(0, HUB_GRID_LIMIT);

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: manufacturerTitle(def),
        path: routes.manufacturer(def.slug),
        description: manufacturerDescription(def, products),
        items: shown.map((p) => ({ name: p.name, slug: p.slug, id: p.id })),
        dateModified: latestUpdate(products),
      }),
      // The maker as a named entity, so "Banpresto" on the page resolves to a
      // company rather than to a string.
      brandEntitySchema({
        name: def.name,
        description: def.note,
        path: routes.manufacturer(def.slug),
        alternateNames: def.aliases,
      }),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubPage
      h1={`${def.name} Figures & Collectibles`}
      crumbs={crumbs}
      summary={manufacturerSummary(
        def,
        products,
        seriesHere.map((s) => s.def.name),
      )}
      specs={hubSpecs(products, [
        { label: 'Manufacturer', value: def.name },
        { label: 'Country of origin', value: def.country },
        { label: 'Also written', value: (def.aliases ?? []).join(', ') },
        { label: 'Known for', value: def.knownFor },
      ])}
      products={shown}
      total={products.length}
      faqs={faqs}
      faqTitle={`Frequently asked questions about ${def.name} figures`}
      emptyMessage={
        <>
          No {def.name} products are listed right now — they appear here
          automatically as sellers list them.{' '}
          <Link
            href={routes.manufacturersIndex()}
            className="text-[#854cbc] underline underline-offset-4"
          >
            See all manufacturers
          </Link>
          .
        </>
      }
      linkGroups={[
        {
          title: `${def.name} by series`,
          links: seriesHere.map((s) => ({
            label: s.def.name,
            href: routes.series(s.def.slug),
            count: s.count,
          })),
        },
        {
          title: `${def.name} by format`,
          links: formats.map((f) => ({
            label: f.def.name,
            href: routes.type(f.def.slug),
            count: f.count,
          })),
        },
        {
          title: 'Other manufacturers',
          links: MANUFACTURERS.filter((m) => m.slug !== def.slug).map((m) => ({
            label: m.name,
            href: routes.manufacturer(m.slug),
          })),
        },
      ]}
      jsonLd={jsonLd}
    />
  );
}
