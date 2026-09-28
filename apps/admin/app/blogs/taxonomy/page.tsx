"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Pencil, Trash2, Users, Tags, X } from "lucide-react";
import toast from "react-hot-toast";
import { AdminLayout } from "@/components/layout/admin-layout";
import { Badge, Button, Input, Skeleton, Textarea } from "@/components/ui";
import {
  useBlogAuthors, useAdminBlogCategories,
  useUpdateBlogAuthor, useDeleteBlogAuthor,
  useUpdateBlogCategory, useDeleteBlogCategory,
} from "@/hooks/useBlogs";

/**
 * Renaming and deleting blog authors and categories.
 *
 * The API has had PUT and DELETE on both since the module shipped and nothing
 * ever called them, so the only thing an admin could do was create — and while
 * the list endpoints were broken, creating was also the only thing that
 * appeared to fail. The result was four authors named some case of "Yukizi"
 * and three overlapping categories that could not be touched from the panel.
 */
export default function BlogTaxonomyPage() {
  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-1">
              <ArrowLeft className="h-4 w-4" /> Back to blogs
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Authors &amp; categories</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Rename or remove the authors and categories your posts use.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AuthorsCard />
          <CategoriesCard />
        </div>
      </div>
    </AdminLayout>
  );
}

function CardShell({ icon: Icon, title, count, children }: {
  icon: React.ElementType; title: string; count?: number; children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
      className="glass-card rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {count !== undefined && <Badge>{count}</Badge>}
      </div>
      {children}
    </motion.section>
  );
}

/** Deleting something a post is using would orphan the post, and the API
 *  refuses it anyway — say so here rather than firing a request that fails. */
function useCountGuard(label: string) {
  return (posts: number) => {
    if (posts > 0) {
      toast.error(`This ${label} is used by ${posts} post${posts > 1 ? "s" : ""}. Move them first.`);
      return false;
    }
    return true;
  };
}

function AuthorsCard() {
  const { data: authors, isLoading, isError } = useBlogAuthors();
  const update = useUpdateBlogAuthor();
  const remove = useDeleteBlogAuthor();
  const guard = useCountGuard("author");

  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const startEdit = (id: string, currentName: string, currentBio?: string | null) => {
    setEditing(id);
    setName(currentName);
    setBio(currentBio ?? "");
  };

  const save = async (id: string) => {
    if (!name.trim()) { toast.error("An author needs a name."); return; }
    try {
      await update.mutateAsync({ id, payload: { name: name.trim(), bio: bio.trim() || null } });
      toast.success("Author updated.");
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not update that author.");
    }
  };

  const del = async (id: string, label: string, posts: number) => {
    if (!guard(posts)) return;
    if (!window.confirm(`Delete the author "${label}"? This can't be undone.`)) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Author deleted.");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not delete that author.");
    }
  };

  return (
    <CardShell icon={Users} title="Authors" count={authors?.length}>
      {isLoading && <Skeleton className="h-24 w-full" />}
      {isError && <p className="text-sm text-destructive">Could not load the authors.</p>}
      {authors?.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">No authors yet — create one from a post.</p>
      )}
      <ul className="divide-y divide-border/50">
        {(authors ?? []).map((a) => {
          const posts = a._count?.posts ?? 0;
          return (
            <li key={a.id} className="py-3 first:pt-0 last:pb-0">
              {editing === a.id ? (
                <div className="space-y-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" autoFocus />
                  <Textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short bio — published on the author page and in the post's author schema"
                  />
                  <div className="flex gap-1.5">
                    <Button type="button" size="sm" loading={update.isPending} onClick={() => save(a.id)} leftIcon={<Check className="h-3.5 w-3.5" />}>
                      Save
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)} leftIcon={<X className="h-3.5 w-3.5" />}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{a.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.bio || <span className="italic">No bio — weakens the byline</span>}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {posts} post{posts === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" size="sm" variant="ghost" onClick={() => startEdit(a.id, a.name, a.bio)} className="px-2">
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button" size="sm" variant="ghost" className="px-2 text-destructive"
                      disabled={posts > 0}
                      title={posts > 0 ? `Used by ${posts} post${posts > 1 ? "s" : ""}` : undefined}
                      onClick={() => del(a.id, a.name, posts)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </CardShell>
  );
}

function CategoriesCard() {
  const { data: categories, isLoading, isError } = useAdminBlogCategories();
  const update = useUpdateBlogCategory();
  const remove = useDeleteBlogCategory();
  const guard = useCountGuard("category");

  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const save = async (id: string) => {
    if (!name.trim()) { toast.error("A category needs a name."); return; }
    try {
      await update.mutateAsync({ id, payload: { name: name.trim(), slug: slug.trim() || undefined } });
      toast.success("Category updated.");
      setEditing(null);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not update that category.");
    }
  };

  const del = async (id: string, label: string, posts: number) => {
    if (!guard(posts)) return;
    if (!window.confirm(`Delete the category "${label}"? This can't be undone.`)) return;
    try {
      await remove.mutateAsync(id);
      toast.success("Category deleted.");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Could not delete that category.");
    }
  };

  return (
    <CardShell icon={Tags} title="Categories" count={categories?.length}>
      {isLoading && <Skeleton className="h-24 w-full" />}
      {isError && <p className="text-sm text-destructive">Could not load the categories.</p>}
      {categories?.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground">No categories yet — create one from a post.</p>
      )}
      <ul className="divide-y divide-border/50">
        {(categories ?? []).map((c) => {
          const posts = c._count?.posts ?? 0;
          return (
            <li key={c.id} className="py-3 first:pt-0 last:pb-0">
              {editing === c.id ? (
                <div className="space-y-2">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" autoFocus />
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="URL slug" />
                  <div className="flex gap-1.5">
                    <Button type="button" size="sm" loading={update.isPending} onClick={() => save(c.id)} leftIcon={<Check className="h-3.5 w-3.5" />}>
                      Save
                    </Button>
                    <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(null)} leftIcon={<X className="h-3.5 w-3.5" />}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">/{c.slug}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {posts} post{posts === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      type="button" size="sm" variant="ghost" className="px-2"
                      onClick={() => { setEditing(c.id); setName(c.name); setSlug(c.slug); }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button" size="sm" variant="ghost" className="px-2 text-destructive"
                      disabled={posts > 0}
                      title={posts > 0 ? `Used by ${posts} post${posts > 1 ? "s" : ""}` : undefined}
                      onClick={() => del(c.id, c.name, posts)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </CardShell>
  );
}
