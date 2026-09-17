import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { MANUFACTURERS } from '@/lib/seo/data/manufacturers';
import { countManufacturers } from '@/lib/seo/hub';
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

const TITLE = 'Figure Manufacturers — Funko, Banpresto, Good Smile & More';
const DESCRIPTION =
  'Who actually makes your figures: Funko, Banpresto, Bandai Spirits, Good Smile Company, FuRyu, Kotobukiya and more, with what each is known for and what Yukizi stocks.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.manufacturersIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.manufacturersIndex()),
    type: 'website',
  },
};

export default async function ManufacturerIndexPage() {
  const all = listable(await getCatalog());
  const counts = countManufacturers(all).sort((a, b) => b.count - a.count);
  const stocked = counts.filter((c) => c.count > 0);

  const summary =
    `Who made a figure decides almost everything about it: whether it is articulated, whether it was sold at retail or won from a Japanese arcade crane game, and roughly what it should cost. ` +
    `${SITE_NAME} tracks ${counts.length} manufacturers` +
    (stocked.length
      ? `, of which ${stocked.length} currently ${stocked.length === 1 ? 'has' : 'have'} products listed — ${listSentence(
          stocked.slice(0, 6).map((c) => `${c.def.name} (${c.count})`),
          6,
        )}. `
      : '. ') +
    `Each manufacturer page explains what that company is known for, where it is based, and which of its pieces are in stock.`;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Manufacturers' },
  ];

  const faqs = [
    {
      question: 'Does the manufacturer of an anime figure matter?',
      answer:
        'Yes, more than the licence does for price. A Banpresto or Sega prize figure of a character costs a fraction of a Good Smile or Alter scale figure of the same character, because prize figures are produced for Japanese arcade distribution at a lower cost per unit. Neither is a fake — they are different products at different price points.',
    },
    {
      question: 'What is the difference between a prize figure and a retail figure?',
      answer:
        'Prize figures — from Banpresto, Sega, Taito and FuRyu — were originally distributed through crane games in Japanese arcades rather than sold in shops. They carry no stated scale, use simpler paint applications, and cost considerably less. Retail scale figures from Good Smile, Alter, Kotobukiya or MegaHouse state a scale, come in larger boxes and carry more paint and sculpt work.',
    },
    {
      question: `Which manufacturers does ${SITE_NAME} stock?`,
      answer: stocked.length
        ? `${listSentence(stocked.map((c) => c.def.name), 8)} currently have products listed. The remaining manufacturer pages exist and fill in automatically as sellers list their pieces.`
        : `Manufacturer information is being added to the catalogue. These pages fill in automatically as sellers record the maker on their listings.`,
    },
  ];

  const groups = [
    {
      title: 'All manufacturers',
      items: counts.map((c) => ({
        label: c.def.name,
        href: routes.manufacturer(c.def.slug),
        count: c.count,
        note: `${c.def.country} — ${c.def.knownFor}`,
      })),
    },
  ];

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.manufacturersIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Figure manufacturers',
        MANUFACTURERS.map((m) => ({
          name: m.name,
          path: routes.manufacturer(m.slug),
        })),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Shop by Manufacturer"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle="Figure manufacturers explained"
      jsonLd={jsonLd}
    />
  );
}
