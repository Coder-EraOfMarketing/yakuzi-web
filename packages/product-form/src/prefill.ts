/**
 * Turns a saved product into the props ProductForm needs to open it for
 * editing.
 *
 * Lifted out of the seller's edit page so the admin's "edit on behalf of a
 * seller" screen can open the same listing the same way. Two copies of this
 * would drift within a release — it is a hundred lines of field archaeology,
 * reading each value from whichever of the offer, the variant or the listing
 * actually carries it, and a copy that falls behind silently prefills the
 * wrong price or blanks a required field.
 *
 * Nothing here is new behaviour: it is the seller page's mapping, moved.
 */

export interface ProductFormPrefill {
  defaultValues: Record<string, unknown>;
  initialOptions: any[];
  initialVariants: any[];
  initialPlatformFees: Record<string, number | undefined>;
  initialCategoryName?: string;
  initialSubcategoryName?: string;
  initialMasterId?: string;
  activeVariantId?: string;
}

/** A variant is meaningful only if it is not the implicit single "Default". */
function hasRealVariants(product: any): boolean {
  const variants = product?.variants;
  if (!variants || variants.length === 0) return false;
  if (variants.length > 1) return true;
  return !['Default', product?.name].includes(variants[0]?.name);
}

/** The listing row that corresponds to a variant, matched however it was stored. */
function listingForVariant(product: any, v: any) {
  return (product?.listings || []).find(
    (l: any) =>
      l.variantName === v.name ||
      l.variantName === v.options?.name ||
      l.variantId === v.id ||
      (l.variant && l.variant.id === v.id) ||
      (l.name && typeof l.name === 'string' && typeof v.name === 'string' && l.name.includes(v.name)),
  );
}

const DISCOUNT_TYPES: Record<string, string> = {
  PTR_DISCOUNT: 'ptr_discount',
  SAME_PRODUCT_BONUS: 'same_product_bonus',
  PTR_PLUS_SAME_PRODUCT_BONUS: 'ptr_discount_and_same_product_bonus',
  DIFFERENT_PRODUCT_BONUS: 'different_product_bonus',
  PTR_PLUS_DIFFERENT_PRODUCT_BONUS: 'ptr_discount_and_different_product_bonus',
  SPECIAL_PRICE: 'special_price',
};

export function buildProductFormPrefill(
  product: any,
  { productId, variantParam }: { productId: string; variantParam?: string | null },
): ProductFormPrefill {
  const productVariants = product?.variants || [];
  const productListings = product?.listings || [];

  let activeVariantId: string | undefined;
  if (variantParam) {
    activeVariantId = productVariants.find(
      (v: any) => v.name === variantParam || v.options?.name === variantParam,
    )?.id;
  }
  if (!activeVariantId && product && productId !== product.id) {
    activeVariantId =
      productVariants.find((v: any) => {
        const listing = listingForVariant(product, v);
        return listing?.id === productId || v.id === productId;
      })?.id || productId;
  }

  const activeVariant = activeVariantId
    ? productVariants.find((v: any) => v.id === activeVariantId)
    : undefined;
  const activeListing = activeVariant
    ? productListings.find(
        (l: any) =>
          l.variantName === activeVariant.name || l.variantName === activeVariant.options?.name,
      )
    : productListings.find((l: any) => l.id === productId);

  const resolvedSku =
    product?.sku || activeVariant?.sku || activeVariant?.options?.sku || activeListing?.sku ||
    product?.variant?.sku || '';
  const resolvedSerialNo =
    product?.serialNo || activeVariant?.serialNo || activeVariant?.options?.serialNo ||
    activeListing?.serialNo || product?.variant?.serialNo || '';
  const resolvedSpecifications =
    product?.specifications || activeVariant?.specifications ||
    activeVariant?.options?.specifications || activeListing?.specifications || '';
  // Packaging belongs to the listing, so read that first. Prefilling matters
  // more than it looks: the field is required, so without this someone
  // editing an unrelated field (a price, say) is blocked until they
  // re-answer a question already answered. Falls back to undefined rather
  // than a guess, which leaves the radio group genuinely unanswered.
  const resolvedBoxCondition = activeListing?.boxCondition || product?.boxCondition || undefined;

  const realVariants = hasRealVariants(product);

  return {
    activeVariantId,
    defaultValues: {
      product_name: product?.name,
      product_price: product?.mrp ?? product?.price,
      company_name: product?.manufacturer || '',
      chemical_combination: product?.chemicalComposition || '',
      categories: product?.categoryId ? [product.categoryId] : [],
      sub_categories: product?.subCategoryId ? [product.subCategoryId] : [],
      stock: product?.stock || 0,
      min_order_qty: product?.minimumOrderQuantity || 1,
      max_order_qty: product?.maximumOrderQuantity || 100,
      gst_percent: product?.gstPercent ?? product?.gst ?? 0,
      compare_at_price: product?.compareAtPrice || 0,
      is_tax_included: product?.masterProductId ? true : product?.isTaxIncluded || false,
      shipping_charges:
        product?.finalShippingPrice !== null && product?.finalShippingPrice !== undefined
          ? product.finalShippingPrice
          : 0,
      sku: resolvedSku,
      serialNo: resolvedSerialNo,
      specifications: resolvedSpecifications,
      box_condition: resolvedBoxCondition,
      delivery_text: product?.deliveryText
        ? String(parseInt(String(product.deliveryText).match(/\d+/)?.[0] || '0') || '')
        : '',
      image_list: Array.isArray(product?.images)
        ? product.images.map((img: any) => (typeof img === 'string' ? img : img.url)).filter(Boolean)
        : [],
      custom_extra_fields: product?.extraFields || [],
      discount_form_details:
        product?.discountFormDetails || {
          type: product?.discountType
            ? DISCOUNT_TYPES[product.discountType] || 'none'
            : 'none',
          ...product?.discountMeta,
          discountPercent:
            Number(product?.discount ?? product?.discountMeta?.discountPercent ?? 0) ?? undefined,
        },
    },
    initialPlatformFees: {
      commissionPercent: product?.commissionPercent ?? undefined,
      fixedFee: product?.fixedFee ?? undefined,
      commissionGstPercent: product?.commissionGstPercent ?? undefined,
      fixedFeeGstPercent: product?.fixedFeeGstPercent ?? undefined,
      shippingGstPercent: product?.shippingGstPercent ?? undefined,
    },
    initialOptions:
      product?.options && product.options.length > 0
        ? product.options
        : realVariants
          ? [
              {
                id: Math.random().toString(36).substr(2, 9),
                name: 'Variant',
                values: Array.from(
                  new Set(productVariants.map((v: any) => v.name || v.options?.name).filter(Boolean)),
                ),
              },
            ]
          : [],
    initialVariants: realVariants
      ? productVariants.map((v: any) => {
          const listing = listingForVariant(product, v);
          const derivedDiscount = listing
            ? listing.discountMeta?.discountPercent ?? listing.discountPercent ?? listing.discount
            : undefined;

          const vGstRaw =
            listing?.gstPercent ?? listing?.gst ?? v.gstPercent ?? v.options?.gstPercent ?? v.gst ?? v.gstValue;
          const vDiscountRaw =
            derivedDiscount ?? v.discountPercent ?? v.discount ?? v.options?.discountPercent ??
            v.options?.discount ?? v.discountMeta?.discountPercent;

          const vPrice = listing?.mrp ?? listing?.price ?? v.price ?? '';
          const vCompareAt = listing?.compareAtPrice ?? v.compareAtPrice ?? '';

          return {
            id: v.id || (listing?.id === productId ? productId : Math.random().toString(36).substr(2, 9)),
            name: v.name,
            price: vPrice.toString(),
            compareAtPrice: vCompareAt.toString(),
            gstPercent: vGstRaw !== undefined && vGstRaw !== null ? vGstRaw.toString() : '',
            discount: vDiscountRaw !== undefined && vDiscountRaw !== null ? vDiscountRaw.toString() : '',
            available: (listing?.stock ?? v.available ?? 0).toString(),
            image: v.image,
            sku: listing?.sku || v.sku || '',
            serialNo: listing?.serialNo || v.serialNo || '',
            shippingCharges:
              listing?.shippingCharges !== undefined && listing?.shippingCharges !== null
                ? listing.shippingCharges.toString()
                : v.shippingCharges !== undefined && v.shippingCharges !== null
                  ? v.shippingCharges.toString()
                  : '',
            shippingGstPercent: Number(listing?.shippingGstPercent ?? v.shippingGstPercent ?? 0),
            finalShippingPrice:
              listing?.finalShippingPrice !== undefined && listing?.finalShippingPrice !== null
                ? listing.finalShippingPrice.toString()
                : v.finalShippingPrice !== undefined && v.finalShippingPrice !== null
                  ? v.finalShippingPrice.toString()
                  : '',
          };
        })
      : [],
    initialCategoryName:
      typeof product?.category === 'object'
        ? product?.category?.name || product?.category?.id
        : product?.category,
    initialSubcategoryName:
      typeof product?.subCategory === 'object'
        ? product?.subCategory?.name || product?.subCategory?.id
        : product?.subCategory,
    initialMasterId: product?.masterProductId || product?.id || undefined,
  };
}
