import { cache } from 'react';
import { fetchAllProducts, isBuildPhase } from './product-fetch';

/**
 * One catalogue read, shared by every hub page.
 *
 * The hub pages generate several hundred URLs and each one needs the WHOLE
 * catalogue to decide its own membership (a Nezuko page cannot know what it
 * contains without looking at everything). Done naively that is one full
 * catalogue walk per page per revalidation window, which turns a crawler
 * sweeping the sitemap into a self-inflicted load test on the API — exactly
 * the failure `product-fetch.ts` already documents being throttled by.
 *
 * Two layers of sharing prevent that:
 *
 *  1. `cache()` from React dedupes within a single request/render pass.
 *  2. A module-level TTL memo shares across requests on the same server
 *     instance, which is what actually absorbs a crawl.
 *
 * Why a plain module memo and not `unstable_cache`: the collections hub was
 * shipped with `unstable_cache` and on Next 14.2.0 an EMPTY result cached
 * during the build was never refreshed at runtime, so every hub went live
 * with a permanently empty grid (observed 2026-09-16, see the note in
 * app/collections/[slug]/page.tsx). A module memo cannot reproduce that:
 * the build and the server are different processes, so nothing a build
 * computes can poison a running server, and the guard below refuses to store
 * a failed read in the first place.
 */

export interface CatalogProduct {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  price?: number | null;
  mrp?: number | null;
  stock?: number;
  image?: string | null;
  images?: unknown;
  manufacturer?: string | null;
  isActive?: boolean;
  hasSellers?: boolean;
  sellerCount?: number;
  createdAt?: string;
  updatedAt?: string;
  category?: { id?: string; name?: string; slug?: string } | null;
  subCategory?: { id?: string; name?: string; slug?: string } | null;
}

/** Raised when a read a hub page cannot render without has failed. */
export class CatalogUnavailableError extends Error {
  constructor(label: string, cause?: unknown) {
    super(`[seo/catalog] catalogue unavailable for ${label}`);
    this.name = 'CatalogUnavailableError';
    this.cause = cause;
  }
}

/** How long a successful catalogue read is reused across requests. */
const TTL_MS = 5 * 60 * 1000;

let memo: { at: number; products: CatalogProduct[] } | null = null;
/** In-flight read, so a burst of concurrent requests makes ONE API walk. */
let inflight: Promise<CatalogProduct[]> | null = null;

async function readCatalog(): Promise<CatalogProduct[]> {
  const { products, failed } = await fetchAllProducts('seo/catalog');

  // A failed read is never memoised. Caching it would turn one throttled
  // request into five minutes of every hub page believing the shop is empty,
  // which is the soft-404 these pages exist to avoid.
  if (failed) throw new CatalogUnavailableError('product list');

  memo = { at: Date.now(), products: products as CatalogProduct[] };
  return memo.products;
}

/**
 * The whole catalogue, deduped per request and shared across requests.
 *
 * Throws on failure rather than returning `[]`. That is the important
 * decision and it matches PharmaBag's `strict` reads: a hub page resolves its
 * own membership from this list, so an empty list on a transient API blip
 * would make the page conclude the hub has no products and render a thin,
 * cacheable, confidently-wrong 200. Google drops soft-404s from the index and
 * retries 500s, so throwing is strictly better than degrading.
 */
export const getCatalog = cache(async (): Promise<CatalogProduct[]> => {
  if (memo && Date.now() - memo.at < TTL_MS) return memo.products;

  // Collapse concurrent misses onto one walk.
  if (!inflight) {
    inflight = readCatalog().finally(() => {
      inflight = null;
    });
  }

  try {
    return await inflight;
  } catch (error) {
    // Serve stale rather than 500 when we have something. A five-minute-old
    // product list is a far better answer to a crawler than an error page,
    // and staleness here only affects which products a hub lists.
    if (memo) return memo.products;
    throw error;
  }
});

/**
 * Products that belong in a public listing.
 *
 * `isActive === false` is a seller deactivating a listing. `undefined` means
 * the grid endpoint did not send the field, which is not the same as false —
 * treating it as false silently emptied every hub the first time this was
 * written the other way round.
 */
export function listable(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter((p) => p.isActive !== false && !!(p.slug || p.id));
}

/** Newest `updatedAt` in a set — a hub page's own freshness for JSON-LD. */
export function latestUpdate(products: CatalogProduct[]): string | undefined {
  let newest: number | undefined;
  for (const p of products) {
    const t = p.updatedAt ? Date.parse(p.updatedAt) : NaN;
    if (!Number.isNaN(t) && (newest === undefined || t > newest)) newest = t;
  }
  return newest === undefined ? undefined : new Date(newest).toISOString();
}

export { isBuildPhase };
