import type { CatalogProduct } from './catalog';
import { SERIES, seriesPattern, type SeriesDef } from './data/series';
import {
  CHARACTERS,
  characterPattern,
  charactersOfSeries,
  type CharacterDef,
} from './data/characters';
import { PRODUCT_TYPES, type ProductTypeDef } from './data/product-types';
import { PRICE_BANDS, type PriceBandDef } from './data/price-bands';
import { GIFT_OCCASIONS, type GiftOccasionDef } from './data/gift-occasions';
import {
  MANUFACTURERS,
  manufacturerPattern,
  manufacturerFieldNames,
  type ManufacturerDef,
} from './data/manufacturers';

/**
 * The matching engine every facet hub shares.
 *
 * One engine rather than five is the point. A series page, a character page,
 * a type page and a series x type page differ only in which predicate decides
 * membership; everything downstream — sorting, thinness checks, counts, the
 * "which hubs does this product belong to" reverse lookup — is identical. Five
 * copies of that logic is five places for a hub to start disagreeing with the
 * sitemap about what it contains.
 *
 * Matching is done on TEXT, not on a structured field, because the catalogue
 * has no structured field to match on: `manufacturer` is "Unknown" on 75 of
 * 83 live products and there is no series or character column at all. The
 * product NAME, however, is written by sellers who want it found, so it
 * reliably says "Demon Slayer" and "Nezuko". That makes text the honest
 * source here — with the hard rule, inherited from data/collections.ts, that
 * matching is always word-boundary anchored and never substring.
 */

/**
 * How many products a hub renders in its grid.
 *
 * Bounded so a place or price hub cannot grow into a 5,000-card document as
 * the catalogue does — that would be slow for buyers and worse for crawlers,
 * which budget by bytes as well as by URLs. Whenever the cap bites, the page
 * says so out loud and links to the full catalogue (see HubPage's `total`),
 * because a silent truncation reads as "this is everything" when it is not.
 */
export const HUB_GRID_LIMIT = 60;

/** Everything a hub needs to decide membership. */
export interface HubMatcher {
  /** Regex source, case-insensitive. Absent means "no text predicate". */
  pattern?: string;
  /** A second pattern that must ALSO match — used by series x type crosses. */
  andPattern?: string;
  /**
   * A pattern that must NOT match. Vetoes membership outright.
   *
   * Needed because the sub-category signal is sometimes wrong in a way the
   * text signal can see. A 1:1 Iron Man helmet filed by its seller under a
   * sub-category called "Comics" satisfies the manga-comics predicate through
   * no fault of the predicate — the platform really does say it is in Comics.
   * Rather than override the platform taxonomy wholesale, a type can declare
   * the formats it is definitionally not, and the veto resolves the conflict.
   *
   * Use sparingly and only where the two signals genuinely contradict. This
   * is not a general-purpose exclusion list — `exclude` handles known bad
   * slugs, and a seller re-filing the product is the real fix.
   */
  notPattern?: string;
  /** Product slugs the patterns catch wrongly. */
  exclude?: string[];
  /** Inclusive lower price bound in rupees. */
  minPrice?: number;
  /** Exclusive upper price bound in rupees. */
  maxPrice?: number;
  /** Platform category slug the product must sit in. */
  categorySlug?: string;
  /** Any one of these platform sub-category slugs satisfies membership. */
  subCategorySlugs?: string[];
  /**
   * Values that satisfy membership when found in the product's `manufacturer`
   * FIELD, lowercased.
   *
   * A set test rather than a regex, because the field is a form value and not
   * prose: "Bandai" must not match a product whose manufacturer reads
   * "Bandai Namco Filmworks" only by accident of substring, and equally must
   * not need a word-boundary dance to match "bandai". Membership is exact
   * after trim-and-lowercase, with aliases listed explicitly.
   */
  manufacturerFieldNames?: string[];
}

/**
 * The text a product is matched against.
 *
 * Slug hyphens become spaces so `\bdemon slayer\b` fires on
 * "demon-slayer-akaza-end-scene". Category and sub-category names are folded
 * in so a product named only "Nelliel Tu" still matches the Figurines type
 * predicates. The pipes are separators that cannot be crossed by a `\b`
 * anchor, which stops a pattern matching across two unrelated fields.
 */
export function matchText(p: CatalogProduct): string {
  return [
    p.name ?? '',
    (p.slug ?? '').replace(/-/g, ' '),
    p.description ?? '',
    p.manufacturer ?? '',
    p.category?.name ?? '',
    p.subCategory?.name ?? '',
  ]
    .join(' | ')
    .toLowerCase();
}

function priceOf(p: CatalogProduct): number | null {
  const raw = p.price ?? p.mrp;
  const n = typeof raw === 'string' ? Number(raw) : raw;
  return typeof n === 'number' && Number.isFinite(n) && n > 0 ? n : null;
}

export function inStock(p: CatalogProduct): boolean {
  return (p.stock ?? 0) > 0;
}

/**
 * Display order for a hub grid.
 *
 * In-stock first, because a landing page whose first row is unbuyable wastes
 * the click it worked to earn. Then most-recently-updated, which is both a
 * useful freshness proxy and — unlike a random or a relevance sort — stable
 * between renders, so the CDN-cached HTML and the JSON-LD ItemList cannot
 * disagree about position.
 */
export function hubSort(products: CatalogProduct[]): CatalogProduct[] {
  return [...products].sort((a, b) => {
    const stock = Number(inStock(b)) - Number(inStock(a));
    if (stock !== 0) return stock;
    const ta = a.updatedAt ? Date.parse(a.updatedAt) : 0;
    const tb = b.updatedAt ? Date.parse(b.updatedAt) : 0;
    return (Number.isNaN(tb) ? 0 : tb) - (Number.isNaN(ta) ? 0 : ta);
  });
}

/** Applies a matcher to the catalogue and returns the members, sorted. */
export function selectProducts(
  products: CatalogProduct[],
  matcher: HubMatcher,
): CatalogProduct[] {
  const rx = matcher.pattern ? new RegExp(matcher.pattern, 'i') : null;
  const andRx = matcher.andPattern ? new RegExp(matcher.andPattern, 'i') : null;
  const notRx = matcher.notPattern ? new RegExp(matcher.notPattern, 'i') : null;
  const excluded = new Set(matcher.exclude ?? []);
  const subs = matcher.subCategorySlugs?.length
    ? new Set(matcher.subCategorySlugs)
    : null;
  const makers = matcher.manufacturerFieldNames?.length
    ? new Set(matcher.manufacturerFieldNames)
    : null;

  const hits = products.filter((p) => {
    const slug = p.slug ?? '';
    if (excluded.has(slug)) return false;

    if (matcher.categorySlug && p.category?.slug !== matcher.categorySlug) {
      return false;
    }

    // Text membership: the pattern, OR a platform sub-category that means the
    // same thing, OR an exact manufacturer-field value. Any one alone is
    // sufficient — sellers file products inconsistently, so requiring more
    // than one signal would drop real members.
    if (rx || subs || makers) {
      const byText = rx ? rx.test(matchText(p)) : false;
      const bySub = subs ? subs.has(p.subCategory?.slug ?? '') : false;
      const byMaker = makers
        ? makers.has((p.manufacturer ?? '').trim().toLowerCase())
        : false;
      if (!byText && !bySub && !byMaker) return false;
    }

    // The cross predicate is a genuine AND: /anime/demon-slayer/funko-pop
    // must be Demon Slayer *and* a Funko, never either.
    if (andRx && !andRx.test(matchText(p))) return false;

    // The veto runs last and beats every positive signal above, including a
    // sub-category match — which is the whole point of it.
    if (notRx && notRx.test(matchText(p))) return false;

    if (matcher.minPrice != null || matcher.maxPrice != null) {
      const price = priceOf(p);
      if (price == null) return false;
      if (matcher.minPrice != null && price < matcher.minPrice) return false;
      if (matcher.maxPrice != null && price >= matcher.maxPrice) return false;
    }

    return true;
  });

  return hubSort(hits);
}

// ─── Per-axis matcher builders ───────────────────────────────────────

/**
 * A series matches its own name OR any of its characters' names.
 *
 * Without the character union a figure named only "Nelliel Tu" never reaches
 * the Bleach hub, because the product name never says "Bleach". Sellers name
 * products after the character far more often than after the franchise, so
 * the union is not an optimisation — it is most of the recall.
 */
export function seriesMatcher(def: SeriesDef): HubMatcher {
  const characterAlternatives = charactersOfSeries(def.slug).map(characterPattern);
  const excludes = [
    ...(def.exclude ?? []),
    ...charactersOfSeries(def.slug).flatMap((c) => c.exclude ?? []),
  ];
  return {
    pattern: [seriesPattern(def), ...characterAlternatives].filter(Boolean).join('|'),
    exclude: excludes.length ? excludes : undefined,
  };
}

export function characterMatcher(def: CharacterDef): HubMatcher {
  return { pattern: characterPattern(def), exclude: def.exclude };
}

export function typeMatcher(def: ProductTypeDef): HubMatcher {
  return {
    pattern: def.match,
    subCategorySlugs: def.subCategorySlugs,
    exclude: def.exclude,
    notPattern: def.notMatch,
  };
}

/** Series AND type — the cross pages. */
export function seriesTypeMatcher(
  series: SeriesDef,
  type: ProductTypeDef,
): HubMatcher {
  const base = seriesMatcher(series);
  return {
    pattern: base.pattern,
    andPattern: type.match,
    exclude: [...(base.exclude ?? []), ...(type.exclude ?? [])],
  };
}

export function priceMatcher(def: PriceBandDef): HubMatcher {
  return { minPrice: def.min, maxPrice: def.max };
}

/**
 * A gift occasion is a price band and nothing else.
 *
 * Worth being explicit about, because it is the honest shape of the family:
 * the Diwali page and the Rakhi page draw on one catalogue, and what
 * distinguishes them is the budget bound plus the hand-written criteria on
 * the page. Inventing a per-occasion product filter would fabricate a
 * distinction that does not exist — see data/gift-occasions.ts.
 */
export function giftMatcher(def: GiftOccasionDef): HubMatcher {
  return { minPrice: def.minPrice, maxPrice: def.maxPrice };
}

/**
 * A manufacturer matches its `manufacturer` FIELD value or its name in text.
 *
 * The field is the signal that should carry this family and currently carries
 * almost nothing — see the module comment in data/manufacturers.ts. The text
 * signal is what makes the Funko page work today, because "Funko" is in the
 * product title even when the field says "Unknown".
 */
export function manufacturerMatcher(def: ManufacturerDef): HubMatcher {
  return {
    pattern: manufacturerPattern(def),
    manufacturerFieldNames: manufacturerFieldNames(def),
    exclude: def.exclude,
  };
}

export function subCategoryMatcher(
  categorySlug: string,
  subCategorySlug: string,
): HubMatcher {
  return { categorySlug, subCategorySlugs: [subCategorySlug] };
}

// ─── Counts, used by index pages, the link hub and the sitemaps ──────

export interface FacetCount<T> {
  def: T;
  count: number;
}

function countBy<T>(
  defs: T[],
  products: CatalogProduct[],
  toMatcher: (def: T) => HubMatcher,
): FacetCount<T>[] {
  return defs.map((def) => ({
    def,
    count: selectProducts(products, toMatcher(def)).length,
  }));
}

export const countSeries = (p: CatalogProduct[]) => countBy(SERIES, p, seriesMatcher);
export const countCharacters = (p: CatalogProduct[]) =>
  countBy(CHARACTERS, p, characterMatcher);
export const countTypes = (p: CatalogProduct[]) =>
  countBy(PRODUCT_TYPES, p, typeMatcher);
export const countPriceBands = (p: CatalogProduct[]) =>
  countBy(PRICE_BANDS, p, priceMatcher);
export const countManufacturers = (p: CatalogProduct[]) =>
  countBy(MANUFACTURERS, p, manufacturerMatcher);
export const countGiftOccasions = (p: CatalogProduct[]) =>
  countBy(GIFT_OCCASIONS, p, giftMatcher);

/**
 * Which hubs a single product belongs to.
 *
 * Powers the product page's "Explore" links, which is where the hub family
 * gets most of its internal linking: 83 product pages each pointing at their
 * own series, character and type hubs is a denser and more topically relevant
 * link graph than any footer can provide. PharmaBag's product pages carry 111
 * links into its four hub systems, and that is the single clearest structural
 * difference between the two sites' product templates.
 */
export function hubsForProduct(p: CatalogProduct): {
  series: SeriesDef[];
  characters: CharacterDef[];
  types: ProductTypeDef[];
  manufacturers: ManufacturerDef[];
} {
  const one = [p];
  return {
    series: SERIES.filter((d) => selectProducts(one, seriesMatcher(d)).length === 1),
    characters: CHARACTERS.filter(
      (d) => selectProducts(one, characterMatcher(d)).length === 1,
    ),
    types: PRODUCT_TYPES.filter(
      (d) => selectProducts(one, typeMatcher(d)).length === 1,
    ),
    manufacturers: MANUFACTURERS.filter(
      (d) => selectProducts(one, manufacturerMatcher(d)).length === 1,
    ),
  };
}

/** Price extremes of a set, for the "from Rs X" sentences in the copy. */
export function priceRange(
  products: CatalogProduct[],
): { min: number; max: number } | null {
  const prices = products.map(priceOf).filter((n): n is number => n != null);
  if (!prices.length) return null;
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export { priceOf };
