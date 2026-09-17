import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { STATES, ALL_CITIES } from '@/lib/seo/data/locations';
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

export const revalidate = 3600;

const TITLE = 'Anime Figure Delivery Across India — Cities & States';
const DESCRIPTION =
  'Yukizi delivers anime figures, Funko Pops, manga and collectibles to every serviceable pin code in India. Find delivery details for your city or state.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.storesIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.storesIndex()),
    type: 'website',
  },
};

/**
 * No catalogue read here on purpose.
 *
 * This page lists places, not products, and the location data is static — so
 * it costs zero API calls no matter how hard it is crawled. That matters
 * because this index is the entry point to roughly 140 place URLs and will
 * take the first hit of any sitemap sweep.
 */
export default function StoreIndexPage() {
  const cityCount = ALL_CITIES.length;

  const summary =
    `${SITE_NAME} is an online marketplace, not a chain of shops — there is no branch to walk into in any of the cities below. ` +
    `What these pages cover is delivery: ${SITE_NAME} ships to ${cityCount} listed cities across ${STATES.length} states and union territories, and to every other serviceable pin code in India. ` +
    `Orders are processed within 24–48 hours of payment and typically arrive 4–7 business days after dispatch, tracked throughout. ` +
    `Prices are set nationally by each seller, so there is no city-specific pricing anywhere on ${SITE_NAME}.`;

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Delivery' },
  ];

  const faqs = [
    {
      question: `Which cities does ${SITE_NAME} deliver to?`,
      answer: `Every serviceable pin code in India. ${cityCount} major cities across ${STATES.length} states and union territories have their own delivery page listed here, but coverage is not limited to them — enter your pin code at checkout to confirm.`,
    },
    {
      question: `Does ${SITE_NAME} have a physical store?`,
      answer: `No. ${SITE_NAME} operates entirely online. Every order is placed on the site and shipped by courier from a verified seller. The company is registered in Thane, Maharashtra, which is an office rather than a shop.`,
    },
    {
      question: 'Do prices or delivery times change by city?',
      answer:
        'Prices do not — sellers price nationally and the same listing costs the same everywhere. Delivery time varies a little with distance and courier serviceability, but 4–7 business days from dispatch is typical across the country.',
    },
  ];

  const groups = STATES.map((s) => ({
    title: s.name,
    blurb: s.note,
    items: s.cities.map((c) => ({
      label: c.name,
      href: routes.city(s.slug, c.slug),
      note: c.note,
    })),
  }));

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.storesIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'States and union territories served',
        STATES.map((s) => ({ name: s.name, path: routes.state(s.slug) })),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Delivery Across India"
      crumbs={crumbs}
      summary={summary}
      groups={[
        {
          title: 'States & union territories',
          items: STATES.map((s) => ({
            label: s.name,
            href: routes.state(s.slug),
            count: s.cities.length,
            note: s.note,
          })),
        },
        ...groups,
      ]}
      faqs={faqs}
      faqTitle={`Delivery across India — frequently asked questions`}
      jsonLd={jsonLd}
    />
  );
}
