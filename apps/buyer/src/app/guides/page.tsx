import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import {
  GUIDES,
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABEL,
  GUIDE_CATEGORY_BLURB,
  guidesByCategory,
} from '@/lib/seo/data/guides';
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

export const revalidate = 86400;

const TITLE = 'Collector Guides — Authenticity, Formats, Care & Collecting in India';
const DESCRIPTION =
  'Practical guides for anime figure collectors in India: spotting bootlegs and fake Funko Pops, customs duty, figure scales and formats, and how to clean, display and store a collection.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.guidesIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.guidesIndex()),
    type: 'website',
  },
};

/**
 * No catalogue read. Guides are static content, so this index costs nothing
 * to serve however hard it is crawled — which matters because it is the entry
 * point to the whole cluster.
 */
export default function GuidesIndexPage() {
  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Guides' },
  ];

  const summary =
    `${GUIDES.length} guides on collecting anime figures and pop-culture collectibles, written for buyers in India. ` +
    `They cover the four questions that actually cost people money: how to tell an official figure from a recast, what import duty and BIS rules do to Indian prices, what the formats and scales mean, and how to keep a collection from yellowing or breaking. ` +
    `None of them require you to buy anything — they exist because most good writing on this subject assumes a US or European reader.`;

  const faqs = [
    {
      question: 'What is the most important thing to check before buying an anime figure?',
      answer:
        'The face. Eyes and eyebrows are applied by precision tampo printing on official figures and it is the hardest element to copy, so blurred or misaligned facial printing is the most reliable indicator of a recast. On a Funko Pop, check the box printing and the small copyright text instead.',
    },
    {
      question: 'Why are anime figures more expensive in India?',
      answer:
        'Customs duty on toys, IGST applied on the duty-inclusive value, air freight billed on volume rather than weight, and a per-line BIS certification cost since January 2021. Duty and freight both scale with the size of the piece, which is why prize figures and Funko Pops price much closer to Japanese levels than large statues do.',
    },
    {
      question: 'Do these guides only apply to figures bought on Yukizi?',
      answer:
        `No. They are about the category, not the shop — the authenticity checks, format explanations and care advice apply to a figure bought anywhere, including one you import yourself. Where a ${SITE_NAME} policy is relevant, such as the 3-day damage reporting window, the guide says so explicitly.`,
    },
  ];

  const groups = GUIDE_CATEGORIES.map((category) => ({
    title: GUIDE_CATEGORY_LABEL[category],
    blurb: GUIDE_CATEGORY_BLURB[category],
    items: guidesByCategory(category).map((g) => ({
      label: g.h1,
      href: routes.guide(g.slug),
      note: g.answer,
    })),
  }));

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.guidesIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Collector guides',
        GUIDES.map((g) => ({ name: g.h1, path: routes.guide(g.slug) })),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Collector Guides"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle="Collecting in India — the short answers"
      jsonLd={jsonLd}
    />
  );
}
