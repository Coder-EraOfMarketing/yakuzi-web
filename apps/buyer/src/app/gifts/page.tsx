import type { Metadata } from 'next';
import HubIndex from '@/components/seo/HubIndex';
import { absoluteUrl, SITE_NAME } from '@/lib/seo/site';
import { routes } from '@/lib/seo/url';
import { getCatalog, listable } from '@/lib/seo/catalog';
import { GIFT_OCCASIONS, giftBudgetText } from '@/lib/seo/data/gift-occasions';
import { countGiftOccasions } from '@/lib/seo/hub';
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

const TITLE = 'Anime Gifts for Every Occasion — Diwali, Rakhi, Birthdays & More';
const DESCRIPTION =
  'Gift guides for anime fans in India by occasion — Diwali, Raksha Bandhan, Bhai Dooj, Friendship Day, Valentine’s, birthdays, anniversaries and Christmas — each with a real budget and order-by date.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: absoluteUrl(routes.giftsIndex()) },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: absoluteUrl(routes.giftsIndex()),
    type: 'website',
  },
};

export default async function GiftsIndexPage() {
  const all = listable(await getCatalog());
  const counts = new Map(countGiftOccasions(all).map((c) => [c.def.slug, c.count]));

  const crumbs: BreadcrumbItem[] = [
    { name: 'Home', path: routes.home() },
    { name: 'Gifts' },
  ];

  const summary =
    `Nine gift guides, one per occasion, each bounded by the budget that occasion actually occupies — ` +
    `₹500 to ₹3,000 for Rakhi, under ₹1,500 for Friendship Day, ₹2,500 and above for an anniversary. ` +
    `They draw on the same ${SITE_NAME} catalogue; what differs between them is the budget, the criteria for a good gift, and the order-by date, ` +
    `which for a festival with a fixed date is the part most people get wrong.`;

  const faqs = [
    {
      question: 'How far ahead should I order an anime figure as a gift?',
      answer:
        'A week for a normal date, two weeks around Diwali or Christmas when courier networks run at peak load, and three weeks for a large statue. Orders process in 24–48 hours and deliver in 4–7 business days from dispatch — the extra margin is so a damaged delivery can be reported within the 3-day window and replaced before the date.',
    },
    {
      question: 'What is the safest anime gift if I do not know what they collect?',
      answer:
        'A Funko Pop or a prize figure of the lead character from a series they are currently watching, in the ₹1,000–₹2,500 range. Ask which anime they are watching rather than guessing — it is a normal question and it turns a guess into a hit.',
    },
    {
      question: 'Do gift pages have different products from the rest of the site?',
      answer:
        `No, and it is worth saying plainly: every page here draws on the same ${SITE_NAME} catalogue. What each occasion page does is apply the budget range that occasion actually occupies and explain what makes a good gift for it. The reasoning is the content, not a hidden product list.`,
    },
    {
      question: 'Can I get a gift delivered to a different city?',
      answer:
        'Yes. Orders ship to every serviceable pin code in India with tracking, typically 4–7 business days after dispatch. Enter the recipient’s address at checkout and the pin code is validated before you pay.',
    },
  ];

  const groups = [
    {
      title: 'Festivals',
      blurb:
        'Fixed or lunar-calendar dates, which makes the order-by date the binding constraint rather than the budget.',
      items: GIFT_OCCASIONS.filter((o) =>
        ['diwali', 'rakhi', 'bhai-dooj', 'friendship-day', 'christmas'].includes(o.slug),
      ).map((o) => ({
        label: o.name,
        href: routes.gift(o.slug),
        count: counts.get(o.slug) ?? 0,
        note: `${giftBudgetText(o)} — ${o.timing}`,
      })),
    },
    {
      title: 'Personal occasions',
      blurb: 'Dates you know in advance, which is what makes a large piece practical.',
      items: GIFT_OCCASIONS.filter((o) =>
        ['birthday', 'anniversary', 'valentines-day'].includes(o.slug),
      ).map((o) => ({
        label: o.name,
        href: routes.gift(o.slug),
        count: counts.get(o.slug) ?? 0,
        note: `${giftBudgetText(o)} — ${o.timing}`,
      })),
    },
    {
      title: 'Not sure where to start',
      items: GIFT_OCCASIONS.filter((o) => o.slug === 'anime-fan').map((o) => ({
        label: o.name,
        href: routes.gift(o.slug),
        count: counts.get(o.slug) ?? 0,
        note: `${giftBudgetText(o)} — what to buy and what to avoid.`,
      })),
    },
  ];

  const jsonLd = [
    graph(
      collectionPageSchema({
        name: TITLE,
        path: routes.giftsIndex(),
        description: DESCRIPTION,
        items: [],
      }),
      pageListSchema(
        'Gift guides by occasion',
        GIFT_OCCASIONS.map((o) => ({ name: o.name, path: routes.gift(o.slug) })),
      ),
      breadcrumbSchema(crumbs),
      faqPageSchema(faqs),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  return (
    <HubIndex
      h1="Anime Gifts by Occasion"
      crumbs={crumbs}
      summary={summary}
      groups={groups}
      faqs={faqs}
      faqTitle="Gifting anime collectibles — frequently asked questions"
      jsonLd={jsonLd}
    />
  );
}
