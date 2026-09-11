import React, { useState, useEffect } from 'react';
import { Share2, Plus, Eye, ChevronRight, ChevronLeft, Filter, X, User, Package, Loader2, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { OrderFilterDrawer } from './OrderFilterDrawer';
import { OrderedProductsDrawer } from './OrderedProductsDrawer';
import { useOrderById, useOrders } from '@/hooks/useOrders';
import { useAuth } from '@yukizi/api-client';
import type { OrderFilters } from './OrderFilterDrawer';
import { useAddToWishlist, useWishlist, useRemoveFromWishlist } from '@/hooks/useWishlist';
import WishlistIcon from '@/components/shared/WishlistIcon';


function formatImageUrl(url: any): string | undefined {
  if (!url) return undefined;
  const path = typeof url === 'string' ? url : (url.url || url.path || (Array.isArray(url) ? url[0] : undefined));
  if (!path || typeof path !== 'string') return undefined;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const env = (typeof process !== 'undefined' ? process.env : {}) as any;
  const baseURL = env.NEXT_PUBLIC_API_BASE_URL || env.NEXT_PUBLIC_API_URL || '';
  const cleanBase = baseURL.replace(/\/api\/?$/, '');
  return `${cleanBase}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Stand-in for a product with no picture.
 *
 * This used to be a placehold.co URL with a green background, and an order
 * with no pictures at all fell back to a stock photo of medicine blister packs
 * left over from the pharma fork — neither belongs on this store. Drawn here
 * instead of fetched, so it costs no request and carries the site's own purple.
 */
function ProductInitials({ name, className = '' }: { name?: string; className?: string }) {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  const initials = words.length
    ? (words.length === 1
        ? words[0].slice(0, 2)
        : words[0][0] + words[words.length - 1][0]
      ).toUpperCase()
    : 'YK';

  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center rounded-xl bg-[#7B2FBE]/10 font-bold tracking-wide text-[#593696] ${className}`}
    >
      {initials}
    </div>
  );
}

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string | null;
  onLoginClick?: () => void;
}

export function OrderDrawer({ isOpen, onClose, orderId, onLoginClick }: OrderDrawerProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isOrderedProductsOpen, setIsOrderedProductsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: wishlistData } = useWishlist();
  const { mutate: addToWishlist } = useAddToWishlist();
  const { mutate: removeFromWishlist } = useRemoveFromWishlist();


  useEffect(() => {
    setSelectedOrderId(null);
  }, [orderId]);

  const { isAuthenticated } = useAuth();
  // No page/limit: /orders returns the buyer's whole history, so paging the
  // endpoint ignores only read as a 50-order cap that was never enforced.
  // Calling it identically in both drawers also lets them share one cached
  // result instead of fetching the same list twice.
  const { data: allOrdersData, isLoading: isLoadingAllOrders } = useOrders();
  const allOrders = Array.isArray(allOrdersData) ? allOrdersData : ((allOrdersData as any)?.data || (allOrdersData as any)?.data?.orders || []);

  const effectiveOrderId = selectedOrderId || orderId || (allOrders.length > 0 ? allOrders[0].id : '');

  const { data: orderData } = useOrderById(effectiveOrderId || '');
  const order = (orderData as any)?.data || orderData;

  const os = order?.orderStatus || order?.status || 'PLACED';
  const displayStatus = os.replace(/_/g, ' ');

  let orderMonth = 'JAN', orderYear = '2026';
  if (order?.createdAt) {
    const d = new Date(order.createdAt);
    orderMonth = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    orderYear = d.getFullYear().toString();
  }

  // year was hardcoded to '2026', so this list showed only orders placed in
  // 2026 and would have emptied itself in January. Everything else about this
  // drawer's filter is unchanged.
  const [filters, setFilters] = useState<OrderFilters>({
    paymentStatus: 'All',
    orderStatus: 'All orders',
    year: 'All',
    month: 'All'
  });

  const filteredOrders = React.useMemo(() => {
    return allOrders.filter((o: any) => {
      // Payment Status
      if (filters.paymentStatus !== 'All') {
        const pm = (o.paymentMethod || 'COD').toUpperCase();
        if (pm !== filters.paymentStatus.toUpperCase()) return false;
      }
      
      // Order Status
      if (filters.orderStatus !== 'All orders') {
        const os = (o.status || o.orderStatus || 'PLACED').toUpperCase();
        const target = filters.orderStatus.toUpperCase();
        if (target === 'IN TRANSIT / PLACED') {
           if (os !== 'PLACED' && os !== 'PENDING' && os !== 'IN TRANSIT') return false;
        } else if (os !== target) return false;
      }

      const d = new Date(o.createdAt || new Date());
      
      // Year
      if (filters.year !== 'All') {
        if (d.getFullYear().toString() !== filters.year) return false;
      }
      
      // Month
      if (filters.month !== 'All') {
        const mNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
        if (mNames[d.getMonth()] !== filters.month) return false;
      }
      
      return true;
    });
  }, [allOrders, filters]);

  const allOrderedItems = React.useMemo(() => {
    // Each item needs to carry its own order back-reference - the click
    // handler on an individual product card uses this to select that
    // item's actual order, not whatever order happened to be selected
    // (or the newest one) before the click.
    const all = filteredOrders.flatMap((o: any) =>
      (o.items || o.orderItems || []).map((item: any) => ({ ...item, order: o })),
    );
    return all;
  }, [filteredOrders]);

  const items = allOrderedItems;

  return (
    <>
      {/* Full Page View */}
      <div
        className={`fixed inset-0 w-full h-full glass-overlay z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
      >
        <div className="w-full min-h-screen relative flex flex-col px-4 sm:px-6 md:px-8 py-6">
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 bg-white/80 hover:bg-white rounded-full z-50 transition-colors">
            <X className="w-6 h-6" />
          </button>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
            <User className="w-16 h-16 text-purple-200 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Login to View Orders</h3>
            <p className="text-sm text-gray-400 max-w-[280px] mb-6">
              Please sign in to your account to view and track your orders.
            </p>
            <button 
              onClick={() => {
                onClose();
                onLoginClick?.();
              }}
              className="bg-[#7B2FBE] hover:bg-[#6a28a6] text-white font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full shadow-sm transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : isLoadingAllOrders ? (
          <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-2" />
            <p className="text-sm text-gray-400 font-medium">Loading orders...</p>
          </div>
        ) : allOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] px-6 text-center">
            <Package className="w-16 h-16 text-purple-200 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h3>
            <p className="text-sm text-gray-400 max-w-[280px]">
              You haven&apos;t placed any orders yet. Once you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="pr-6 pl-14 py-6 border-b border-white/50 relative">
              {/* Back Button on Left */}
              <button onClick={onClose} className="absolute left-4 top-6 text-gray-400 hover:text-gray-800 transition-colors p-1.5 z-[80]">
                <ChevronLeft className="w-8 h-8" />
              </button>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-4xl font-bold text-gray-800 mr-2">Orders</h2>
                  {filters.paymentStatus !== 'All' && <span className="bg-[#7B2FBE] text-white text-sm px-4 py-2 rounded-full shadow-sm font-bold uppercase">{filters.paymentStatus}</span>}
                  {filters.orderStatus !== 'All orders' && <span className="bg-[#7B2FBE] text-white text-sm px-4 py-2 rounded-full shadow-sm font-bold capitalize">Status : {filters.orderStatus.toLowerCase()}</span>}
                  {filters.month !== 'All' && <span className="bg-[#7B2FBE] text-white text-sm px-4 py-2 rounded-full shadow-sm font-bold uppercase">{filters.month}</span>}
                  {filters.year !== 'All' && <span className="bg-[#7B2FBE] text-white text-sm px-4 py-2 rounded-full shadow-sm font-bold">{filters.year}</span>}
                </div>

                <div className="flex items-center gap-3.5 mr-12">
                  <span className="bg-[#7B2FBE] text-white text-sm px-4 py-2 rounded-full shadow-sm font-bold">All orders</span>
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="text-gray-400 hover:text-[#7B2FBE] transition-colors p-2"
                  >
                    <Filter className="w-7 h-7" />
                  </button>
                </div>
              </div>
            </div>

            {/* The drawer is where a buyer lands after paying, so the invoice
                is offered here rather than only on the order page. */}
            {effectiveOrderId && (
              <div className="px-6 pt-4">
                <Link
                  href={`/orders/${effectiveOrderId}/invoice`}
                  className="glass-panel flex items-center justify-center gap-2 w-full rounded-full py-3 text-sm font-bold text-[#593696] transition-colors hover:bg-white/70"
                >
                  <FileText className="w-4 h-4" />
                  View tax invoice
                </Link>
              </div>
            )}

            {/* Ordered Products Section */}
            <div className="px-6 py-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer group"
                onClick={() => setIsOrderedProductsOpen(true)}
              >
                <h3 className="text-2xl font-bold text-gray-700">Ordered Products</h3>
                <ChevronRight className="w-7 h-7 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-2 px-2 snap-x">
                {items.map((item: any, index: number) => {
                  const product = item.sellerOffer || item.product || {};
                  const name = product.name || product.variant?.catalogProduct?.name || 'Unknown Product';
                  const imageUrl = formatImageUrl(product.variant?.catalogProduct?.images?.[0]) || product?.images?.[0]?.url || product?.images?.[0] || product?.image || null;

                  const currentProductId = product?.id || item?.productId || `prod-${index}`;
                  const isSaved = wishlistData?.items?.some(
                    (wItem: any) => wItem.productId === currentProductId || wItem.product?.id === currentProductId || wItem.id === currentProductId
                  );
                  
                  return (
                    <div key={item.id || index} onClick={() => { setSelectedOrderId(item.order?.id || item.orderId || null); setIsOrderedProductsOpen(true); }} className="glass-panel min-w-[150px] rounded-[18px] p-3 relative transition-shadow hover:shadow-lg snap-center cursor-pointer">
                      <div className="flex justify-end items-start mb-2">
                        <button className="text-gray-500 hover:text-[#7B2FBE] transition-colors" onClick={(e) => e.stopPropagation()}>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="h-28 flex items-center justify-center mb-2 overflow-hidden">
                         {imageUrl ? (
                           <img
                              src={imageUrl}
                              className="h-full object-contain"
                              alt={name}
                              loading="lazy"
                              decoding="async"
                           />
                         ) : (
                           <ProductInitials name={name} className="h-full w-full text-lg" />
                         )}
                      </div>
                      <div
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          // No toast: the ribbon icon already fills/empties to show the result.
                          if (isSaved) {
                            removeFromWishlist(currentProductId);
                          } else {
                            addToWishlist(product);
                          }
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer hover:scale-105 transition-transform"
                      >
                        <WishlistIcon 
                          isFilled={isSaved} 
                          preserveAspectRatio="none" 
                          className={`w-[24px] h-[18px] text-[#7B2FBE] ${isSaved ? 'fill-[#7B2FBE]' : 'fill-none'}`} 
                        />
                      </div>
                      <div className="flex justify-between items-center mt-2 border-t border-white/60 pt-2">
                         <span className="text-xs text-gray-500 font-medium truncate w-20">{name}</span>
                          <button className="flex items-center justify-center hover:scale-110 transition-transform" title="Quick view">
                            <Eye className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                          </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* My Orders Section (Grouped) */}
            <div className="px-6 py-2 pb-8">
              <div className="flex justify-between items-center mb-4 cursor-pointer group">
                <h3 className="text-2xl font-bold text-gray-700">My Orders</h3>
                <ChevronRight className="w-7 h-7 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-2 px-2 snap-x">
                
                {(() => {
                  const groups: Record<string, { dateString: string; orderIds: string[]; images: string[]; dateObj: Date }> = {};
                  filteredOrders.forEach((o: any) => {
                    const date = new Date(o.createdAt);
                    const dateString = date.toLocaleDateString('default', { day: 'numeric', month: 'short', year: 'numeric' });
                    
                    if (!groups[dateString]) {
                      groups[dateString] = { dateString, orderIds: [], images: [], dateObj: date };
                    }
                    
                    groups[dateString].orderIds.push(o.id);
                    
                    const oItems = o.items || o.orderItems || [];
                    const itemImages = oItems.map((item: any) => {
                      const product = item.sellerOffer || item.product || {};
                      return formatImageUrl(product.variant?.catalogProduct?.images?.[0]) || product?.images?.[0]?.url || product?.images?.[0] || product?.image;
                    }).filter(Boolean);
                    groups[dateString].images.push(...itemImages);
                  });
                  
                  const groupedOrders = Object.values(groups).sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

                  return groupedOrders.map((group, idx) => {
                    const images = [...group.images];
                    const isSelected = group.orderIds.includes(effectiveOrderId);

                    return (
                      <div key={group.dateString + idx} onClick={() => { setSelectedOrderId(group.orderIds[0]); setIsOrderedProductsOpen(true); }} className={`glass-panel min-w-[220px] max-w-[220px] rounded-[18px] p-3 snap-center cursor-pointer transition-all hover:shadow-lg ${isSelected ? 'ring-2 ring-[#7B2FBE]' : ''}`}>
                        <div className="flex justify-between items-center mb-3">
                           <span className={`text-base font-bold ${isSelected ? 'text-[#7B2FBE]' : 'text-gray-500'}`}>{group.dateString}</span>
                           <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="h-[160px] w-full">
                          {images.length === 0 ? (
                            // An order whose products have no pictures. Used to
                            // be a stock photo of pill packets from the pharma
                            // fork, on an anime store.
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl bg-[#7B2FBE]/10 text-[#593696]">
                              <Package className="h-8 w-8 opacity-70" />
                              <span className="text-xs font-semibold">
                                {group.orderIds.length} order{group.orderIds.length > 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : images.length === 1 ? (
                            <div className="bg-white/45 rounded-xl w-full h-full relative flex items-center justify-center overflow-hidden">
                              <img src={images[0]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                            </div>
                          ) : images.length === 2 ? (
                            <div className="grid grid-cols-2 gap-1.5 h-full">
                              <div className="bg-white/45 rounded-xl relative flex items-center justify-center overflow-hidden">
                                <img src={images[0]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                              </div>
                              <div className="bg-white/45 rounded-xl relative flex items-center justify-center overflow-hidden">
                                <img src={images[1]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                              </div>
                            </div>
                          ) : images.length === 3 ? (
                            <div className="grid grid-cols-2 gap-1.5 h-full">
                              <div className="flex flex-col gap-1.5 h-full min-h-0">
                                <div className="bg-white/45 rounded-xl flex-1 relative flex items-center justify-center overflow-hidden">
                                  <img src={images[0]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                </div>
                                <div className="bg-white/45 rounded-xl flex-1 relative flex items-center justify-center overflow-hidden">
                                  <img src={images[1]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                </div>
                              </div>
                              <div className="bg-white/45 rounded-xl relative flex items-center justify-center overflow-hidden">
                                <img src={images[2]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-1.5 h-full">
                              <div className="flex flex-col gap-1.5 h-full min-h-0">
                                <div className="bg-white/45 rounded-xl flex-1 relative flex items-center justify-center overflow-hidden">
                                  <img src={images[0]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                </div>
                                <div className="bg-white/45 rounded-xl flex-1 relative flex items-center justify-center overflow-hidden">
                                  <img src={images[1]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                </div>
                              </div>
                              <div className="flex flex-col gap-1.5 h-full min-h-0">
                                <div className="bg-white/45 rounded-xl flex-[2] relative flex items-center justify-center overflow-hidden">
                                  <img src={images[2]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                </div>
                                <div className="bg-white/45 rounded-xl flex-1 relative flex items-center justify-center overflow-hidden">
                                  <img src={images[3]} className="absolute inset-0 w-full h-full object-contain p-1" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  });
                })()}

                {allOrders.length === 0 && (
                  <div className="w-full text-center py-6 text-sm text-gray-400">
                    No recent orders found.
                  </div>
                )}

              </div>
            </div>
          </>
        )}

        {/* CSS for hiding scrollbar but keeping functionality */}
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
        </div>
      </div>

      {/* Render the inner filter drawer */}
      <OrderFilterDrawer 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters}
        onApplyFilters={(f) => setFilters(f)}
      />
      
      {/* Render the ordered products drawer */}
      <OrderedProductsDrawer 
        isOpen={isOrderedProductsOpen} 
        onClose={() => setIsOrderedProductsOpen(false)} 
        orderId={effectiveOrderId}
      />
    </>
  );
}
