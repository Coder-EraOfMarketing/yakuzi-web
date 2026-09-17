import type { MetadataRoute } from 'next';
import { absoluteUrl, SITE_URL } from '@/lib/seo/site';

/**
 * Private surfaces. Nothing here is useful in a search result and several
 * would be actively harmful to have crawled.
 */
const PRIVATE = [
  '/checkout',
  '/orders',
  '/payments',
  '/profile',
  '/wishlist',
  '/notifications',
  '/login',
  '/onboarding',
  '/support',
  '/credit',
  '/order-drawer-demo',
  '/api/',
];

/**
 * Parameterised duplicates of pages that already exist at a clean path.
 *
 * Every one of these produces the same products in a different order or with
 * a tracking tag attached, at a URL that canonicalises elsewhere. Left
 * crawlable they multiply the crawl surface without adding a single
 * indexable page — on a catalogue with filters on three axes that is a
 * combinatorial waste of the budget the ~700 real URLs need.
 *
 * `?sub=` is included because `/category/[slug]/[subSlug]` now exists as the
 * real, self-canonicalising page for that set; the query form is the filter
 * UI and should not be crawled as a second copy of it.
 */
const PARAM_DUPES = [
  '/*?*sort=',
  '/*?*sortBy=',
  '/*?*sortOrder=',
  '/*?*view=',
  '/*?*page=',
  '/*?*minPrice=',
  '/*?*maxPrice=',
  '/*?*sub=',
  '/*?*utm_',
  '/*?*gclid=',
  '/*?*fbclid=',
];

const DISALLOW = [...PRIVATE, ...PARAM_DUPES];

/**
 * Crawlers named explicitly.
 *
 * The wildcard rule already permits every one of these, so naming them changes
 * nothing mechanically — but several of these agents look for a block bearing
 * their own user-agent string before applying the wildcard, and an explicit
 * Allow is the unambiguous signal.
 *
 * The distinction that actually matters is between the three jobs an AI
 * company's crawlers do, because the previous list only covered the first:
 *
 *  - TRAINING corpus:  GPTBot, ClaudeBot, Google-Extended, Applebot-Extended,
 *                      CCBot, Meta-ExternalAgent, cohere-ai
 *  - SEARCH INDEX:     OAI-SearchBot, Claude-SearchBot, PerplexityBot —
 *                      these build the index the assistant actually searches
 *  - LIVE USER FETCH:  ChatGPT-User, Claude-User, Perplexity-User — these
 *                      fetch the page at the moment somebody asks a question
 *
 * The previous robots.txt named GPTBot but not OAI-SearchBot or ChatGPT-User,
 * which is the training crawler without either of the two that decide whether
 * this site appears in a ChatGPT answer. Claude-Web was also listed and has
 * been retired; Claude-User and Claude-SearchBot replaced it.
 */
const AI_AND_SEARCH_AGENTS = [
  // OpenAI
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  // Anthropic
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'anthropic-ai',
  // Perplexity
  'PerplexityBot',
  'Perplexity-User',
  // Google, Apple, Microsoft
  'Google-Extended',
  'Googlebot',
  'Googlebot-Image',
  'Applebot',
  'Applebot-Extended',
  'Bingbot',
  'BingPreview',
  // Everyone else worth naming
  'DuckDuckBot',
  'CCBot',
  'Amazonbot',
  'Meta-ExternalAgent',
  'YandexBot',
  'cohere-ai',
  'Bytespider',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      ...AI_AND_SEARCH_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    // One entry point: /sitemap.xml is an index that references every child,
    // including the image sitemap. The image sitemap stays listed separately
    // as well, because Google Images historically picks it up faster when it
    // is named directly and a duplicate reference costs nothing.
    sitemap: [absoluteUrl('/sitemap.xml'), absoluteUrl('/image-sitemap.xml')],
    host: SITE_URL,
  };
}
