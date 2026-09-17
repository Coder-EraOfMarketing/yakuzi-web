import { cache } from 'react';
import { getCatalog, listable, type CatalogProduct } from './catalog';
import {
  selectProducts,
  seriesMatcher,
  characterMatcher,
  typeMatcher,
  seriesTypeMatcher,
  priceMatcher,
  subCategoryMatcher,
  manufacturerMatcher,
  giftMatcher,
} from './hub';
import { seriesBySlug, type SeriesDef } from './data/series';
import { characterBySlug, type CharacterDef } from './data/characters';
import { productTypeBySlug, type ProductTypeDef } from './data/product-types';
import { priceBandBySlug, type PriceBandDef } from './data/price-bands';
import { manufacturerBySlug, type ManufacturerDef } from './data/manufacturers';
import { giftOccasionBySlug, type GiftOccasionDef } from './data/gift-occasions';
import { cityBySlug, stateBySlug, type CityRef, type State } from './data/locations';

/**
 * Hub resolution, shared between `generateMetadata` and the page body.
 *
 * Next calls `generateMetadata` and the default export as two separate
 * invocations of the same route. Without `cache()` each hub would walk the
 * catalogue twice — and worse, the two walks could land either side of a
 * revalidation and disagree, so the page could render eight products under a
 * title claiming seven. `cache()` dedupes them into one read per request, and
 * `getCatalog()` dedupes further across every hub rendered in the same pass.
 *
 * Every resolver returns `null` for an unknown slug rather than throwing, so
 * the route can call `notFound()` — but a failed catalogue read still throws
 * out of `getCatalog`, which is the behaviour that keeps a transient API blip
 * from being served as a permanent "this hub is empty".
 */

export interface Resolved<T> {
  def: T;
  /** The hub's own members. */
  products: CatalogProduct[];
  /** The whole listable catalogue, for sibling counts and link groups. */
  all: CatalogProduct[];
}

async function catalogue(): Promise<CatalogProduct[]> {
  return listable(await getCatalog());
}

export const resolveSeries = cache(
  async (slug: string): Promise<Resolved<SeriesDef> | null> => {
    const def = seriesBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: selectProducts(all, seriesMatcher(def)) };
  },
);

export const resolveCharacter = cache(
  async (slug: string): Promise<Resolved<CharacterDef> | null> => {
    const def = characterBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: selectProducts(all, characterMatcher(def)) };
  },
);

export const resolveType = cache(
  async (slug: string): Promise<Resolved<ProductTypeDef> | null> => {
    const def = productTypeBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: selectProducts(all, typeMatcher(def)) };
  },
);

export const resolveSeriesType = cache(
  async (
    seriesSlug: string,
    typeSlug: string,
  ): Promise<{
    series: SeriesDef;
    type: ProductTypeDef;
    products: CatalogProduct[];
    all: CatalogProduct[];
  } | null> => {
    const series = seriesBySlug(seriesSlug);
    const type = productTypeBySlug(typeSlug);
    // A type that is not flagged `crossWithSeries` has no cross page. Serving
    // one anyway would publish a URL the sitemap never lists and the link hub
    // never points at — an orphan that only a crawler guessing URLs can reach.
    if (!series || !type || !type.crossWithSeries) return null;
    const all = await catalogue();
    return {
      series,
      type,
      all,
      products: selectProducts(all, seriesTypeMatcher(series, type)),
    };
  },
);

export const resolveManufacturer = cache(
  async (slug: string): Promise<Resolved<ManufacturerDef> | null> => {
    const def = manufacturerBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: selectProducts(all, manufacturerMatcher(def)) };
  },
);

export const resolveGift = cache(
  async (slug: string): Promise<Resolved<GiftOccasionDef> | null> => {
    const def = giftOccasionBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: selectProducts(all, giftMatcher(def)) };
  },
);

export const resolvePriceBand = cache(
  async (slug: string): Promise<Resolved<PriceBandDef> | null> => {
    const def = priceBandBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: selectProducts(all, priceMatcher(def)) };
  },
);

/**
 * Place pages list the whole catalogue, because that is the truth.
 *
 * There is no city-level inventory to filter by: a buyer in Guwahati and a
 * buyer in Mumbai are offered the same products at the same prices. Filtering
 * the grid per city would fabricate a distinction that does not exist, and
 * inventing one is precisely what turns a location page into a doorway page.
 */
export const resolveState = cache(
  async (slug: string): Promise<Resolved<State> | null> => {
    const def = stateBySlug(slug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: all };
  },
);

export const resolveCity = cache(
  async (
    stateSlug: string,
    citySlug: string,
  ): Promise<Resolved<CityRef> | null> => {
    const def = cityBySlug(stateSlug, citySlug);
    if (!def) return null;
    const all = await catalogue();
    return { def, all, products: all };
  },
);

export const resolveSubCategory = cache(
  async (
    categorySlug: string,
    subSlug: string,
  ): Promise<{ products: CatalogProduct[]; all: CatalogProduct[] }> => {
    const all = await catalogue();
    return {
      all,
      products: selectProducts(all, subCategoryMatcher(categorySlug, subSlug)),
    };
  },
);
