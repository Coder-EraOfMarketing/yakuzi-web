"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminBlogPosts, getAdminBlogPost, createAdminBlogPost, updateAdminBlogPost,
  updateAdminBlogPostStatus, deleteAdminBlogPost,
  getBlogAuthors, createBlogAuthor, updateBlogAuthor, deleteBlogAuthor,
  getAdminBlogCategories, createAdminBlogCategory, updateAdminBlogCategory, deleteAdminBlogCategory,
  type BlogListQuery, type UpsertBlogPostPayload,
} from "@/api/blogs.api";

const KEY = ["admin", "blogs"] as const;

export function useAdminBlogPosts(params: BlogListQuery = {}) {
  return useQuery({ queryKey: [...KEY, "list", params], queryFn: () => getAdminBlogPosts(params), staleTime: 30_000 });
}

export function useAdminBlogPost(id: string | undefined) {
  return useQuery({ queryKey: [...KEY, "one", id], queryFn: () => getAdminBlogPost(id as string), enabled: !!id });
}

export function useCreateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertBlogPostPayload) => createAdminBlogPost(payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<UpsertBlogPostPayload> & { createRedirect?: boolean } }) =>
      updateAdminBlogPost(id, payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateBlogPostStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "DRAFT" | "PUBLISHED" }) => updateAdminBlogPostStatus(id, status),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteBlogPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAdminBlogPost(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useBlogAuthors() {
  return useQuery({ queryKey: [...KEY, "authors"], queryFn: getBlogAuthors, staleTime: 60_000 });
}

export function useCreateBlogAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBlogAuthor,
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...KEY, "authors"] }),
  });
}

export function useAdminBlogCategories() {
  return useQuery({ queryKey: [...KEY, "categories"], queryFn: getAdminBlogCategories, staleTime: 60_000 });
}

export function useCreateBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminBlogCategory,
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...KEY, "categories"] }),
  });
}

// ─── Taxonomy editing ────────────────────────────────
// The API has had these routes since the module shipped; nothing called them,
// so a blog author or category could be created and never renamed or removed.

export function useUpdateBlogAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; bio?: string | null; avatar?: string | null } }) =>
      updateBlogAuthor(id, payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...KEY, "authors"] }),
  });
}

export function useDeleteBlogAuthor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteBlogAuthor,
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...KEY, "authors"] }),
  });
}

export function useUpdateBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { name?: string; slug?: string } }) =>
      updateAdminBlogCategory(id, payload),
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...KEY, "categories"] }),
  });
}

export function useDeleteBlogCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminBlogCategory,
    onSuccess: () => void qc.invalidateQueries({ queryKey: [...KEY, "categories"] }),
  });
}
