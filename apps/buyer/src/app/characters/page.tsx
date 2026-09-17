import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { SERIES } from '@/lib/seo/data/series';
import { charactersOfSeries } from '@/lib/seo/data/characters';
import { countCharacters } from '@/lib/seo/hub';
import { listSentence } from '@/lib/seo/content';
import {
  graph,
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  pageListSchema,
  organizationSchema,
  webSiteSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';

export const revalidate = 300;

const TITLE = 'Anime & Game Characters — Shop Figures by Character';
const DESCRIPTION =
  'Every character with a figure on Yukizi, grouped by series. Find Nezuko, Gojo, Luffy, Goku, Levi and more — statues, action figures and Funko Pops from verified sellers in India.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.charactersIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.charactersIndex()),
    type: 'website',
  },
};

export default async function CharacterIndexPage() {
  const all = listable(await getCatalog());
  const counts = new Map(countCharacters(all).map((c) => [c.def.slug, c.count]));

  // Grouped by series, and series with stock float to the top — a directory
  // ordered alphabetically buries the half that can actually be bought.
  const groups = SERIES.map((s) => {
    const items = charactersOfSeries(s.slug)
      .map((c) => ({
        label: c.name,
        href: routes.character(c.slug),
        count: counts.get(c.slug) ?? 0,
        note: c.note,
      }))
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0) || a.label.localeCompare(b.label));
    return {
      title: s.name,
      blurb: s.note,
      items,
      stocked: items.filter((i) => (i.count ?? 0) > 0).length,
    };
  })
    .filter((g) => g.items.length > 0)
    .sort((a, b) => b.stocked - a.stocked || a.title.localeCompare(b.title));

  const stockedCharacters = [...counts.values()].filter((n) => n > 0).length;
  const topNames = groups
    .flatMap((g) => g.items)
    .filter((i) => (i.count ?? 0) > 0)
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 8)
    .map((i) => i.label);

  const summary =
    `${SITE_NAME} tracks ${counts.size} characters across ${groups.length} series, of which ` +
    `${stockedCharacters} currently have at least one figure or statue listed. ` +
    (topNames.length ? `Best represented right now: ${listSentence(topNames, 8)}. ` : '') +
    `Each character page gathers every listing of that character in one place, with the live price range and the formats available.`;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Characters' },
  ];

  const faqs = [
    {
      question: `How do I find a figure of a specific anime character?`,
      answer: `Use the character list on this page. Each entry links to a page holding every ${SITE_NAME} listing of that character, with the current price range and the formats available — action figure, statue, Funko Pop and so on.`,
    },
    {
      question: `Why do some characters show no products?`,
      answer: `Because nothing of that character is listed at the moment. ${SITE_NAME} is a marketplace, so the catalogue changes as verified sellers list and sell. Those pages stay out of search results until stock arrives, then appear automatically.`,
    },
  ];

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.charactersIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Characters on Yukizi',
        groups.flatMap((g) => g.items.map((i) => ({ name: i.label, path: i.href }))),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Shop by Character"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle={`Finding character figures on ${SITE_NAME}`}
      jsonLd={jsonLd}
    />
  );
}
