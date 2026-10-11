import { describe, expect, it } from 'vitest';
import {
  isPreOrderListing,
  isPurchasable,
  maxOrderableQty,
  type ListingAvailability,
} from './availability';

const FUTURE = '2027-06-01T00:00:00.000Z';
/** A pre-order whose promised date has gone by. Nothing unpublishes it. */
const PAST = '2020-01-15T00:00:00.000Z';

describe('isPreOrderListing', () => {
  it('is true when a delivery date is promised', () => {
    expect(isPreOrderListing({ preOrderDeliveryDate: FUTURE })).toBe(true);
  });

  it('is false for an explicit null date', () => {
    expect(isPreOrderListing({ stock: 4, preOrderDeliveryDate: null })).toBe(
      false,
    );
  });

  it('is false when the field is absent altogether', () => {
    expect(isPreOrderListing({ stock: 4 })).toBe(false);
  });

  it('is false for a null or undefined listing', () => {
    expect(isPreOrderListing(null)).toBe(false);
    expect(isPreOrderListing(undefined)).toBe(false);
  });
});

describe('isPurchasable', () => {
  it('is true for an ordinary listing with stock', () => {
    expect(isPurchasable({ stock: 3 })).toBe(true);
  });

  it('is true for a pre-order holding no stock at all', () => {
    expect(isPurchasable({ stock: 0, preOrderDeliveryDate: FUTURE })).toBe(true);
  });

  it('is false for an ordinary listing out of stock', () => {
    expect(isPurchasable({ stock: 0 })).toBe(false);
    expect(isPurchasable({ stock: null })).toBe(false);
    expect(isPurchasable({})).toBe(false);
  });

  it('is still true for a pre-order whose date has already passed', () => {
    // Nothing unpublishes a listing when its promised date goes by, so it
    // keeps selling until the seller says otherwise. Hiding the buy button
    // would silently take the listing off sale.
    expect(isPurchasable({ stock: 0, preOrderDeliveryDate: PAST })).toBe(true);
  });

  it('is false for a null or undefined listing', () => {
    expect(isPurchasable(null)).toBe(false);
    expect(isPurchasable(undefined)).toBe(false);
  });
});

describe('maxOrderableQty', () => {
  it('is capped by stock on an ordinary listing', () => {
    expect(maxOrderableQty({ stock: 7 })).toBe(7);
  });

  it('respects a seller cap lower than the stock', () => {
    expect(maxOrderableQty({ stock: 7, maximumOrderQuantity: 2 })).toBe(2);
  });

  it('ignores stock for a pre-order but keeps the seller cap', () => {
    const preOrder: ListingAvailability = {
      stock: 0,
      maximumOrderQuantity: 3,
      preOrderDeliveryDate: FUTURE,
    };
    expect(maxOrderableQty(preOrder)).toBe(3);
  });

  it('falls back to 9999 for a pre-order with no seller cap', () => {
    expect(maxOrderableQty({ stock: 0, preOrderDeliveryDate: FUTURE })).toBe(
      9999,
    );
  });

  it('is 0 for a null or undefined listing', () => {
    expect(maxOrderableQty(null)).toBe(0);
    expect(maxOrderableQty(undefined)).toBe(0);
  });
});
