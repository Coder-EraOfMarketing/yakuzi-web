/**
 * When the storefront's promo popup may appear.
 *
 * Pure so the rules can be tested without a browser. They are easy to get
 * subtly wrong: an over-broad path match interrupts a checkout, a storage
 * failure that is read as "never dismissed" re-shows the popup on every page,
 * and a stored timestamp from the future (clock change) can suppress it
 * forever.
 */

/**
 * Pages worth interrupting. An allowlist, not a denylist: a new route (a
 * payment screen, a profile page) should NOT start showing a promotion by
 * default. Product detail pages are deliberately absent — a visitor who has
 * reached one has found something to buy, and a modal over it is the wrong
 * moment.
 */
const LANDING_PATHS: RegExp[] = [
  /^\/$/,
  /^\/products\/?$/, // the listing, not /products/<slug>
  /^\/category(\/|$)/,
  /^\/collections(\/|$)/,
];

export function isPromoPage(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return LANDING_PATHS.some((re) => re.test(pathname));
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Has the visitor dismissed this promo recently enough that it should stay shut?
 *
 * `raw` is whatever localStorage returned: null (never dismissed, or storage
 * unavailable), or the dismissal time in epoch milliseconds as a string.
 */
export function isPromoSuppressed(
  raw: string | null | undefined,
  now: number,
  hideForDays: number,
): boolean {
  if (!raw) return false;
  const dismissedAt = Number(raw);
  // Garbage in storage must not suppress the popup forever.
  if (!Number.isFinite(dismissedAt) || dismissedAt <= 0) return false;
  // A timestamp in the future (clock moved back) is not a real dismissal.
  if (dismissedAt > now) return false;
  return now - dismissedAt < hideForDays * DAY_MS;
}

/**
 * Pages that must stay free of the announcement bar.
 *
 * The opposite default to isPromoPage, deliberately: the bar is a quiet,
 * non-modal strip, so it belongs on almost every browsing page (a visitor who
 * lands on a product page from Google should still see it) — and a DENYlist
 * is the right shape for that. What it must never do is sit over a payment or
 * login step, where a promotional link is a distraction from finishing.
 */
const NO_ANNOUNCEMENT_PATHS: RegExp[] = [
  /^\/checkout(\/|$)/,
  /^\/payments(\/|$)/,
  /^\/login(\/|$)/,
  /^\/credit(\/|$)/,
];

export function showsAnnouncementBar(pathname: string | null | undefined): boolean {
  // Unknown path: show nothing rather than guess, same as isPromoPage.
  if (!pathname) return false;
  return !NO_ANNOUNCEMENT_PATHS.some((re) => re.test(pathname));
}
