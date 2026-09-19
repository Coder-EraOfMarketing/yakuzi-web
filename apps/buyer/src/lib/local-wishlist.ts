import { type Wishlist, type WishlistItem } from '@yukizi/api-client';

const STORAGE_KEY = 'yukizi_local_wishlist';

/** Fired in this tab whenever the local saved-items list is written. */
export const WISHLIST_CHANGED_EVENT = 'yukizi:wishlist-changed';

export const localWishlist = {
  get: (): Wishlist => {
    if (typeof window === 'undefined') return { items: [], total: 0 };
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { items: [], total: 0 };
    try {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        total: parsed.items?.length || 0,
      };
    } catch {
      return { items: [], total: 0 };
    }
  },

  set: (wishlist: Wishlist) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    // Named for the saved list rather than borrowing 'storage', which every
    // other local store also listens to. The browser's own cross-tab
    // 'storage' event is untouched.
    window.dispatchEvent(new Event(WISHLIST_CHANGED_EVENT));
  },

  addItem: (productData: any) => {
    const list = localWishlist.get();
    const prodId = productData.id || productData.productId;
    const existingIndex = list.items.findIndex(
      (item: any) => item.productId === prodId || item.id === prodId || item.product?.id === prodId
    );
    
    if (existingIndex > -1) {
      return list; // already exists
    } else {
      list.items.push({
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        productId: prodId,
        product: productData,
        createdAt: new Date().toISOString()
      });
    }
    
    list.total = list.items.length;
    localWishlist.set(list);
    return list;
  },

  removeItem: (productId: string) => {
    const list = localWishlist.get();
    list.items = list.items.filter(
      (i: any) => i.productId !== productId && i.id !== productId && i.product?.id !== productId
    );
    list.total = list.items.length;
    localWishlist.set(list);
    return list;
  },

  clear: () => {
    localWishlist.set({ items: [], total: 0 });
  }
};
