import { describe, it, expect } from 'vitest';
import { buildProductFormPrefill } from './prefill';

/**
 * The form must open the listing the seller actually owns.
 *
 * `product.listings` is the MULTI-SELLER list that powers the product page —
 * every seller's offer for the same catalogue product is in it, and several
 * carry the same `variantName`. Picking one by name alone returns whichever
 * sorts first, which is very often somebody else.
 *
 * When that was not the person editing, the variants table opened showing
 * another seller's base price, stock and discount, and saving wrote them onto
 * the editor's own offer. Nothing errored.
 *
 * The fixture below is the real shape, taken from the live payload for
 * "Maayan Issue 1": MAAYAN's ₹250 listing genuinely sorts before Testing
 * Seller 1's ₹350 one, for the same "English" variant.
 */

const MINE = 'seller-testing-1';
const THEIRS = 'seller-maayan';

const sharedProduct = () => ({
  id: 'master-1',
  name: 'Maayan Issue 1',
  mrp: 350,
  stock: 2,
  variants: [
    { id: 'var-en', name: 'English' },
    { id: 'var-ml', name: 'Malayalam' },
  ],
  listings: [
    // Theirs first — this is the ordering that caused the bug.
    {
      id: 'offer-theirs-en',
      variantName: 'English',
      mrp: 250,
      stock: 200,
      sku: 'MAY-ENG-001',
      seller: { id: THEIRS, companyName: 'MAAYAN PUBLICATIONS PRIVATE LIMITED' },
    },
    {
      id: 'offer-theirs-ml',
      variantName: 'Malayalam',
      mrp: 250,
      stock: 200,
      sku: 'MAY-MAL-001',
      seller: { id: THEIRS, companyName: 'MAAYAN PUBLICATIONS PRIVATE LIMITED' },
    },
    // Ours.
    {
      id: 'offer-mine-en',
      variantName: 'English',
      mrp: 433,
      stock: 2,
      sku: 'MINE-ENG',
      seller: { id: MINE, companyName: 'Testing Seller 1' },
    },
    {
      id: 'offer-mine-ml',
      variantName: 'Malayalam',
      mrp: 480,
      stock: 3,
      sku: 'MINE-MAL',
      seller: { id: MINE, companyName: 'Testing Seller 1' },
    },
  ],
});

const rowFor = (variants: any[], name: string) =>
  variants.find((v: any) => v.name === name);

describe('buildProductFormPrefill — whose listing the variants table shows', () => {
  it('shows THIS seller’s price and stock, not the first matching seller’s', () => {
    const { initialVariants } = buildProductFormPrefill(sharedProduct(), {
      productId: 'offer-mine-en',
    });

    const en = rowFor(initialVariants, 'English');
    // Before the fix these were '250' and '200' — MAAYAN's figures, which
    // saving then wrote onto this seller's own offer.
    expect(en.price).toBe('433');
    expect(en.available).toBe('2');
    expect(en.sku).toBe('MINE-ENG');
  });

  it('shows this seller’s OTHER variants too, not a mix of sellers', () => {
    const { initialVariants } = buildProductFormPrefill(sharedProduct(), {
      productId: 'offer-mine-en',
    });

    const ml = rowFor(initialVariants, 'Malayalam');
    expect(ml.price).toBe('480');
    expect(ml.available).toBe('3');
    expect(ml.sku).toBe('MINE-MAL');
  });

  it('resolves the active variant from this seller’s own listing', () => {
    const { activeVariantId } = buildProductFormPrefill(sharedProduct(), {
      productId: 'offer-mine-ml',
    });

    expect(activeVariantId).toBe('var-ml');
  });

  it('reads listing-level fields off this seller’s own offer', () => {
    const { defaultValues } = buildProductFormPrefill(sharedProduct(), {
      productId: 'offer-mine-en',
    });

    expect(defaultValues.sku).toBe('MINE-ENG');
  });

  it('still works when the seller owns the only listing', () => {
    const product = sharedProduct();
    product.listings = product.listings.filter((l: any) => l.seller.id === MINE);

    const { initialVariants } = buildProductFormPrefill(product, {
      productId: 'offer-mine-en',
    });

    expect(rowFor(initialVariants, 'English').price).toBe('433');
  });

  it('falls back to any-seller matching when the id matches no listing', () => {
    // A caller handing in a variant id rather than a listing id. Deliberately
    // unchanged, so that path keeps working.
    const { initialVariants } = buildProductFormPrefill(sharedProduct(), {
      productId: 'var-en',
      variantParam: 'English',
    });

    expect(rowFor(initialVariants, 'English').price).toBe('250');
  });
});
