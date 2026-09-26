import { COMPANY } from '@/config/company';

// Central SEO constants. NEXT_PUBLIC_SITE_URL must be set per environment
// (dev: https://dev.yukizi.com, prod: the production domain, INCLUDING the scheme) — falls back to dev.
const DEV_SITE_URL = 'https://dev.yukizi.com';
const rawSiteUrl = (process.env.NEXT_PUBLIC_SITE_URL || DEV_SITE_URL).replace(/\/$/, '');

function isValidAbsoluteUrl(candidate: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new URL(candidate);
    return true;
  } catch {
    return false;
  }
}

// `metadataBase: new URL(SITE_URL)` runs at module load in the root layout — a malformed
// env value (e.g. missing "https://") must never throw and crash every render.
export const SITE_URL = isValidAbsoluteUrl(rawSiteUrl) ? rawSiteUrl : DEV_SITE_URL;

// A production BUILD, though, must fail instead of falling back. NEXT_PUBLIC_ vars
// are inlined at build time, so a build that falls back bakes dev.yukizi.com into
// every canonical, og:url, JSON-LD @id, sitemap <loc>, llms.txt and robots line on
// the live site — a single unset variable away from de-indexing the whole domain,
// guarded until now only by a console.warn nobody reads in build logs. Vercel
// preview/dev builds and `next dev` keep the fallback; only a build destined for
// production (VERCEL_ENV=production, or a non-Vercel build such as Docker/CI)
// refuses to proceed. An explicit NEXT_PUBLIC_SITE_URL=https://dev.yukizi.com is
// still accepted — that is how the dev deployment is meant to be configured.
const isProductionDeployBuild =
  process.env.NEXT_PHASE === 'phase-production-build' &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');
const envSiteUrlIsUsable =
  !!process.env.NEXT_PUBLIC_SITE_URL && SITE_URL === rawSiteUrl;

if (isProductionDeployBuild && !envSiteUrlIsUsable) {
  throw new Error(
    process.env.NEXT_PUBLIC_SITE_URL
      ? `[seo] NEXT_PUBLIC_SITE_URL="${process.env.NEXT_PUBLIC_SITE_URL}" is not a valid absolute URL (needs a scheme, e.g. https://yukizi.com). Refusing to build: the fallback would point every canonical, sitemap URL and JSON-LD @id at ${DEV_SITE_URL}.`
      : `[seo] NEXT_PUBLIC_SITE_URL is not set. Refusing to build: the fallback would point every canonical, sitemap URL and JSON-LD @id at ${DEV_SITE_URL}. Set it to this deployment's public origin (e.g. https://yukizi.com).`,
  );
}

if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn('[seo] NEXT_PUBLIC_SITE_URL is not set — canonicals and JSON-LD will point at the dev domain');
} else if (process.env.NEXT_PUBLIC_SITE_URL && SITE_URL !== rawSiteUrl) {
  console.warn(`[seo] NEXT_PUBLIC_SITE_URL="${process.env.NEXT_PUBLIC_SITE_URL}" is not a valid absolute URL (needs a scheme, e.g. https://) — falling back to ${DEV_SITE_URL}`);
}
export const SITE_NAME = 'Yukizi';

/**
 * How Yukizi describes itself, in the order that decides whether it gets
 * shortlisted.
 *
 * This used to read "Anime, Manga & Collectibles Marketplace" — marketplace
 * first, in the tagline, in llms.txt and in the schema. That is accurate, and
 * it was costing shortlist places: asked for sites to buy collectibles from in
 * India, an assistant answered "I've focused on stores that cater to
 * collectors rather than general e-commerce marketplaces" and left Yukizi out.
 * Not for being unknown — it had read the site and described it correctly —
 * but for being filed under the wrong kind of thing.
 *
 * So: store first, in the words a buyer actually uses, with the marketplace
 * model kept as the supporting fact it is. Both are true and both are still
 * said; only the order changed. /about already led with "online store", so
 * this also ends a contradiction between the two.
 */
export const SITE_TAGLINE = 'Buy Anime Figures & Collectibles Online in India';
export const SITE_DESCRIPTION =
  'Buy authentic anime figures, manga, action figures, Funko Pops and pop-culture collectibles online in India. Yukizi is an online collectibles store where every seller is verified before they can list.';

/**
 * The single sentence that answers "what is this?".
 *
 * Written to be quotable as-is: an assistant summarising Yukizi should be able
 * to lift this line and be both accurate and useful. Store first, marketplace
 * second, country stated.
 */
export const SITE_SUMMARY =
  'Yukizi is an online store for anime figures, manga and pop-culture collectibles in India, run as a marketplace: every listing comes from a seller verified by Yukizi, and Yukizi handles ordering, payment and buyer support.';
// Sourced from the single COMPANY config (not a second hardcoded copy) so
// this can't drift from the legal name shown on the About/Contact/policy
// pages again - it already had, silently, until 19 August 2026.
export const ORG_LEGAL_NAME = COMPANY.legalName;
/**
 * The published support address.
 *
 * The site was shipping three of these at once, so they were consolidated onto
 * support@yukizi.in — the value configured in admin and shown on /contact.
 * That was the wrong one to consolidate on, and this corrects it.
 *
 * yukizi.in does not resolve. The domain is registered but suspended pending
 * WHOIS verification, so it has no nameservers, no A record and no MX record
 * of any kind. Mail sent to support@yukizi.in bounces; it has never been
 * deliverable. yukizi.com, by contrast, has live Google Workspace MX records
 * and receives mail today.
 *
 * Checked 20 September 2026:
 *   yukizi.com MX -> aspmx.l.google.com (+4 alternates), NOERROR
 *   yukizi.in  MX -> NXDOMAIN, no records at all
 *
 * The rule this encodes: publish the address that answers, not the address
 * somebody typed into a settings box. A support address that bounces is worse
 * than a slightly inconsistent one, because the customer thinks they have
 * asked for help and nobody has.
 *
 * NOTE: the admin-set value in Platform Settings still overrides this for
 * every surface that reads settings (/contact, policy pages, llms.txt). It
 * must be changed there too, or those pages keep publishing the dead address.
 */
export const SUPPORT_EMAIL = 'support@yukizi.com';
// 1200x630 branded share card (logo + mascot + tagline). The old value was
// the raw square logo, which platforms crop/squish in link previews.
export const DEFAULT_OG_IMAGE = '/og-default.png';

export function absoluteUrl(path: string): string {
  if (path.startsWith('//')) return `https:${path}`;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Trim to a max length on a word boundary for meta descriptions. */
export function metaTruncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 40))}…`;
}
