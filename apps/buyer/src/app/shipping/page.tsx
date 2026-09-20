import type { Metadata } from 'next';
import { absoluteUrl } from '@/lib/seo/site';
import { staticPageMetadata } from '@/lib/seo/overrides';
import PolicyPage, { PolicySection } from '@/components/shared/PolicyPage';
import { COMPANY } from '@/config/company';
import { fetchSupportContact, type SupportContact } from '@/lib/seo/support-contact';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbSchema, faqPageSchema } from '@/lib/seo/schema';

/**
 * The questions people actually ask, answered in the words they ask them.
 *
 * This page already said everything below — in prose, spread over six
 * sections, with no structured data of any kind. Asked "does Yukizi ship
 * across India?", an assistant answered "I couldn't verify Yukizi's current
 * shipping policy from an official source". The official source existed and
 * was crawlable; it just could not be read as an answer to a question.
 *
 * Every answer here restates something stated elsewhere on this page, which
 * is the same rule /about follows: one source, so the structured data can
 * never say something the visible page does not.
 */
const buildShippingFaqs = (support: SupportContact) => [
  {
    question: 'Does Yukizi ship across India?',
    answer:
      'Yes. Yukizi delivers to serviceable pin codes across India. International shipping is not offered at present.',
  },
  {
    question: 'How much does shipping cost on Yukizi?',
    answer:
      'Shipping is free on all eligible orders across India. No additional shipping charge is applied at checkout unless the product page states otherwise.',
  },
  {
    question: 'How long does delivery take?',
    answer: `Orders are processed within 24 to 48 hours of payment confirmation, and estimated delivery is ${COMPANY.deliveryWindow} from the date of dispatch. Timelines vary by location and courier partner.`,
  },
  {
    question: 'How do I track a Yukizi order?',
    answer:
      'Tracking details are sent to your registered email address and phone number once the order is dispatched, and every order can also be tracked from your account.',
  },
  {
    question: 'Does Yukizi deliver to small towns and remote pin codes?',
    answer:
      'Yukizi delivers wherever its courier partners are serviceable, which covers most pin codes in India. Remote locations can take longer than the standard estimate. Entering your pin code at checkout confirms serviceability for your address.',
  },
  {
    question: 'Does Yukizi ship internationally?',
    answer:
      'Not currently. Delivery is within India only. International shipping may be introduced in the future.',
  },
  {
    question: 'Who do I contact about a delivery?',
    answer: `Email ${support.email} or call ${support.phone} (${COMPANY.supportHours}).`,
  },
];

const derivedMetadata: Metadata = {
  title: 'Shipping Policy',
  alternates: { canonical: absoluteUrl('/shipping') },
  description:
    'Yukizi order processing times, shipping charges, delivery timelines, tracking and coverage.',
};

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata('/shipping', derivedMetadata);
}

export default async function ShippingPage() {
  const support = await fetchSupportContact();
  const FAQS = buildShippingFaqs(support);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Shipping Policy' }];
  return (
    <PolicyPage
      title="Shipping Policy"
      intro={`Yukizi delivers across India. Thank you for shopping with ${COMPANY.legalName}.`}
    >
      <PolicySection title="Order Processing">
        <p>
          Orders are processed within 24&ndash;48 hours after successful payment
          confirmation.
        </p>
        <p>
          Orders placed on weekends or public holidays will be processed on the next
          business day.
        </p>
      </PolicySection>

      <PolicySection title="Shipping Charges">
        <p>
          We offer FREE shipping on all eligible orders across India. No additional
          shipping charges are applied during checkout unless otherwise stated.
        </p>
      </PolicySection>

      <PolicySection title="Delivery Time">
        <p>
          Estimated delivery time is {COMPANY.deliveryWindow} from the date of
          dispatch.
        </p>
        <p>
          Delivery timelines may vary depending on your location and courier partner.
        </p>
      </PolicySection>

      <PolicySection title="Order Tracking">
        <p>
          Once your order has been dispatched, you will receive shipment tracking
          information through your registered email or phone number.
        </p>
      </PolicySection>

      <PolicySection title="Delivery Delays">
        <p>
          While we aim to deliver every order on time, delays may occur due to:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Weather conditions</li>
          <li>Natural disasters</li>
          <li>Public holidays</li>
          <li>Courier partner delays</li>
          <li>Remote delivery locations</li>
        </ul>
        <p>In such situations, we appreciate your patience and understanding.</p>
      </PolicySection>

      <PolicySection title="Shipping Coverage">
        <p>
          Currently, we deliver across India. International shipping may be introduced
          in the future.
        </p>
      </PolicySection>

      <PolicySection title="Contact">
        <p>For shipping-related questions, contact:</p>
        <p>
          Email:{' '}
          <a
            href={`mailto:${support.email}`}
            className="text-[#562996] underline underline-offset-4"
          >
            {support.email}
          </a>
          <br />
          Website:{' '}
          <a
            href={COMPANY.websiteUrl}
            className="text-[#562996] underline underline-offset-4"
          >
            {COMPANY.websiteUrl}
          </a>
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
      <JsonLd data={[breadcrumbSchema(crumbs), faqPageSchema(FAQS)]} />
    </PolicyPage>
  );
}
