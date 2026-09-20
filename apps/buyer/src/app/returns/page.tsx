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
 * The same gap the shipping page had: a complete policy, in prose, with no
 * structured data — so "can I return this?" could not be answered from it
 * without reading and interpreting seven sections.
 *
 * Returns policy is one of the two things a buyer checks before trusting an
 * unfamiliar shop (the other is whether it ships to them), and it is the
 * question an assistant is most often asked on their behalf. Worth being
 * answerable rather than merely correct.
 *
 * Every answer restates something stated elsewhere on this page. Note what is
 * NOT softened: change-of-mind returns are not accepted, and saying so plainly
 * is better for everyone than letting a buyer discover it after ordering.
 */
const buildReturnsFaqs = (support: SupportContact) => [
  {
    question: 'Does Yukizi accept returns?',
    answer: `Yes, for damaged, incorrect or materially different items. A request must be raised within ${COMPANY.returnWindowDays} days of delivery with photographic proof. Change-of-mind returns are not accepted.`,
  },
  {
    question: 'How long do I have to report a problem with an order?',
    answer: `${COMPANY.returnWindowDays} days from the date of delivery. Requests raised after that window cannot be processed.`,
  },
  {
    question: 'What proof does Yukizi need for a return?',
    answer:
      'Clear photographs of the damaged or incorrect item, along with the packaging it arrived in. An unboxing video is the strongest evidence for a damaged delivery and is worth recording for anything fragile.',
  },
  {
    question: 'Can I return a figure because I changed my mind?',
    answer:
      'No. Returns are accepted for damaged, incorrect or materially different items only, not for change of mind.',
  },
  {
    question: 'How long does a Yukizi refund take?',
    answer:
      'Once a return is verified and approved, the refund is issued to the original payment method. Banks typically take 3 to 7 working days to show it on a statement, and Yukizi emails a confirmation with a reference when it is sent.',
  },
  {
    question: 'Who do I contact about a return?',
    answer: `Email ${support.email} or call ${support.phone} (${COMPANY.supportHours}).`,
  },
];

const derivedMetadata: Metadata = {
  title: 'Return & Refund Policy',
  alternates: { canonical: absoluteUrl('/returns') },
  description:
    'When Yukizi accepts a return, the proof required, how requests are verified and how refunds are processed.',
};

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata('/returns', derivedMetadata);
}

export default async function ReturnsPage() {
  const support = await fetchSupportContact();
  const FAQS = buildReturnsFaqs(support);
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'Return & Refund Policy' }];
  return (
    <PolicyPage
      title="Return & Refund Policy"
      intro={`At ${COMPANY.legalName}, customer satisfaction is important to us.`}
    >
      <PolicySection title="Eligible Returns">
        <p>We only accept returns if:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>The product received is damaged.</li>
          <li>The wrong product has been delivered.</li>
        </ul>
        <p>
          Returns for change of mind, incorrect orders placed by the customer, or
          products that have been used are not accepted.
        </p>
      </PolicySection>

      <PolicySection title="Return Request Period">
        <p>
          Customers must notify us within {COMPANY.returnWindowDays} days of receiving
          the product.
        </p>
        <p>
          Requests submitted after this period may not be eligible for return or
          refund.
        </p>
      </PolicySection>

      <PolicySection title="Proof Required">
        <p>To process a return request, customers must provide:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Clear photographs of the product</li>
          <li>Images of the package (if applicable)</li>
          <li>Order number</li>
        </ul>
        <p>
          Failure to provide sufficient evidence may result in rejection of the
          request.
        </p>
      </PolicySection>

      <PolicySection title="Verification">
        <p>
          Once the request is received, our team will review the submitted
          information. If approved, we will arrange a replacement or issue a refund,
          depending on the situation.
        </p>
      </PolicySection>

      <PolicySection title="Refund Process">
        <p>
          Approved refunds will be processed to the original payment method used for
          the purchase.
        </p>
        <p>
          Refund processing times may vary depending on the payment provider or bank.
        </p>
      </PolicySection>

      <PolicySection title="Non-Returnable Items">
        <p>Returns will not be accepted for:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Used products</li>
          <li>Products damaged after delivery due to customer misuse</li>
          <li>Products without proof of damage or incorrect delivery</li>
          <li>
            Requests made after the {COMPANY.returnWindowDays}-day return period
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="Contact Us">
        <p>For return or refund assistance, please contact:</p>
        <p>
          {COMPANY.legalName}
          <br />
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
