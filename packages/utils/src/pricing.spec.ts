import { describe, expect, it } from 'vitest';
import { calculatePricing, variantShippingTotal } from './pricing';

/**
 * The product from the 2026-10-03 report: ₹1,600 tax-inclusive, 15% commission,
 * 18% GST on fees, and a ₹150 delivery charge.
 */
const FEES = { commissionPercent: 15, commissionGstPercent: 18 };

function price(sellerKeepsShipping: boolean) {
  return calculatePricing(
    1600,
    0,
    {
      type: 'none',
      isTaxIncluded: true,
      shippingCharges: 150,
      shippingGstPercent: 0,
      sellerKeepsShipping,
    },
    FEES,
  );
}

describe('calculatePricing shipping régimes', () => {
  it('charges the buyer for shipping either way', () => {
    expect(price(false).finalCustomerPayable).toBe(1750);
    expect(price(true).finalCustomerPayable).toBe(1750);
  });

  it('withholds the shipping when Yukizi books the courier', () => {
    // 1750 − 150 shipping − (240 commission + 43.20 GST) = 1316.80
    expect(price(false).sellerPayout).toBe(1316.8);
  });

  it('leaves the shipping with a seller who booked their own courier', () => {
    // 1750 − (240 commission + 43.20 GST) = 1466.80
    expect(price(true).sellerPayout).toBe(1466.8);
  });

  it('charges the same platform fees in both régimes', () => {
    // Commission is on the product, never on the delivery charge, so switching
    // who ships must not move Yukizi's cut.
    expect(price(true).totalPlatformFees).toBe(price(false).totalPlatformFees);
    expect(price(true).commissionAmount).toBe(240);
  });

  it('withholds shipping by default, as it always has', () => {
    const noFlag = calculatePricing(
      1600,
      0,
      { type: 'none', isTaxIncluded: true, shippingCharges: 150, shippingGstPercent: 0 },
      FEES,
    );
    expect(noFlag.sellerPayout).toBe(price(false).sellerPayout);
  });
});

describe('variantShippingTotal', () => {
  it('returns the stored GST-inclusive figure when the variant has one', () => {
    // The row from the 2026-10-12 report: the Shipping column showed ₹106.2
    // while Final showed ₹340, i.e. 250 + 90, because the total re-derived its
    // own shipping from shippingCharges instead of reading this figure.
    expect(
      variantShippingTotal(
        { shippingCharges: '90', shippingGstPercent: 0, finalShippingPrice: '106.2' },
        { shippingCharges: 0, shippingGstPercent: 0 },
      ),
    ).toBe(106.2);
  });

  it('derives the figure from charge + GST when nothing is stored', () => {
    expect(
      variantShippingTotal({ shippingCharges: '90', shippingGstPercent: 18 }, {}),
    ).toBe(106.2);
  });

  it('treats a stored 0 as unset and falls back to the parts', () => {
    expect(
      variantShippingTotal(
        { shippingCharges: '90', shippingGstPercent: 18, finalShippingPrice: '0' },
        {},
      ),
    ).toBe(106.2);
  });

  it('falls back to the parent listing when the variant overrides nothing', () => {
    expect(
      variantShippingTotal({}, { shippingCharges: 50, shippingGstPercent: 18 }),
    ).toBe(59);
  });

  it('prefers the variant charge over the parent', () => {
    expect(
      variantShippingTotal(
        { shippingCharges: '90' },
        { shippingCharges: 50, shippingGstPercent: 18 },
      ),
    ).toBe(106.2);
  });

  it('keeps a tax-inclusive charge as-is rather than grossing it up again', () => {
    expect(
      variantShippingTotal(
        { shippingCharges: '106.2', shippingGstPercent: 18 },
        { isTaxIncluded: true },
      ),
    ).toBe(106.2);
  });

  it('is zero when neither the variant nor the parent charges for delivery', () => {
    expect(variantShippingTotal({}, {})).toBe(0);
    expect(variantShippingTotal({ shippingCharges: '0' }, {})).toBe(0);
  });

  it('agrees with what calculatePricing then bills the buyer', () => {
    // The whole point: the number shown in the Shipping column and the number
    // inside Final come from one function, so 250 + 106.2 can only be 356.20.
    const shipping = variantShippingTotal(
      { shippingCharges: '90', shippingGstPercent: 0, finalShippingPrice: '106.2' },
      {},
    );
    const pricing = calculatePricing(250, 0, {
      type: 'none',
      shippingCharges: shipping,
      shippingGstPercent: 0,
    });

    expect(shipping).toBe(106.2);
    expect(pricing.finalCustomerPayable).toBe(356.2);
  });
});
