import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
import { PRICE_BANDS } from '@/lib/seo/data/price-bands';
import { countTypes } from '@/lib/seo/hub';
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

const TITLE = 'Figure Types & Formats — Action Figures, Statues, Funko Pops';
const DESCRIPTION =
  'Every collectible format on Yukizi explained and listed: action figures, collectible statues, Funko Pops, dioramas, noodle stoppers, manga and more, from verified sellers in India.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.typesIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.typesIndex()),
    type: 'website',
  },
};

export default async function TypeIndexPage() {
  const all = listable(await getCatalog());
  const counts = countTypes(all).sort((a, b) => b.count - a.count);

  const stocked = counts.filter((c) => c.count > 0);

  const summary =
    `Collectibles are sold in formats, and the format decides most of the price. ` +
    `${SITE_NAME} lists ${stocked.length} of the ${counts.length} formats tracked below. ` +
    (stocked.length
      ? `Deepest right now: ${listSentence(
          stocked.slice(0, 5).map((c) => `${c.def.name.toLowerCase()} (${c.count})`),
          5,
        )}. `
      : '') +
    `Each format page explains what the format is, what it typically costs, and which licences are available in it.`;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Formats' },
  ];

  const faqs = [
    {
      question: 'What is the difference between an action figure and a statue?',
      answer:
        'An action figure is articulated — the joints move, so it can be reposed on a shelf. A collectible statue is a single fixed pose, which lets the same money go into sculpt detail and paintwork instead of into joints. Neither is better; it depends on whether you rearrange your display.',
    },
    {
      question: 'Which format is cheapest?',
      answer: `Small-format pieces — keychains, miniatures and prize figures such as noodle stoppers — sit at the bottom of the range, and 1:1 prop replicas and large-scale statues at the top. Each format page on ${SITE_NAME} states its own live price range.`,
    },
    {
      question: 'Are Funko Pops articulated?',
      answer:
        'No. A Funko Pop is a fixed-pose stylised vinyl figure; only the head rotates on most releases. They are collected boxed, and on limited or convention releases the sticker on the box carries much of the value.',
    },
  ];

  const groups = [
    {
      title: 'All formats',
      items: counts.map((c) => ({
        label: c.def.name,
        href: routes.type(c.def.slug),
        count: c.count,
        note: c.def.note,
      })),
    },
    {
      title: 'Shop by budget instead',
      blurb: 'If the budget matters more than the format, start here.',
      items: PRICE_BANDS.map((b) => ({
        label: b.name,
        href: routes.price(b.slug),
        note: b.metaDescription,
      })),
    },
  ];

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.typesIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Collectible formats on Yukizi',
        PRODUCT_TYPES.map((t) => ({ name: t.name, path: routes.type(t.slug) })),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Shop by Format"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle="Collectible formats explained"
      jsonLd={jsonLd}
    />
  );
}
