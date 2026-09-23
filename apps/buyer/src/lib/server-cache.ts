import { unstable_cache } from 'next/cache';
import {
  getProducts,
  getBanners,
  getComingSoonStatus,
  getHomepageSections,
  getCategories,
} from '@yukizi/api-client';
import { fetchProductsOrThrow } from './products-fetch';

// Cross-request TTL caches for the anonymous storefront's server fetches.
//
// The homepage, /products and /category/[slug] all read searchParams (the
// navbar search lands on `/?search=`, the listing filters are URL-driven), so
// Next renders them dynamically on every request and the CDN cannot cache the
// HTML the way it does the PDP. But the underlying API data is identical for
// every visitor, so caching it here cuts the per-request render cost from
// several API round trips to near zero once warm.
//
// Safety properties, all load-bearing — keep them:
// - unstable_cache stores FULFILLED results only. A rejected promise is never
//   cached, so during an API outage every request still sees the error and the
//   call sites' existing try/catch behaviour is byte-identical to today.
//   For the same reason the call-site `.catch()`s must stay OUTSIDE these
//   wrappers — moving a catch inside would cache the empty fallback.
//   getProducts defeated this on its own: it never rejects, it resolves to
//   { data: [], failed: true }, so a failure was a fulfilled value and was
//   cached like any other — one lost request, then two minutes of
//   "Something went wrong" for everyone. fetchProductsOrThrow restores the
//   invariant by retrying and then genuinely rejecting.
// - The serialized arguments are part of the cache key, so every distinct
//   filter/search combination caches separately and can never bleed into
//   another URL's results.
// - getComingSoonStatus fails OPEN inside the api-client (returns false on
//   error rather than throwing) — cached or not, an unreachable API degrades
//   to the thin storefront, never to the splash. The short TTL below bounds
//   how long an admin's coming-soon toggle takes to appear.

export const getProductsCached = unstable_cache(
  (params: Parameters<typeof getProducts>[0]) =>
    fetchProductsOrThrow(params, 'storefront:getProducts'),
  ['storefront:getProducts'],
  { revalidate: 120 },
);

export const getBannersCached = unstable_cache(
  () => getBanners(),
  ['storefront:getBanners'],
  { revalidate: 120 },
);

export const getHomepageSectionsCached = unstable_cache(
  () => getHomepageSections(),
  ['storefront:getHomepageSections'],
  { revalidate: 120 },
);

export const getComingSoonStatusCached = unstable_cache(
  () => getComingSoonStatus(),
  ['storefront:getComingSoonStatus'],
  { revalidate: 60 },
);

export const getCategoriesCachedShared = unstable_cache(
  () => getCategories(),
  ['storefront:getCategories'],
  { revalidate: 300 },
);
