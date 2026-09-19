import type { Metadata } from 'next';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { absoluteUrl } from '@/lib/seo/site';
import { staticPageMetadata } from '@/lib/seo/overrides';
import PolicyPage, { PolicySection } from '@/components/shared/PolicyPage';
import { COMPANY } from '@/config/company';
import { fetchSupportContact, type SupportContact } from '@/lib/seo/support-contact';
import { fetchPlatformStats, trustFacts } from '@/lib/seo/platform-stats';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema } from '@/lib/seo/schema';

const derivedMetadata: Metadata = {
  title: 'About Us',
  alternates: { canonical: absoluteUrl('/about') },
  description:
    'Yukizi is an online store for manga, anime figures, collectibles and accessories, shipping across India.',
};

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata('/about', derivedMetadata);
}

// Rendered as the visible FAQ below AND as FAQPage JSON-LD — one source, so
// the structured data can never say something the page doesn't.
const buildFaqs = (support: SupportContact) => [
  {
    question: 'What is Yukizi?',
    answer: `Yukizi is an online marketplace for manga, anime figures, collectibles and accessories in India, operated by ${COMPANY.legalName}. Products are listed by sellers onboarded onto the platform; Yukizi handles ordering, payment and delivery coordination.`,
  },
  {
    question: 'What does Yukizi sell?',
    answer:
      'Manga volumes and box sets, scale and chibi anime figures, action figures, trading cards and licensed accessories across popular series such as One Piece, Naruto, Bleach and Demon Slayer.',
  },
  {
    question: 'Where does Yukizi deliver?',
    answer:
      'Yukizi ships across India. Every order can be tracked from your account once it is dispatched.',
  },
  {
    question: 'Who sells the products on Yukizi?',
    answer:
      'Each item is sold by a seller onboarded onto the Yukizi platform. The seller of record is shown on the product and order pages.',
  },
  {
    question: 'How can I contact Yukizi?',
    answer: `Email ${support.email} or call ${support.phone} (${COMPANY.supportHours}). Full details are on the contact page at ${absoluteUrl('/contact')}.`,
  },
];

export default async function AboutPage() {
  const support = await fetchSupportContact();
  // Counted from the live catalogue, never configured. Null when the read
  // fails, in which case the section below simply omits the numbers.
  const stats = await fetchPlatformStats();
  const facts = trustFacts(stats);
  const FAQS = buildFaqs(support);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About Yukizi' }];
  return (
    <PolicyPage
      title="About Yukizi"
      showLastUpdated={false}
      intro="Yukizi is an online store for anime figures, manga and pop-culture collectibles in India — run as a marketplace of verified sellers, and built for people who care about what they collect."
    >
      <PolicySection title="What we sell">
        <p>
          Our catalogue covers manga volumes and box sets, scale and chibi figures,
          and licensed accessories across the series our customers ask for most,
          including One Piece, Naruto, Bleach and Demon Slayer.
        </p>
        <p>
          Listings are fulfilled by sellers onboarded onto the Yukizi platform. Each
          product page shows the price, applicable taxes and delivery estimate before
          you commit to an order.
        </p>
      </PolicySection>

      <PolicySection title="How we work">
        <p>
          Yukizi operates as an online marketplace. We list products, take orders and
          coordinate delivery, while the seller of record for each item is shown on
          the product and order pages.
        </p>
        <p>
          Orders are packed and dispatched through our logistics partners, and every
          order can be tracked from your account once it ships.
        </p>
      </PolicySection>

      {/*
        Yukizi at a glance — the section that exists because an assistant asked
        to recommend Indian collectibles sites said it "couldn't independently
        verify Yukizi's marketplace activity or seller count". It could not,
        because none of this was published anywhere.

        Every figure is counted from the live catalogue on each rebuild. None
        of them is typed in, which is the only version of this worth having:
        a number somebody has to remember to correct is a number that will one
        day be wrong in public.
      */}
      <PolicySection title="Yukizi at a glance">
        <p>
          Everything below is either counted from the live catalogue or a
          registration number you can look up. The counts are small because
          Yukizi is young — they are the real ones.
        </p>
        <dl className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <dt className="text-sm font-semibold text-gray-500">{fact.label}</dt>
              <dd className="text-sm text-gray-900 sm:text-right">{fact.value}</dd>
            </div>
          ))}
        </dl>
        {stats && (
          <p className="mt-3 text-xs text-gray-500">
            Counts last taken{' '}
            {new Date(stats.countedAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
            .
          </p>
        )}
      </PolicySection>

      <PolicySection title="Company details">
        <p>
          {COMPANY.brandName} is operated by {COMPANY.legalName}.
        </p>
        <p>Registered office: {COMPANY.registeredAddress}</p>
        <p>CIN: {COMPANY.cin}</p>
        <p>GSTIN: {COMPANY.gstin}</p>
      </PolicySection>

      <PolicySection title="Talk to us">
        <p>
          Questions about an order, a product or the platform are welcome at{' '}
          <a
            href={`mailto:${support.email}`}
            className="text-[#562996] underline underline-offset-4"
          >
            {support.email}
          </a>
          . Our full contact details are on the{' '}
          <a href="/contact" className="text-[#562996] underline underline-offset-4">
            contact page
          </a>
          .
        </p>
      </PolicySection>

      <PolicySection title="Frequently asked questions">
        {FAQS.map((f) => (
          <div key={f.question}>
            <p className="font-semibold text-gray-900">{f.question}</p>
            <p>{f.answer}</p>
          </div>
        ))}
      </PolicySection>

      <Breadcrumbs items={crumbs} className="mb-6" />
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          faqPageSchema(FAQS),
        ]}
      />
    </PolicyPage>
  );
}
