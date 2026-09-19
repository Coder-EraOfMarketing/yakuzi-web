'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWishlist,
  addToWishlist as backendAddToWishlist,
  removeFromWishlist as backendRemoveFromWishlist,
  mergeWishlist,
  useAuth,
} from '@yukizi/api-client';
import { localWishlist, WISHLIST_CHANGED_EVENT } from '@/lib/local-wishlist';
import { track } from '@/lib/analytics/tracker';
import { useEffect } from 'react';

/**
 * Where a saved item lives.
 *
 * Signed in, the account is the only truth: saves follow the buyer between
 * phone and laptop and survive clearing the browser. Signed out, the list
 * lives in this browser, and the first time they sign in it is folded into
 * the account — nothing saved before logging in is lost.
 *
 * The browser copy is deliberately never written while signed in. A mirror
 * would look harmless but resurrects the dead: remove an item on the laptop,
 * and the phone's stale copy would push it straight back on the next merge.
 * Signed in, the optimistic cache below is what keeps the icons instant.
 */
export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleStorage = () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    };
    // This tab's own writes, and another tab's. Deliberately not a bare
    // 'storage' dispatch: the cart fires one on every tap of +, and hearing
    // those meant a saved-items request the buyer never asked for.
    window.addEventListener(WISHLIST_CHANGED_EVENT, handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(WISHLIST_CHANGED_EVENT, handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['wishlist', isAuthenticated],
    queryFn: async () => {
      const local = localWishlist.get();
      if (!isAuthenticated) return local;

      // Anything saved before signing in goes up first, so the account read
      // below already includes it. Additive on the server, so a save made on
      // another device is never removed by this.
      if (local.items.length) {
        try {
          await mergeWishlist(
            local.items.map((i: any) => i.productId).filter(Boolean),
          );
          localWishlist.clear();
        } catch (e) {
          // Keep the browser copy and try again next load rather than lose it.
          console.error('Could not move saved items into the account', e);
        }
      }

      try {
        return await getWishlist();
      } catch (e) {
        // Signed in but the account list is unreachable. Show whatever this
        // browser still holds, and when it holds nothing, fail rather than
        // answer with an empty list — an empty answer is indistinguishable
        // from "nothing saved", and that is how a dropped request used to
        // wipe the drawer to "Your saved items list is empty". Failing keeps
        // the last good list on screen.
        console.error('Failed to fetch wishlist from the account', e);
        const cached = localWishlist.get();
        if (cached.items.length) return cached;
        throw e;
      }
    },
    staleTime: 15 * 1000,
    gcTime: 60 * 1000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  return useMutation({
    mutationFn: async (productData: any) => {
      const id = productData?.productId ?? productData?.id;
      if (isAuthenticated) {
        if (id) await backendAddToWishlist(id);
        return null;
      }
      return localWishlist.addItem(productData);
    },
    // Flip the bookmark icon the instant you click, rather than waiting on the
    // invalidate->refetch round trip — that chain of microtask hops is what
    // made the button feel like it "reacts late".
    onMutate: async (productData: any) => {
      const id = productData?.productId ?? productData?.id;
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      queryClient.setQueriesData({ queryKey: ['wishlist'] }, (old: any) => {
        if (!old || old.items?.some((item: any) => item.productId === id)) return old;
        return { ...old, items: [...(old.items || []), { id: `optimistic-${id}`, productId: id, product: productData }] };
      });
    },
    onSuccess: (_data, productData) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      track('wishlist_add', undefined, productData?.productId ?? productData?.id);
    },
    // The save did not stick — put the icon back rather than leave it lit.
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        if (productId) await backendRemoveFromWishlist(productId);
        return null;
      }
      return localWishlist.removeItem(productId);
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });
      queryClient.setQueriesData({ queryKey: ['wishlist'] }, (old: any) => {
        if (!old) return old;
        return { ...old, items: (old.items || []).filter((item: any) => item.productId !== productId) };
      });
    },
    onSuccess: (_data, productId) => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      track('wishlist_remove', undefined, productId);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
}
