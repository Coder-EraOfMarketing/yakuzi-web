import { PRODUCT_TYPES } from '@/lib/seo/data/product-types';
import { SERIES } from '@/lib/seo/data/series';
import { selectProducts, typeMatcher, seriesMatcher, priceRange } from '@/lib/seo/hub';
import { inr } from '@/lib/seo/content';
import type { CatalogProduct } from '@/lib/seo/catalog';

/**
 * Live price tables for the `anime-figure-prices-in-india` guide.
 *
 * This is the one place in the guide family where the content is generated
 * rather than written, and it exists because a price guide written by hand
 * starts going stale the day it ships. Every number here is recomputed from
 * the live catalogue on revalidation, which means the page can state
 * checkable current figures — the property that makes a data page quotable
 * rather than merely readable.
 *
 * Median rather than mean, deliberately. One ₹15,000 prop replica in a
 * category of eight would drag a mean well above anything actually on sale
 * there, and a reader comparing that number against the grid would conclude
 * the page was wrong. The median answers the question people are really
 * asking, which is "what does one of these normally cost".
 */

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function pricesOf(products: CatalogProduct[]): number[] {
  return products
    .map((p) => {
      const raw = p.price ?? p.mrp;
      const n = typeof raw === 'string' ? Number(raw) : raw;
      return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : null;
    })
    .filter((n): n is number => n != null);
}

function Table({
  caption,
  head,
  rows,
}: {
  caption: string;
  head: [string, string, string, string];
  rows: Array<[string, string, string, string]>;
}) {
  if (!rows.length) return null;
  return (
    <figure className="mt-6">
      <figcaption className="mb-2 text-sm font-semibold text-gray-800">
        {caption}
      </figcaption>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50">
              {head.map((h, i) => (
                <th
                  key={h}
                  scope="col"
                  className={`px-4 py-2.5 font-medium text-gray-600 ${i === 0 ? 'text-left' : 'text-right'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r[0]} className="border-t border-gray-100">
                {r.map((cell, i) => (
                  <td
                    key={i}
                    className={`px-4 py-2.5 ${i === 0 ? 'text-left font-medium text-gray-900' : 'text-right text-gray-700'}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

export default function GuidePriceTable({
  catalog,
}: {
  catalog: CatalogProduct[];
}) {
  const byFormat = PRODUCT_TYPES.map((def) => {
    const members = selectProducts(catalog, typeMatcher(def));
    const prices = pricesOf(members);
    const range = priceRange(members);
    return { def, count: members.length, med: median(prices), range };
  })
    .filter((r) => r.count > 0 && r.med != null)
    .sort((a, b) => (a.med as number) - (b.med as number));

  const bySeries = SERIES.map((def) => {
    const members = selectProducts(catalog, seriesMatcher(def));
    const prices = pricesOf(members);
    const range = priceRange(members);
    return { def, count: members.length, med: median(prices), range };
  })
    .filter((r) => r.count >= 2 && r.med != null)
    .sort((a, b) => b.count - a.count);

  return (
    <section aria-label="Live price tables" className="mt-2">
      <Table
        caption="Price by format — live from the Yukizi catalogue"
        head={['Format', 'Listed', 'Typical (median)', 'Range']}
        rows={byFormat.map((r) => [
          r.def.name,
          String(r.count),
          inr(r.med as number),
          r.range
            ? r.range.min === r.range.max
              ? inr(r.range.min)
              : `${inr(r.range.min)} – ${inr(r.range.max)}`
            : '—',
        ])}
      />

      <Table
        caption="Price by series — series with at least two listings"
        head={['Series', 'Listed', 'Typical (median)', 'Range']}
        rows={bySeries.map((r) => [
          r.def.name,
          String(r.count),
          inr(r.med as number),
          r.range
            ? r.range.min === r.range.max
              ? inr(r.range.min)
              : `${inr(r.range.min)} – ${inr(r.range.max)}`
            : '—',
        ])}
      />

      <p className="mt-3 px-1 text-xs text-gray-500">
        Generated from the live catalogue. Typical is the median listed price,
        not the mean — a single expensive piece should not move the number a
        reader is trying to plan around. Prices are set by individual verified
        sellers and change with stock and discounts.
      </p>
    </section>
  );
}
