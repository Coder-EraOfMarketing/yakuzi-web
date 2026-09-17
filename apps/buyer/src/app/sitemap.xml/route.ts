import { renderSitemapIndex, xmlResponse, PRODUCTS_PER_SITEMAP } from '@/lib/seo/sitemap';
import { getCatalog, listable } from '@/lib/seo/catalog';

/**
 * The sitemap INDEX.
 *
 * Replaces the previous single flat `app/sitemap.ts`, which published 116
 * URLs in one document. That was the right shape for 116 URLs and the wrong
 * one for the ~700 this site now has across eight unrelated families: a flat
 * file gives Search Console nothing to attribute an indexing problem to.
 *
 * Children are listed unconditionally, including ones that may currently be
 * sparse. A child that 404s would be a broken reference; a child that returns
 * a small urlset is simply a small family, which is information rather than
 * an error.
 */
export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const now = new Date();

  // Product chunk count is derived from the real catalogue size so the index
  // never advertises a chunk that has nothing in it, and never omits one that
  // does. Failing open to a single chunk is correct: the chunk route itself
  // 404s if it is genuinely empty, and one dangling reference is a far
  // cheaper failure than an index that silently drops 5,000 product URLs.
  let productChunks = 1;
  try {
    const total = listable(await getCatalog()).length;
    productChunks = Math.max(1, Math.ceil(total / PRODUCTS_PER_SITEMAP));
  } catch {
    productChunks = 1;
  }

  const children = [
    'static',
    'series',
    'characters',
    'formats',
    'series-formats',
    'prices',
    'locations',
    'collections',
    'categories',
    'blogs',
  ].map((name) => ({ path: `/sitemaps/${name}.xml`, lastModified: now }));

  for (let i = 0; i < productChunks; i++) {
    children.push({ path: `/sitemaps/products-${i}.xml`, lastModified: now });
  }

  // The image sitemap predates this index and lives at its own path. Listed
  // here so there is one entry point a crawler has to find, not two.
  children.push({ path: '/image-sitemap.xml', lastModified: now });

  return xmlResponse(renderSitemapIndex(children));
}
