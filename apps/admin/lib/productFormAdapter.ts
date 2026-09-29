"use client";
import type { ProductFormAdapter } from "@yukizi/product-form";
import { apiClient } from "@/lib/apiClient";
import {
  adminCreateProductForSeller,
  adminUpdateProductForSeller,
  uploadProductMedia,
} from "@/api/admin.api";

async function getCategoriesWithSubs() {
  const { data } = await apiClient.get<{ data: any[] }>("/products/categories?includeSubs=true");
  const categories = data.data ?? [];
  // ProductForm.tsx reads `.subcategories` (lowercase) directly off each category for its
  // platform-fee lookup — normalize to match apps/seller/api/seller.api.ts's
  // getCategoriesWithSubs exactly, since the raw backend field is `subCategories`.
  return Array.isArray(categories)
    ? categories.map((c: any) => ({
        ...c,
        subcategories: c.subCategories || c.subcategories || [],
      }))
    : [];
}

async function searchSuggestions(query: string, type: "product" | "master" = "master") {
  const { data } = await apiClient.get<{ data: any[] }>("/products/suggestions", { params: { search: query, type } });
  return data.data ?? [];
}

async function getProductById(id: string) {
  const { data } = await apiClient.get<{ data: any }>(`/products/${id}`);
  return data.data;
}

export function useAdminProductFormAdapter(sellerId: string, onDone: () => void): ProductFormAdapter {
  return {
    createProduct: (payload) => adminCreateProductForSeller({ ...payload, sellerId }),
    getCategories: getCategoriesWithSubs,
    searchSuggestions,
    getSuggestionDetails: getProductById,
    uploadMedia: uploadProductMedia,
    onDone,
  };
}

/**
 * The editing counterpart. No sellerId: the listing already belongs to
 * someone, and the API resolves the owner from the listing rather than
 * trusting the client to say who it is — an admin editing a listing should
 * not be able to reassign it by sending a different id.
 *
 * createProduct is required by the adapter contract but unreachable here; the
 * edit screen always passes a productId, so ProductForm takes the update
 * path. It throws rather than silently creating a duplicate listing.
 */
export function useAdminProductEditAdapter(onDone: () => void): ProductFormAdapter {
  return {
    createProduct: () => {
      throw new Error("This screen edits an existing listing; it cannot create one.");
    },
    updateProduct: (productId, payload) => adminUpdateProductForSeller(productId, payload),
    getCategories: getCategoriesWithSubs,
    searchSuggestions,
    getSuggestionDetails: getProductById,
    uploadMedia: uploadProductMedia,
    onDone,
  };
}
