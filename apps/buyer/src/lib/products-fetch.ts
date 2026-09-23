import { getProducts } from '@yukizi/api-client';

/**
 * Product fetching for storefront grids: retried, and never a quiet failure.
 *
 * getProducts() does not reject. It swallows its error and resolves to
 * { data: [], failed: true }, which silently defeats the invariant
 * server-cache.ts is built on — "unstable_cache stores FULFILLED results only.
 * A rejected promise is never cached". A failure *is* a fulfilled value, so one
 * lost request was stored and replayed to every visitor for the rest of the
 * 120s window, and every grid that treats `failed` as fatal rendered
 * "Something went wrong" for two solid minutes off a single blip. The
 * collections hubs hit the same class of bug on 2026-09-16 and worked around it
 * by skipping the cache entirely.
 *
 * So: retry a few times, then reject. Rejecting restores the documented
 * invariant — nothing bad is cached, and the next request gets a fresh attempt
 * instead of inheriting a poisoned entry.
 *
 * The delays are deliberately short. A page render cannot wait the way sitemap
 * generation can (lib/seo/product-fetch.ts backs off for 30s), and the common
 * failure is a burst 429 from the 300-req/min per-IP throttle — server renders
 * all egress from a handful of Vercel addresses, so one busy minute is enough.
 */
const RETRY_DELAYS_MS = [250, 750];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchProductsOrThrow(
  params?: Parameters<typeof getProducts>[0],
  label = 'storefront',
): Promise<Awaited<ReturnType<typeof getProducts>>> {
  for (let attempt = 0; ; attempt++) {
    const res = await getProducts(params);
    if (!(res as any)?.failed) return res;
    if (attempt >= RETRY_DELAYS_MS.length) {
      throw new Error(
        `[${label}] products fetch failed after ${attempt + 1} attempts`,
      );
    }
    console.warn(
      `[${label}] products fetch failed; retrying in ${RETRY_DELAYS_MS[attempt]}ms`,
    );
    await sleep(RETRY_DELAYS_MS[attempt]);
  }
}
