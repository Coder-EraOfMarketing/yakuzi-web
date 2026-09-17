import { notFound } from 'next/navigation';
import { getBlogs } from '@yukizi/api-client';
import { getCategoriesCachedShared } from '@/lib/server-cache';
import {
  renderUrlSet,
  xmlResponse,
  PRODUCTS_PER_SITEMAP,
  type SitemapUrl,
} from '@/lib/seo/sitemap';
import { getCatalog, listable, isBuildPhase } from '@/lib/seo/catalog';
import { routes } from '@/lib/seo/url';
import { authorSlug } from '@/lib/seo/schema';
import { COLLECTIONS } from '@/data/collections';
import { SERIES, MIN_PRODUCTS_SERIES } from '@/lib/seo/data/series';
import { CHARACTERS, MIN_PRODUCTS_CHARACTER } from '@/lib/seo/data/characters';
import {
  PRODUCT_TYPES,
  CROSSABLE_TYPES,
  MIN_PRODUCTS_TYPE,
  MIN_PRODUCTS_SERIES_TYPE,
} from '@/lib/seo/data/product-types';
import { PRICE_BANDS, MIN_PRODUCTS_PRICE } from '@/lib/seo/data/price-bands';
import { STATES, ALL_CITIES, placeIsIndexable } from '@/lib/seo/data/locations';
import {
  selectProducts,
  seriesMatcher,
  characterMatcher,
  typeMatcher,
  seriesTypeMatcher,
  priceMatcher,
  subCategoryMatcher,
} from '@/lib/seo/hub';

/**
 * Every child sitemap, served from one dynamic route.
 *
 * A single handler keyed on the filename beats eleven near-identical route
 * files: the escaping, cache headers and chunking maths stay in one place, and
 * adding a family is one `case`.
 *
 * The rule every facet family below follows: a URL is listed here ONLY if the
 * page at the other end will actually ask to be indexed. Each hub renders
 * `robots: noindex` when it falls under its own threshold, so listing a thin
 * hub would publish two contradictory statements about the same URL — the
 * sitemap saying "index this", the page saying "do not". Google resolves that
 * by trusting the sitemap a little less, which is a cost paid across every
 * other URL in it. The thresholds are imported from the same data files the
 * pages read, so the two cannot drift.
 */
export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: { slug: string } },
): Promise<Response> {
  const name = params.slug.replace(/\.xml$/i, '');

  if (name.startsWith('products-')) {
    return handleProducts(Number(name.slice('products-'.length)));
  }

  switch (name) {
    case 'static':
      return handleStatic();
    case 'series':
      return handleSeries();
    case 'characters':
      return handleCharacters();
    case 'formats':
      return handleFormats();
    case 'series-formats':
      return handleSeriesFormats();
    case 'prices':
      return handlePrices();
    case 'locations':
      return handleLocations();
    case 'collections':
      return handleCollections();
    case 'categories':
      return handleCategories();
    case 'blogs':
      return handleBlogs();
    default:
      notFound();
  }
}

/**
 * Refuses to publish a product sitemap that says the catalogue is empty.
 *
 * A 200 carrying no product URLs is the worst available outcome: it is a
 * confident, cacheable statement that the shop has nothing in it, and Google
 * acts on it by dropping product URLs it already knew. A 500 costs nothing —
 * Search Console flags "couldn't fetch", the last good sitemap stays in
 * effect, and Google retries. Not during a build, though: failing there would
 * block a deploy over a transient upstream blip, and the route regenerates
 * hourly anyway.
 */
function guardEmpty(urls: SitemapUrl[], label: string): void {
  if (urls.length === 0 && !isBuildPhase()) {
    throw new Error(`[sitemaps/${label}] refusing to publish an empty sitemap`);
  }
}

async function handleProducts(chunk: number): Promise<Response> {
  if (!Number.isInteger(chunk) || chunk < 0 || chunk > 100) notFound();

  const all = listable(await getCatalog());
  const slice = all.slice(
    chunk * PRODUCTS_PER_SITEMAP,
    (chunk + 1) * PRODUCTS_PER_SITEMAP,
  );
  if (slice.length === 0 && chunk > 0) notFound();

  const urls: SitemapUrl[] = slice.map((p) => ({
    path: routes.product(p.slug ?? p.id),
    lastModified: p.updatedAt ?? p.createdAt,
    changeFrequency: 'daily',
    // A product with a live seller is the one that can convert, so it earns
    // the crawler's attention ahead of one that cannot be bought.
    priority: (p.stock ?? 0) > 0 ? 0.8 : 0.5,
  }));

  guardEmpty(urls, `products-${chunk}`);
  return xmlResponse(renderUrlSet(urls));
}

function handleStatic(): Response {
  const now = new Date();
  const urls: SitemapUrl[] = [
    { path: routes.home(), changeFrequency: 'daily', priority: 1.0, lastModified: now },
    { path: routes.products(), changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { path: routes.seriesIndex(), changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { path: routes.charactersIndex(), changeFrequency: 'daily', priority: 0.9, lastModified: now },
    { path: routes.typesIndex(), changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { path: routes.pricesIndex(), changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { path: routes.storesIndex(), changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { path: routes.collections(), changeFrequency: 'weekly', priority: 0.8, lastModified: now },
    { path: routes.storeIndia(), changeFrequency: 'weekly', priority: 0.7, lastModified: now },
    { path: routes.blogs(), changeFrequency: 'daily', priority: 0.6, lastModified: now },
    { path: routes.about(), changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { path: routes.contact(), changeFrequency: 'monthly', priority: 0.5, lastModified: now },
    { path: routes.shipping(), changeFrequency: 'monthly', priority: 0.4, lastModified: now },
    { path: routes.returns(), changeFrequency: 'monthly', priority: 0.4, lastModified: now },
    { path: routes.privacy(), changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { path: routes.terms(), changeFrequency: 'yearly', priority: 0.3, lastModified: now },
    { path: routes.cookiePolicy(), changeFrequency: 'yearly', priority: 0.3, lastModified: now },
  ];
  return xmlResponse(renderUrlSet(urls));
}

async function handleSeries(): Promise<Response> {
  const all = listable(await getCatalog());
  const urls: SitemapUrl[] = SERIES.filter(
    (s) => selectProducts(all, seriesMatcher(s)).length >= MIN_PRODUCTS_SERIES,
  ).map((s) => ({
    path: routes.series(s.slug),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
  guardEmpty(urls, 'series');
  return xmlResponse(renderUrlSet(urls));
}

async function handleCharacters(): Promise<Response> {
  const all = listable(await getCatalog());
  const urls: SitemapUrl[] = CHARACTERS.filter(
    (c) => selectProducts(all, characterMatcher(c)).length >= MIN_PRODUCTS_CHARACTER,
  ).map((c) => ({
    path: routes.character(c.slug),
    changeFrequency: 'weekly',
    // Character pages are the highest-intent URLs on the site — "nezuko
    // figure" converts far better than "demon slayer merchandise" — so they
    // are ranked above the series hubs in the crawl queue.
    priority: 0.9,
  }));
  guardEmpty(urls, 'characters');
  return xmlResponse(renderUrlSet(urls));
}

async function handleFormats(): Promise<Response> {
  const all = listable(await getCatalog());
  const urls: SitemapUrl[] = PRODUCT_TYPES.filter(
    (t) => selectProducts(all, typeMatcher(t)).length >= MIN_PRODUCTS_TYPE,
  ).map((t) => ({
    path: routes.type(t.slug),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  guardEmpty(urls, 'formats');
  return xmlResponse(renderUrlSet(urls));
}

async function handleSeriesFormats(): Promise<Response> {
  const all = listable(await getCatalog());
  const urls: SitemapUrl[] = [];
  for (const series of SERIES) {
    for (const type of CROSSABLE_TYPES) {
      const count = selectProducts(all, seriesTypeMatcher(series, type)).length;
      if (count >= MIN_PRODUCTS_SERIES_TYPE) {
        urls.push({
          path: routes.seriesType(series.slug, type.slug),
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
    }
  }
  // Deliberately NOT guarded. A young catalogue legitimately has no series x
  // format combination deep enough to index, and an empty urlset is the
  // honest answer to that — unlike an empty product sitemap, it does not
  // contradict anything Google already knows.
  return xmlResponse(renderUrlSet(urls));
}

async function handlePrices(): Promise<Response> {
  const all = listable(await getCatalog());
  const urls: SitemapUrl[] = PRICE_BANDS.filter(
    (b) => selectProducts(all, priceMatcher(b)).length >= MIN_PRODUCTS_PRICE,
  ).map((b) => ({
    path: routes.price(b.slug),
    changeFrequency: 'daily',
    priority: 0.7,
  }));
  guardEmpty(urls, 'prices');
  return xmlResponse(renderUrlSet(urls));
}

function handleLocations(): Response {
  // Only places carrying hand-written copy are listed — the gate documented
  // in data/locations.ts. The rest render, link onward and stay unlisted.
  const urls: SitemapUrl[] = [
    ...STATES.filter(placeIsIndexable).map((s) => ({
      path: routes.state(s.slug),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...ALL_CITIES.filter(placeIsIndexable).map((c) => ({
      path: routes.city(c.stateSlug, c.slug),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
  guardEmpty(urls, 'locations');
  return xmlResponse(renderUrlSet(urls));
}

function handleCollections(): Response {
  const urls: SitemapUrl[] = COLLECTIONS.map((c) => ({
    path: routes.collection(c.slug),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));
  guardEmpty(urls, 'collections');
  return xmlResponse(renderUrlSet(urls));
}

/**
 * Categories AND their sub-categories.
 *
 * The sub-category URLs used to be excluded on the grounds that every one of
 * them canonicalised to its parent — listing a URL whose canonical points
 * elsewhere is a contradiction, and the old note in app/sitemap.ts was right
 * to leave them out. `/category/[slug]/[subSlug]` fixes the underlying
 * problem instead: those pages now canonicalise to themselves and carry their
 * own title, description and copy, so listing them is no longer a
 * contradiction. Empty ones still noindex, so they are filtered here too.
 */
async function handleCategories(): Promise<Response> {
  const urls: SitemapUrl[] = [];
  try {
    const cats = (await getCategoriesCachedShared()) as any[];
    const all = listable(await getCatalog());

    for (const c of Array.isArray(cats) ? cats : []) {
      if (!c?.slug) continue;
      urls.push({
        path: routes.category(c.slug),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
      for (const sub of c.subCategories ?? []) {
        if (!sub?.slug) continue;
        const count = selectProducts(all, subCategoryMatcher(c.slug, sub.slug)).length;
        if (count === 0) continue;
        urls.push({
          path: routes.subCategory(c.slug, sub.slug),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      }
    }
  } catch {
    /* fall through to the guard */
  }
  guardEmpty(urls, 'categories');
  return xmlResponse(renderUrlSet(urls));
}

async function handleBlogs(): Promise<Response> {
  const urls: SitemapUrl[] = [];
  try {
    const blogs = await getBlogs({ limit: 100, status: 'PUBLISHED' });
    const authors = new Set<string>();
    for (const b of blogs.data) {
      if ((b as any).status && (b as any).status !== 'PUBLISHED') continue;
      if (b?.slug) {
        urls.push({
          path: routes.blog(b.slug),
          lastModified: b.publishedAt ?? b.createdAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      }
      // Authors get one entry each, not one per post they wrote.
      if (b?.author?.name) authors.add(authorSlug(b.author.name));
    }
    for (const slug of authors) {
      urls.push({
        path: routes.blogAuthor(slug),
        changeFrequency: 'monthly',
        priority: 0.3,
      });
    }
  } catch {
    /* fail-open: an empty blog sitemap is honest, see below */
  }
  // NOT guarded. The blog genuinely has no published posts right now, and an
  // empty urlset states that correctly. Throwing would turn "nothing written
  // yet" into a permanent sitemap fetch error in Search Console.
  return xmlResponse(renderUrlSet(urls));
}
