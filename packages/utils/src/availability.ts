/**
 * Can this listing be bought, and is it a pre-order?
 *
 * "In stock" stopped being the same question as "for sale" when pre-orders
 * arrived: a pre-order listing has no stock at all and is perfectly buyable.
 *
 * Do not come here looking for the one expression this replaces — there were
 * four surfaces and they disagreed four different ways, which is the actual
 * reason this file exists:
 *
 *   - ProductPageClient  `(listing.stock ?? 0) > 0`      — null stock = OUT
 *   - QuickViewModal     `(listing.stock ?? 9999) > 0`   — null stock = IN
 *   - ProductCarousel    a "notify me" bell, inverted, shown only when
 *                        `stock !== undefined && stock <= 0`, so an absent
 *                        stock reads as available there too
 *   - QuickReviewModal   `const inStock = true;`         — hardcoded
 *
 * So the same listing could be out of stock on the product page and in stock
 * in the quick view. That is not drift, it is four different rules, and one of
 * them was not a rule at all. This is the one copy.
 *
 * WARNING — every member of ListingAvailability is optional, so TypeScript
 * will NOT stop you passing a type that has no `preOrderDeliveryDate` at all.
 * Weak-type detection only fires when the argument shares NO property with
 * the interface; a type carrying `stock` and `maximumOrderQuantity` overlaps,
 * compiles clean, and then `isPreOrderListing` answers `false` forever and
 * every pre-order silently reads as out of stock. Nothing errors.
 *
 * The API's equivalent helper takes an interface with a single optional
 * member, so there a row missing the field overlaps nothing and fails the
 * build (TS2559). This richer interface is the LESS protected one — exactly
 * backwards from how it reads, and not something you would guess.
 *
 * But at three of the four call sites above the listing is typed `any`, so the
 * compiler was never going to help there in the first place. The practical
 * risk at those sites is not the type: it is the FETCH LAYER not asking for
 * `preOrderDeliveryDate`. A query that omits the field yields `undefined`,
 * every pre-order reads as ordinary and out of stock, and no type anywhere can
 * catch it. When a pre-order renders wrong, check the request before the types.
 *
 * Where types do apply: a type fed to these helpers must actually DECLARE
 * `preOrderDeliveryDate`. `Product` and `MarketplaceListing` in ./types do.
 */

export interface ListingAvailability {
  stock?: number | null;
  maximumOrderQuantity?: number | null;
  /** Non-null means pre-order. Mirrors SellerOffer.preOrderDeliveryDate. */
  preOrderDeliveryDate?: string | Date | null;
}

/** Fallback cap for a listing with no stock limit and no seller limit. */
const UNBOUNDED = 9999;

export function isPreOrderListing(
  listing: ListingAvailability | null | undefined,
): boolean {
  return listing?.preOrderDeliveryDate != null;
}

export function isPurchasable(
  listing: ListingAvailability | null | undefined,
): boolean {
  if (!listing) return false;
  return isPreOrderListing(listing) || (listing.stock ?? 0) > 0;
}

/**
 * The largest quantity the buyer may put in the bag.
 *
 * A pre-order is unlimited in total, so stock is not a ceiling for one —
 * but the seller's own per-order maximum still is. Keeping both rules here
 * is what stops a quantity stepper letting someone order past the stock
 * that exists.
 */
export function maxOrderableQty(
  listing: ListingAvailability | null | undefined,
): number {
  if (!listing) return 0;
  const sellerCap = listing.maximumOrderQuantity ?? UNBOUNDED;
  if (isPreOrderListing(listing)) return sellerCap;
  return Math.min(listing.stock ?? UNBOUNDED, sellerCap);
}
