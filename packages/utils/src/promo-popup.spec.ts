import { describe, it, expect } from 'vitest';
import { isPromoPage, isPromoSuppressed, showsAnnouncementBar } from './promo-popup';

describe('isPromoPage', () => {
  it.each(['/', '/products', '/products/', '/category/figurines', '/category/figurines/anime', '/collections/naruto', '/collections'])(
    'allows %s',
    (path) => expect(isPromoPage(path)).toBe(true),
  );

  it.each([
    '/checkout',
    '/payments/abc',
    '/orders',
    '/orders/123',
    '/login',
    '/profile',
    '/wishlist',
    '/notifications',
    '/credit',
    '/support',
    '/shipping',
    '/about',
    '/blogs/some-post',
    '/api/products',
  ])('never interrupts %s', (path) => expect(isPromoPage(path)).toBe(false));

  it('does not show on a product detail page', () => {
    // /products is allowed (the listing) but /products/<slug> is not: a visitor
    // on a PDP has already found something to buy.
    expect(isPromoPage('/products/naruto-uzumaki-sage-mode')).toBe(false);
  });

  it('is not fooled by a look-alike prefix', () => {
    // An unanchored /^\/category/ would match this.
    expect(isPromoPage('/categoryfoo')).toBe(false);
    expect(isPromoPage('/collectionsx')).toBe(false);
  });

  it('is false for a missing pathname', () => {
    expect(isPromoPage(null)).toBe(false);
    expect(isPromoPage(undefined)).toBe(false);
    expect(isPromoPage('')).toBe(false);
  });
});

describe('isPromoSuppressed', () => {
  const NOW = Date.UTC(2026, 10, 3, 12, 0, 0);
  const DAY = 24 * 60 * 60 * 1000;

  it('is not suppressed when nothing is stored', () => {
    // Also what a blocked/unavailable localStorage looks like (null).
    expect(isPromoSuppressed(null, NOW, 7)).toBe(false);
    expect(isPromoSuppressed(undefined, NOW, 7)).toBe(false);
    expect(isPromoSuppressed('', NOW, 7)).toBe(false);
  });

  it('is suppressed shortly after a dismissal', () => {
    expect(isPromoSuppressed(String(NOW - 60_000), NOW, 7)).toBe(true);
  });

  it('is still suppressed just inside the window', () => {
    expect(isPromoSuppressed(String(NOW - (7 * DAY - 1)), NOW, 7)).toBe(true);
  });

  it('returns once the window has passed', () => {
    expect(isPromoSuppressed(String(NOW - 7 * DAY), NOW, 7)).toBe(false);
    expect(isPromoSuppressed(String(NOW - 8 * DAY), NOW, 7)).toBe(false);
  });

  it('ignores garbage so it can never suppress the popup forever', () => {
    for (const junk of ['abc', 'NaN', 'undefined', '0', '-5', 'Infinity']) {
      expect(isPromoSuppressed(junk, NOW, 7)).toBe(false);
    }
  });

  it('ignores a timestamp from the future', () => {
    // A clock moved back (or a bad write) would otherwise suppress for days.
    expect(isPromoSuppressed(String(NOW + 30 * DAY), NOW, 7)).toBe(false);
  });

  it('honours a different window length', () => {
    expect(isPromoSuppressed(String(NOW - 2 * DAY), NOW, 1)).toBe(false);
    expect(isPromoSuppressed(String(NOW - 2 * DAY), NOW, 3)).toBe(true);
  });
});

describe('showsAnnouncementBar', () => {
  it.each(['/', '/products', '/products/some-slug', '/category/figurines', '/collections/naruto', '/blogs/a-post', '/shipping', '/about', '/orders', '/wishlist'])(
    'shows on %s',
    (path) => expect(showsAnnouncementBar(path)).toBe(true),
  );

  it('shows on a product detail page, unlike the popup', () => {
    // A visitor arriving from search lands here; the quiet bar should still reach them.
    expect(showsAnnouncementBar('/products/naruto-uzumaki-sage-mode')).toBe(true);
  });

  it.each(['/checkout', '/checkout/success', '/payments', '/payments/abc', '/login', '/credit'])(
    'never sits over %s',
    (path) => expect(showsAnnouncementBar(path)).toBe(false),
  );

  it('is not fooled by a look-alike prefix', () => {
    // An unanchored /^\/checkout/ would hide the bar on this.
    expect(showsAnnouncementBar('/checkout-guide')).toBe(true);
    expect(showsAnnouncementBar('/loginfaq')).toBe(true);
  });

  it('shows nothing for a missing pathname', () => {
    expect(showsAnnouncementBar(null)).toBe(false);
    expect(showsAnnouncementBar(undefined)).toBe(false);
    expect(showsAnnouncementBar('')).toBe(false);
  });
});
