import { type Cart, type CartItem } from '@yukizi/api-client';
import { type ListingAvailability, maxOrderableQty } from '@yukizi/utils';

const STORAGE_KEY = 'yukizi_local_cart';

/** Fired in this tab whenever the local cart is written. */
export const CART_CHANGED_EVENT = 'yukizi:cart-changed';

/** A limit we can actually use; anything else counts as "not reported". */
const asLimit = (n: unknown): number | undefined =>
  typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : undefined;

/**
 * What a cart line says about its own availability. A line carries these on
 * itself (every add-to-cart surface passes them) and sometimes on `.product`.
 *
 * `preOrderDeliveryDate` has to be read here too, not just stock: a pre-order
 * has no stock at all, so a line that looked at stock alone read every
 * pre-order as a sold-out ordinary listing.
 */
const availabilityOf = (item: any): ListingAvailability => ({
  stock: asLimit(item?.stock ?? item?.product?.stock),
  maximumOrderQuantity: asLimit(
    item?.maximumOrderQuantity ?? item?.product?.maximumOrderQuantity,
  ),
  preOrderDeliveryDate:
    item?.preOrderDeliveryDate ?? item?.product?.preOrderDeliveryDate,
});

/**
 * Highest quantity an item may be raised to, given whatever we know about its
 * availability. Returns Infinity when nothing is known, so callers that never
 * supplied stock keep working exactly as before.
 *
 * The rule itself lives in maxOrderableQty — which is what makes a pre-order
 * addable: it ignores stock for a pre-order and applies the seller's per-order
 * maximum instead. Reading stock here directly meant a pre-order's `stock: 0`
 * produced a ceiling of 0, and `addItem` below drops anything that clamps to
 * zero, so the line was never pushed and the button did nothing at all.
 */
const ceilingFor = (item: any): number => {
  const availability = availabilityOf(item);

  // Nothing reported at all: unbounded, exactly as before. (Kept out of
  // maxOrderableQty's hands because its own fallback is a finite 9999.)
  if (
    availability.stock === undefined &&
    availability.maximumOrderQuantity === undefined
  ) {
    return Infinity;
  }

  return maxOrderableQty(availability);
};

export const localCart = {
  get: (): Cart => {
    if (typeof window === 'undefined') return { items: [], subtotal: 0, total: 0 };
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { items: [], subtotal: 0, total: 0 };
    try {
      const parsed = JSON.parse(stored);
      // Ensure it has everything needed by components — mapping total if missing
      return {
        ...parsed,
        subtotal: parsed.subtotal || 0,
        total: parsed.total || parsed.subtotal || 0,
      };
    } catch {
      return { items: [], subtotal: 0, total: 0 };
    }
  },

  set: (cart: Cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    // Tell this tab the cart changed. Named for the cart rather than borrowing
    // 'storage': that one is heard by everything holding local state, so every
    // cart write also made the saved-items list refetch itself — a request per
    // tap on +, and a chance to show an empty list if one of them fell over.
    // The browser's own cross-tab 'storage' event is untouched.
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
  },

  addItem: (itemData: any, replace: boolean = false) => {
    const cart = localCart.get();
    const existingIndex = cart.items.findIndex(item => item.productId === itemData.productId);
    
    if (existingIndex > -1) {
      const existing = cart.items[existingIndex];
      const nextQuantity = replace
        ? itemData.quantity
        : existing.quantity + itemData.quantity;

      // Fold in whatever the caller supplied alongside the quantity, so details
      // that change over time — stock in particular — are refreshed rather than
      // frozen at whatever they were when the item first went into the cart.
      // Keys the caller omitted are left untouched.
      const { quantity: _ignored, ...refreshed } = itemData;
      const merged = {
        ...existing,
        ...refreshed,
        id: existing.id,
        quantity: nextQuantity,
      };

      // Last line of defence: never let the stored quantity exceed the stock we
      // know about, whichever screen the item was added from.
      merged.quantity = Math.min(merged.quantity, ceilingFor(merged));
      cart.items[existingIndex] = merged;

      // Remove item if quantity is 0 or less
      if (cart.items[existingIndex].quantity <= 0) {
        cart.items.splice(existingIndex, 1);
      }
    } else if (itemData.quantity > 0) {
      // Adding something already out of stock clamps to zero, and a
      // zero-quantity line would go on to be synced and ordered. A pre-order
      // is NOT that case — ceilingFor gives it the seller's per-order maximum
      // rather than its (always zero) stock, so it survives this guard.
      const quantity = Math.min(itemData.quantity, ceilingFor(itemData));
      if (quantity > 0) {
        cart.items.push({
          id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          ...itemData,
          quantity,
        });
      }
    }
    
    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);
    cart.total = cart.subtotal;
    
    localCart.set(cart);
    return cart;
  },

  updateItem: (itemId: string, quantity: number) => {
    const cart = localCart.get();
    const existingIndex = cart.items.findIndex(i => i.id === itemId);
    
    if (existingIndex > -1) {
      // The cart drawer's +/- comes through here, so the same ceiling applies.
      // Clamping can land on zero when an item has sold out since it was added,
      // and a zero-quantity line left in the cart goes on to be synced and
      // ordered. Drop it instead.
      const clamped = Math.min(quantity, ceilingFor(cart.items[existingIndex]));
      if (clamped <= 0) {
        cart.items.splice(existingIndex, 1);
      } else {
        cart.items[existingIndex].quantity = clamped;
      }
      
      cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);
      cart.total = cart.subtotal;
      localCart.set(cart);
    }
    return cart;
  },

  removeItem: (itemId: string) => {
    const cart = localCart.get();
    cart.items = cart.items.filter(i => i.id !== itemId);
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);
    cart.total = cart.subtotal;
    localCart.set(cart);
    return cart;
  },

  clear: () => {
    localCart.set({ items: [], subtotal: 0, total: 0 });
  }
};
