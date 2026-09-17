import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { SERIES_BY_KIND, KIND_LABEL, type SeriesKind } from '@/lib/seo/data/series';
import { countSeries } from '@/lib/seo/hub';
import { listSentence } from '@/lib/seo/content';
import {
  graph,
  breadcrumbSchema,
  collectionPageSchema,
  faqPageSchema,
  organizationSchema,
  webSiteSchema,
  pageListSchema,
  type BreadcrumbItem,
} from '@/lib/seo/schema';

export const revalidate = 300;

const TITLE = 'Anime, Game & Comic Series — Shop Figures by Franchise';
const DESCRIPTION =
  'Browse every anime, manga, game and comic series on Yukizi. Figures, statues, Funko Pops and merchandise organised by franchise, from verified sellers across India.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.seriesIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.seriesIndex()),
    type: 'website',
  },
};

export default async function SeriesIndexPage() {
  const all = listable(await getCatalog());
  const counts = new Map(countSeries(all).map((c) => [c.def.slug, c.count]));

  const kinds: SeriesKind[] = ['anime', 'game', 'comic'];
  const groups = kinds.map((kind) => ({
    title: KIND_LABEL[kind],
    items: [...SERIES_BY_KIND[kind]]
      .sort(
        (a, b) =>
          (counts.get(b.slug) ?? 0) - (counts.get(a.slug) ?? 0) ||
          a.name.localeCompare(b.name),
      )
      .map((s) => ({
        label: s.name,
        href: routes.series(s.slug),
        count: counts.get(s.slug) ?? 0,
        note: s.note,
      })),
  }));

  const stocked = [...counts.entries()].filter(([, n]) => n > 0);
  const topNames = groups
    .flatMap((g) => g.items)
    .filter((i) => (i.count ?? 0) > 0)
    .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
    .slice(0, 8)
    .map((i) => i.label);

  const summary =
    `${SITE_NAME} organises its catalogue by franchise: ${stocked.length} of the ` +
    `${counts.size} series listed below currently have products in stock, across anime and manga, ` +
    `video games, and comics, film and TV. ` +
    (topNames.length
      ? `The deepest ranges right now are ${listSentence(topNames, 8)}. `
      : '') +
    `Every series page carries its own characters, formats and price range, and new listings join automatically as sellers add them.`;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Series' },
  ];

  const faqs = [
    {
      question: `How many anime series does ${SITE_NAME} stock?`,
      answer: `${stocked.length} series currently have at least one product listed on ${SITE_NAME}, out of ${counts.size} tracked franchises. A series with nothing in stock still has a page, so it is ready the moment a seller lists something.`,
    },
    {
      question: `Can I request a series ${SITE_NAME} does not carry?`,
      answer: `Yes. ${SITE_NAME} runs a custom-order request from the site, and sellers list new items continuously — a franchise page that is empty today fills in on its own as stock arrives.`,
    },
  ];

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.seriesIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Series on Yukizi',
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
      h1="Shop by Series"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle={`Frequently asked questions about series on ${SITE_NAME}`}
      jsonLd={jsonLd}
    />
  );
}
