import { getCategoriesResult } from '@yukizi/api-client';
import type { Category } from '@yukizi/api-client';

/**
 * Category fetching for the category routes: retried, and never a quiet failure.
 *
 * The exact bug fetchProductsOrThrow exists to prevent, on a different fetch.
 * getCategories() does not reject — it swallows its error and resolves to `[]`,
 * a FULFILLED value, which defeats the invariant server-cache.ts is built on
 * ("unstable_cache stores FULFILLED results only. A rejected promise is never
 * cached"). So one lost request was cached and replayed for the rest of the
 * 300s window.
 *
 * On the category routes that empty list is not cosmetic. `findCategory()`
 * finds nothing in it, the page calls notFound(), and generateMetadata's `!cat`
 * branch emits `robots: noindex` — so a single blip served a 404 + noindex for
 * EVERY category at once, for five minutes, on pages that exist and rank.
 * Google reads a 404 as "drop this URL" and a noindex as "stop ranking it";
 * a 5xx it simply retries. Rejecting is therefore both the correct failure
 * signal and the SEO-safe one.
 *
 * Delays match products-fetch.ts: a page render cannot wait long, and the
 * common failure is a burst 429 from the per-IP throttle, since server renders
 * egress from a handful of Vercel addresses.
 */
const RETRY_DELAYS_MS = [250, 750];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function fetchCategoriesOrThrow(
  label = 'storefront',
): Promise<Category[]> {
  for (let attempt = 0; ; attempt++) {
    const { categories, failed } = await getCategoriesResult();
    if (!failed) return categories;
    if (attempt >= RETRY_DELAYS_MS.length) {
      throw new Error(
        `[${label}] categories fetch failed after ${attempt + 1} attempts`,
      );
    }
    console.warn(
      `[${label}] categories fetch failed; retrying in ${RETRY_DELAYS_MS[attempt]}ms`,
    );
    await sleep(RETRY_DELAYS_MS[attempt]);
  }
}
