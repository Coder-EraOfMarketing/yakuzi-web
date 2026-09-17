/**
 * Every internal path in one place.
 *
 * The sitemaps, the JSON-LD, the link hub, the breadcrumbs and the page
 * components all build URLs from these helpers rather than from string
 * literals scattered across twenty files. That is not tidiness for its own
 * sake: a sitemap that lists `/anime/demon-slayer` while the link hub points
 * at `/series/demon-slayer` publishes two contradictory claims about which
 * URL is real, and the resulting 404s are charged against the whole domain's
 * crawl budget.
 */

export const routes = {
  home: () => '/',
  products: () => '/products',
  product: (slug: string) => `/products/${slug}`,

  // Existing surfaces, listed here so callers never hand-roll them.
  categories: () => '/products',
  category: (slug: string) => `/category/${slug}`,
  subCategory: (categorySlug: string, subSlug: string) =>
    `/category/${categorySlug}/${subSlug}`,
  collections: () => '/collections',
  collection: (slug: string) => `/collections/${slug}`,
  blogs: () => '/blogs',
  blog: (slug: string) => `/blogs/${slug}`,
  blogAuthor: (slug: string) => `/blogs/author/${slug}`,

  // The new facet axes.
  seriesIndex: () => '/anime',
  series: (slug: string) => `/anime/${slug}`,
  seriesType: (seriesSlug: string, typeSlug: string) =>
    `/anime/${seriesSlug}/${typeSlug}`,
  charactersIndex: () => '/characters',
  character: (slug: string) => `/characters/${slug}`,
  typesIndex: () => '/figures',
  type: (slug: string) => `/figures/${slug}`,
  pricesIndex: () => '/price',
  price: (slug: string) => `/price/${slug}`,
  /**
   * NOT `/brands/*`. The platform already has a "brands" concept — the
   * franchise hero tiles from `GET /brands` — and giving manufacturers that
   * namespace would mean two meanings of "brand" fighting over one URL space
   * the moment those tiles become clickable. See data/manufacturers.ts.
   */
  manufacturersIndex: () => '/manufacturers',
  manufacturer: (slug: string) => `/manufacturers/${slug}`,
  guidesIndex: () => '/guides',
  guide: (slug: string) => `/guides/${slug}`,
  giftsIndex: () => '/gifts',
  gift: (slug: string) => `/gifts/${slug}`,
  storesIndex: () => '/anime-store',
  state: (slug: string) => `/anime-store/${slug}`,
  city: (stateSlug: string, citySlug: string) =>
    `/anime-store/${stateSlug}/${citySlug}`,

  // Static.
  about: () => '/about',
  contact: () => '/contact',
  storeIndia: () => '/collectibles-store-india',
  shipping: () => '/shipping',
  returns: () => '/returns',
  privacy: () => '/privacy',
  terms: () => '/terms',
  cookiePolicy: () => '/cookie-policy',
};

/**
 * Turns a free-text facet name into a URL segment.
 *
 * Kept deliberately lossy and idempotent: accents are stripped, everything
 * non-alphanumeric collapses to a single hyphen, and running it twice yields
 * the same answer. "Pokémon" and "Pokemon" must resolve to one slug or the
 * two spellings become two competing pages for one entity.
 */
export function facetSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
