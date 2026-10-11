'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Trash2, Package, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/landing/Navbar';
import LoginModal from '@/components/landing/LoginModal';
import AuthGuard from '@/components/shared/AuthGuard';
import EmptyState from '@/components/shared/EmptyState';
import { SkeletonCard } from '@/components/shared/LoaderSkeleton';
import { useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import { useAddToCart } from '@/hooks/useCart';
import { useToast } from '@/components/shared/Toast';
import {
  formatCurrency,
  formatDate,
  generateProductSlug,
  isPreOrderListing,
  isPurchasable,
  type ListingAvailability,
} from '@yukizi/utils';

/**
 * What a saved card says about its own availability, in the shape the shared
 * availability helpers take.
 *
 * Unreported stock deliberately becomes Infinity rather than being passed
 * through as `undefined`, and that is the whole reason this adapter exists:
 * this surface has always read an absent stock as AVAILABLE (its test was
 * `stock !== undefined && stock <= 0`), whereas `isPurchasable` reads an
 * absent stock as NOT available. The wishlist endpoint does not send stock at
 * all today, so handing `undefined` straight to the shared rule would grey out
 * and disable every ordinary saved card on the page. Infinity preserves
 * today's behaviour exactly and leaves the pre-order branch as the only
 * change.
 */
function savedAvailability(product: any): ListingAvailability {
  return {
    stock: product?.stock ?? Infinity,
    preOrderDeliveryDate: product?.preOrderDeliveryDate,
  };
}

export default function WishlistPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: wishlist, isLoading, isError } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();
  const { toast } = useToast();

  const items = wishlist?.items ?? [];

  const handleRemove = (productId: string) => {
    // No success toast: the row disappears from the list, which says it already.
    // The failure toast stays -- nothing else would tell the shopper it did not work.
    removeFromWishlist.mutate(productId, {
      onError: () => toast('Failed to remove item', 'error'),
    });
  };

  const handleAddToCart = (productId: string) => {
    const item = items.find((i: any) => i.productId === productId);
    const product = item?.product;
    const targetProductId = (product as any)?.bestListingId || productId;
    const imgUrl = (typeof product?.images?.[0] === 'string' ? product.images[0] : (product?.images?.[0] as any)?.url);
    addToCart.mutate({
      productId: targetProductId,
      quantity: 1,
      productName: product?.name || 'Product',
      price: product?.price,
      mrp: product?.mrp,
      image: imgUrl,
      imageUrl: imgUrl,
      images: imgUrl ? [imgUrl] : [],
      // Carried onto the cart line, like every other add-to-cart payload. A
      // pre-order that reaches the bag without its date is an ordinary line
      // as far as everything downstream can tell: local-cart derives the
      // quantity ceiling from stock, the cart drawer labels it by stock, and
      // checkout's mixed-bag guard cannot see it at all.
      preOrderDeliveryDate: product?.preOrderDeliveryDate ?? undefined,
    }, {
      onSuccess: () => toast('Added to bag', 'success'),
      onError: () => toast('Failed to add to bag', 'error'),
    });
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#f2fcf6] relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-pink-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#e6fa64] rounded-full mix-blend-multiply filter blur-[150px] opacity-30 pointer-events-none" />

        <Navbar showUserActions onLoginClick={() => setIsLoginOpen(true)} />

        <div className="pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-20 px-[4vw] w-full max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
            </div>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>

          {/* Content */}
          {isLoading && items.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : /* A failed refresh keeps the last good list rather than
                 replacing it with an error. */ isError && items.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Unable to load wishlist"
              description="Please try again later"
            />
          ) : items.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="Your wishlist is empty"
              description="Save products you love and come back to them later"
              actionLabel="Browse Products"
              actionHref="/"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {items.map((item) => {
                  const product = item.product;
                  const rawImage = product?.images?.[0];
                  const imageSrc = typeof rawImage === 'string' ? rawImage : (rawImage as any)?.url;
                  // Both the label and the Add button come from the one shared
                  // rule, so this page can no longer disagree with the product
                  // page about whether a saved item can be bought.
                  const availability = savedAvailability(product);
                  const isPreOrder = isPreOrderListing(availability);
                  const isOutOfStock = !isPurchasable(availability);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-sm overflow-hidden group"
                    >
                      {/* Product Image */}
                      <Link href={`/products/${generateProductSlug(product?.name || 'Product', item.productId, product?.slug)}`} className="block relative h-48 bg-gray-50 overflow-hidden">
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={product?.name ?? 'Product'}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300" />
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="p-5 space-y-3">
                        <Link href={`/products/${generateProductSlug(product?.name || 'Product', item.productId, product?.slug)}`}>
                          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors">
                            {product?.name ?? 'Product'}
                          </h3>
                        </Link>

                        {product?.manufacturer && (
                          <p className="text-xs text-gray-500">{product.manufacturer}</p>
                        )}

                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(product?.price ?? 0)}
                          </span>
                          {product?.mrp && product.mrp > (product.price ?? 0) && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.mrp)}
                            </span>
                          )}
                        </div>

                        {/* Mutually exclusive by construction: isPurchasable is
                            true for every pre-order, so isOutOfStock can never
                            be true for one. Written as a ternary so it stays
                            that way. Numbered primary shades, never
                            `bg-primary/15` — primary.DEFAULT is
                            `hsl(var(--primary))` with no <alpha-value>
                            placeholder, so an opacity variant compiles to
                            nothing and the badge renders unstyled. */}
                        {isPreOrder ? (
                          <span className="inline-flex w-fit items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                            Pre-order · expected {formatDate(availability.preOrderDeliveryDate!)}
                          </span>
                        ) : isOutOfStock ? (
                          <p className="text-xs text-red-500 font-medium">Out of stock</p>
                        ) : null}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => handleAddToCart(item.productId)}
                            disabled={addToCart.isPending || isOutOfStock}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 text-white text-sm font-semibold rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Add to Bag
                          </button>
                          <button
                            onClick={() => handleRemove(item.productId)}
                            disabled={removeFromWishlist.isPending}
                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
<LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      </main>
    </AuthGuard>
  );
}
