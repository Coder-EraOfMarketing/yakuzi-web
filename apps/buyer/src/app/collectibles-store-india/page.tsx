import Link from 'next/link';
import type { Metadata } from 'next';
import HomeNavbar from '@/components/landing/HomeNavbar';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import SeoFaq from '@/components/seo/SeoFaq';
import {
  breadcrumbSchema,
  faqPageSchema,
  organizationSchema,
  webSiteSchema,
  graph,
  type BreadcrumbItem,
} from '@/lib/seo/schema';
import { absoluteUrl, SITE_URL } from '@/lib/seo/site';
import { COLLECTIONS } from '@/data/collections';
import { CATEGORY_CONTENT } from '@/data/category-content';

// The pillar page for the head queries — "online collectible store India",
// "anime figure store India", "where to buy anime figures in India". One
// strong, honest page beats a permutation grid: it concentrates internal
// links and answers the actual question a searcher (or an LLM composing an
// answer) is asking. Static content + hourly ISR.
export const revalidate = 3600;

const FAQS = [
  {
    question: 'What is Yukizi?',
    answer:
      'Yukizi is an Indian online marketplace for anime figures, manga, comics and pop-culture collectibles, operated by Yukizi Market Services Private Limited (Thane, Maharashtra). Products are listed by sellers onboarded onto the platform, and every product page shows the price, taxes and delivery estimate before you order.',
  },
  {
    question: 'Is buying collectibles on Yukizi safe?',
    answer:
      'Sellers are onboarded and vetted before they can list, every order is trackable from your account, and damaged or wrong-item deliveries are covered: report within 3 days of delivery with photos for a replacement or a refund to your original payment method. The company publishes its registered details, CIN and GSTIN on the About page, and a named grievance officer on the Contact page.',
  },
  {
    question: 'How fast is delivery across India?',
    answer:
      'Orders are processed within 24–48 hours of payment confirmation and typically arrive 4–7 business days from dispatch anywhere in India. Tracking details are sent to your email or phone once the order ships, and shipping is free on eligible orders.',
  },
  {
    question: 'What kind of collectibles does Yukizi carry?',
    answer:
      'Anime figures and statues (Naruto, One Piece, Demon Slayer, Dragon Ball and more), Funko Pops across anime, gaming and superheroes, video-game figures, comics, and desk-scale collectibles. The catalogue grows as sellers list new stock — collection pages update automatically.',
  },
  {
    question: 'Can I return a figure if it arrives damaged?',
    answer:
      'Yes. Returns are accepted for damaged or wrong-item deliveries reported within 3 days of receiving the order, with clear photos of the product and packaging. Approved cases get a replacement or a refund to the original payment method.',
  },
];

export const metadata: Metadata = {
  title: 'Online Anime & Collectibles Store in India',
  description:
    'Yukizi is India’s online marketplace for anime figures, Funko Pops, manga and pop-culture collectibles — verified sellers, tracked delivery across India, free shipping on eligible orders.',
  alternates: { canonical: absoluteUrl('/collectibles-store-india') },
};

export default function CollectiblesStoreIndiaPage() {
  const crumbs: BreadcrumbItem[] = [{ name: 'Home', path: '/' }, { name: 'About the store' }];

  const jsonLd = [
    graph(
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${absoluteUrl('/collectibles-store-india')}#webpage`,
        name: 'Yukizi — Online Anime & Collectibles Store in India',
        url: absoluteUrl('/collectibles-store-india'),
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      breadcrumbSchema(crumbs),
      faqPageSchema(FAQS),
      organizationSchema(),
      webSiteSchema(),
    ),
  ];

  const hubs = COLLECTIONS.filter((c) => ['series', 'brand'].includes(c.kind));
  const cats = CATEGORY_CONTENT.filter((c) =>
    ['figurines', 'funko-pop', 'collectables', 'books'].includes(c.slug),
  );

  return (
    <main className="w-full min-h-screen relative pb-[var(--nav-clearance,150px)]">
      <JsonLd data={jsonLd} />
      <HomeNavbar />

      <article className="mx-auto w-full max-w-3xl px-4 pt-6 sm:pt-10">
        <Breadcrumbs items={crumbs} className="mb-3" />
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          India&rsquo;s Online Anime &amp; Collectibles Store
        </h1>

        <div className="mt-5 flex flex-col gap-4 text-sm sm:text-base leading-relaxed text-gray-600">
          <p>
            Finding genuine collectibles in India has always meant a compromise: local stores carry
            limited stock at unpredictable prices, imports mean customs guesswork, and the bootleg
            problem is real enough that seasoned collectors treat every marketplace listing with
            suspicion. Yukizi exists to remove that compromise — an Indian marketplace built only
            for collectibles, where sellers are onboarded and vetted, prices include taxes before
            checkout, and every order ships tracked to your door.
          </p>
          <p>
            The catalogue runs from{' '}
            <Link href="/category/figurines" className="text-[#854cbc] underline underline-offset-4">
              sculpted anime figures and statues
            </Link>{' '}
            — Naruto, One Piece, Demon Slayer, Dragon Ball — through{' '}
            <Link href="/category/funko-pop" className="text-[#854cbc] underline underline-offset-4">
              Funko Pops
            </Link>{' '}
            spanning anime, gaming and superheroes, to comics and desk-scale pieces. Whether you
            are buying a first figure under &#8377;2,000 or a collector-grade centrepiece statue,
            each listing shows the exact item photographed, the seller behind it, and a delivery
            estimate before you commit.
          </p>
          <p>
            Yukizi is operated by Yukizi Market Services Private Limited, registered in Thane,
            Maharashtra, with its company details, GSTIN and a named grievance officer published on
            the{' '}
            <Link href="/about" className="text-[#854cbc] underline underline-offset-4">
              About
            </Link>{' '}
            and{' '}
            <Link href="/contact" className="text-[#854cbc] underline underline-offset-4">
              Contact
            </Link>{' '}
            pages — the accountability layer most grey-import sellers never offer. Delivery covers
            all of India, typically 4–7 business days from dispatch, free on eligible orders, with
            a 3-day damage-return window on every delivery.
          </p>
        </div>

        <h2 className="mt-8 text-lg sm:text-xl font-bold text-gray-900">Shop by series &amp; brand</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {hubs.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#854cbc] hover:text-[#854cbc]"
              >
                {c.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/collections"
              className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#854cbc] hover:text-[#854cbc]"
            >
              All collections
            </Link>
          </li>
        </ul>

        <h2 className="mt-8 text-lg sm:text-xl font-bold text-gray-900">Browse the catalogue</h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="block rounded-2xl border border-gray-200 bg-white p-4 transition-colors hover:border-[#854cbc]"
              >
                <span className="block text-base font-semibold text-gray-900">
                  {c.title.replace(/\s*(—|—).*$/, '').replace(/ Online in India.*$/, '').replace(/^Buy /, '')}
                </span>
                <span className="mt-1 block text-sm text-gray-500">{c.metaDescription}</span>
              </Link>
            </li>
          ))}
        </ul>
      </article>

      <SeoFaq faqs={FAQS} />
    </main>
  );
}
