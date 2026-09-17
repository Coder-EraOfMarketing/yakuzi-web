import Link from 'next/link';
import HomeNavbar from '@/components/landing/HomeNavbar';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import SeoFaq from '@/components/seo/SeoFaq';
import type { BreadcrumbItem } from '@/lib/seo/schema';
import type { GuideDef } from '@/lib/seo/data/guides';

/**
 * The guide renderer.
 *
 * Reuses the navbar, breadcrumb and FAQ components the hub pages already use,
 * so a guide introduces no new visual language — but the body is prose rather
 * than a product grid, and that changes two things structurally.
 *
 * First, the answer block. It is rendered immediately after the H1, visually
 * distinct, and written to stand alone: this is the passage an AI Overview or
 * a Perplexity answer will lift, and giving it a fixed, predictable position
 * at the top of every guide is the single most useful thing the template can
 * do for extraction.
 *
 * Second, heading levels. Sections are h2 and nothing nests deeper, because a
 * flat h2 sequence under one h1 is unambiguous to parse. Tables get a real
 * `<figcaption>` and `<th scope>` so a row is attributable to its header
 * rather than being a grid of loose strings.
 */

export interface GuidePageProps {
  guide: GuideDef;
  crumbs: BreadcrumbItem[];
  categoryLabel: string;
  /** Rendered between the answer and the first section. */
  dataBlock?: React.ReactNode;
  linkGroups?: Array<{
    title: string;
    links: Array<{ label: string; href: string }>;
  }>;
  jsonLd: object[];
}

/** Human-readable review date. Fixed locale so SSR and client agree. */
function formatUpdated(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export default function GuidePage({
  guide,
  crumbs,
  categoryLabel,
  dataBlock,
  linkGroups = [],
  jsonLd,
}: GuidePageProps) {
  const updated = formatUpdated(guide.updated);

  return (
    <main className="w-full min-h-screen relative pb-[var(--nav-clearance,150px)]">
      <JsonLd data={jsonLd} />
      <HomeNavbar />

      <div className="mx-auto w-full max-w-3xl px-4 pt-6 sm:pt-10">
        <Breadcrumbs items={crumbs} className="mb-3" />

        <p className="text-xs font-semibold uppercase tracking-wide text-[#854cbc]">
          {categoryLabel}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-4xl">
          {guide.h1}
        </h1>
        {updated && (
          <p className="mt-2 text-xs text-gray-500">
            Last reviewed{' '}
            <time dateTime={guide.updated}>{updated}</time>
          </p>
        )}

        {/* The quotable answer. Deliberately the first content on the page and
            deliberately set apart, because this is what gets extracted. */}
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-sm leading-relaxed text-gray-800 sm:text-base">
            {guide.answer}
          </p>
        </div>

        {dataBlock}

        <article className="mt-8 flex flex-col gap-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                {section.heading}
              </h2>

              {section.paras?.map((para, i) => (
                <p
                  key={i}
                  className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base"
                >
                  {para}
                </p>
              ))}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="mt-3 flex flex-col gap-2">
                  {section.bullets.map((b, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm leading-relaxed text-gray-600 sm:text-base"
                    >
                      <span aria-hidden="true" className="mt-[2px] text-[#854cbc]">
                        &bull;
                      </span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.table && (
                <figure className="mt-4">
                  {section.table.caption && (
                    <figcaption className="mb-2 text-xs text-gray-500">
                      {section.table.caption}
                    </figcaption>
                  )}
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full border-collapse text-sm">
                      {section.table.head && (
                        <thead>
                          <tr className="bg-gray-50">
                            {section.table.head.map((h) => (
                              <th
                                key={h}
                                scope="col"
                                className="px-4 py-2.5 text-left font-medium text-gray-600"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row.label} className="border-t border-gray-100">
                            <th
                              scope="row"
                              className="w-[45%] px-4 py-2.5 text-left align-top font-medium text-gray-900"
                            >
                              {row.label}
                            </th>
                            <td className="px-4 py-2.5 align-top text-gray-700">
                              {row.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </figure>
              )}
            </section>
          ))}
        </article>

        <SeoFaq
          faqs={guide.faqs}
          title={`${guide.h1} — frequently asked questions`}
        />

        {linkGroups
          .filter((g) => g.links.length > 0)
          .map((group) => (
            <nav key={group.title} aria-label={group.title} className="pb-8">
              <h2 className="mb-3 text-base font-semibold text-gray-800">
                {group.title}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-block rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-gray-700 transition-colors hover:border-[#854cbc] hover:text-[#854cbc]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
      </div>
    </main>
  );
}
