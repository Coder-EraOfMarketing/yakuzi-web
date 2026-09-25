/**
 * Whether a product actually names a manufacturer.
 *
 * Deliberately dependency-free. `lib/seo/schema.ts` is imported by a client
 * component (`app/blogs/[slug]/BlogPostClient.tsx`), so anything it reaches
 * must not drag the catalogue fetcher and the API client into that bundle.
 */

/** Values that occupy the manufacturer field without naming a manufacturer. */
const NON_BRANDS = new Set([
  'unknown', 'n/a', 'na', 'none', 'nil', 'other', 'others',
  'generic', 'unbranded', 'test', 'testing', '-', '--',
]);

/**
 * The manufacturer if there is one, otherwise nothing.
 *
 * "Unknown" is what the seller form leaves behind when nobody fills the field
 * in, and it sits on 77 of the 85 live products. `brand` is a primary matching
 * key in Google's product understanding, so publishing
 * `"brand": { "name": "Unknown" }` is strictly worse than publishing no brand:
 * an absent field is an open question, while "Unknown" is a confident
 * assertion about a brand that does not exist. The schema builder used a plain
 * truthiness check, and "Unknown" is truthy, so nine pages in ten claimed it.
 */
export function realManufacturer(value?: string | null): string | undefined {
  const trimmed = (value ?? '').trim();
  if (!trimmed || NON_BRANDS.has(trimmed.toLowerCase())) return undefined;
  return trimmed;
}
