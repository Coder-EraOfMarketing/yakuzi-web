/**
 * Can this listing be bought, and is it a pre-order?
 *
 * "In stock" stopped being the same question as "for sale" when pre-orders
 * arrived: a pre-order listing has no stock at all and is perfectly
 * buyable. The test lived inline as `(stock ?? 0) > 0` in the product page,
 * the quick view, the carousel and the review modal, and four copies of a
 * rule drift. This is the one copy.
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
