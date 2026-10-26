// Types
export type {
  User,
  Product,
  Order,
  OrderItem,
  Payout,
  OrderStatus,
  ApprovalStatus,
  ProductStatus,
  DiscountType,
  DiscountDetails,
  DiscountFormDetails,
  ProductPayload,
  // A per-seller offer on a product. Exported because availability.ts points
  // callers at it as a type that declares preOrderDeliveryDate, and that
  // pointer has to resolve from the package root, not just the /types subpath.
  MarketplaceListing,
  Suggestion,
  CategoryItem,
  SubCategoryItem,
  ExtraField,
} from './types';

// Pricing Engine
export {
  calculatePricing,
  formatPricingSummary,
  requiresDiscountPercent,
  requiresBuyGet,
  requiresBonusProductName,
  isSpecialPriceType,
  getSellingPrice,
  getEffectiveDiscountPercent,
  variantShippingTotal,
  VALID_GST_PERCENTAGES,
} from './pricing';

export type {
  PricingDiscountType,
  DiscountFormInput,
  PricingOutput,
  VariantShippingSource,
  VariantShippingFallback,
} from './pricing';

// Currency formatting
export { formatCurrency, parseCurrency, formatNumber, formatCompact } from './formatCurrency';

// Date formatting
export { formatDate, formatRelativeTime, toISODateString, formatDateTime } from './formatDate';

// Availability — "for sale" is not the same question as "in stock"
export { isPreOrderListing, isPurchasable, maxOrderableQty } from './availability';
export type { ListingAvailability } from './availability';

// Pagination
export {
  calculatePagination,
  getOffset,
  getPageNumbers,
  DEFAULT_PAGINATION,
  type PaginationParams,
  type PaginatedResponse,
} from './pagination';

// Validators
export {
  isValidPhone,
  isValidEmail,
  isValidOtp,
  isValidPincode,
  isValidGST,
  isValidPAN,
  phoneSchema,
  emailSchema,
  otpSchema,
  pincodeSchema,
  gstSchema,
  panSchema,
  discountFormDetailsSchema,
  productFormSchema,
} from './validators';

export type { ProductFormValues } from './validators';
// Slugs
export { generateProductSlug, parseProductIdFromSlug } from './slugs';

// Banner media — whether a banner slot holds a picture or a video
export { isVideoUrl, isVideoFile, BANNER_ACCEPT } from './media';

// What a front-end should do with a 401: refresh, queue, or end the session.
// Shared so the seller portal and (once it is fixed too) the admin panel apply
// one tested policy instead of a hand-rolled logout each.
export { decideOn401, isAuthEndpoint } from './session-refresh';
export type { RefreshDecision, Refresh401Input } from './session-refresh';
