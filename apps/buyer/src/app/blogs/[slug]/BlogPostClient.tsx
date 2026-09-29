'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import LoginModal from '@/components/landing/LoginModal';
import { useBlogBySlug } from '@/hooks/useBlogs';
import { sanitizeHtml } from '@/lib/sanitize';
import { prepareBlogContent } from '@/lib/seo/blog-content';
import { authorSlug } from '@/lib/seo/schema';
import { postAuthors } from '@/lib/seo/blog-taxonomy';

export default function BlogDetailPage({
  slug,
  initialPost,
  aiSummary,
  imageAlt,
}: {
  slug: string;
  initialPost?: any;
  /**
   * The admin's factual summary for AI search engines (Advanced SEO → AI
   * summary). Fetched server-side in page.tsx from the same SeoMeta record as
   * the metadata and the FAQ, and shown to readers too: a summary that is
   * only in the markup is hidden content, and an answer engine has no reason
   * to trust a claim the page does not make to a person.
   */
  aiSummary?: string | null;
  /** Admin ALT overrides for in-body images, keyed by image URL. */
  imageAlt?: Record<string, string> | null;
}) {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { data: blog, isLoading, isError, error } = useBlogBySlug(
    slug || '',
    initialPost ? { initialData: initialPost } : {},
  ) as any;

  // Heading anchors and image ALT, once per post rather than once per render.
  // Declared above the early returns so the hook order never changes.
  const prepared = useMemo(
    () =>
      prepareBlogContent(typeof blog?.content === 'string' ? blog.content : '', {
        imageAlt,
        fallbackAlt: blog?.title,
      }),
    [blog?.content, blog?.title, imageAlt],
  );

  // Log errors for debugging
  if (isError && error) {
    console.error('[BlogDetailPage] Error loading blog:', error);
  }

  if (!slug) {
    return (
      <div className="min-h-screen  bg-gray-50">
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />
        <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Invalid blog URL</h3>
            <p className="text-sm text-gray-500">The blog URL is missing or invalid.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <Navbar onLoginClick={() => setIsLoginOpen(true)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Button */}
        <button
          onClick={() => router.push('/blogs')}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </button>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
            <div className="h-64 bg-gray-200 rounded-2xl mt-6" />
            <div className="space-y-2 mt-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 bg-gray-100 rounded w-full" />
              ))}
            </div>
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Failed to load blog</h3>
            <p className="text-sm text-gray-500 mb-4">
              {error instanceof Error ? error.message : 'Unable to fetch this blog post. Please try again later.'}
            </p>
            <button
              onClick={() => router.push('/blogs')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-lime-600 text-white text-sm font-medium rounded-lg hover:bg-lime-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </button>
          </div>
        ) : !blog ? (
          <div className="text-center py-20">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Blog not found</h3>
            <p className="text-sm text-gray-500">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        ) : (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-4">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              {(() => {
                // Everyone credited, in byline order, each going somewhere:
                // the author page carries the bio and their other posts, and
                // is the URL the Person schema points at, so the two agree.
                const authors = postAuthors(blog);
                if (!authors.length) return null;
                return (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    <span className="flex flex-wrap items-center gap-x-1">
                      {authors.map((a, i) => (
                        <span key={a.name} className="flex items-center">
                          <Link
                            href={`/blogs/author/${authorSlug(a.name)}`}
                            className="hover:text-gray-900 hover:underline"
                          >
                            {a.name}
                          </Link>
                          {i < authors.length - 1 && (
                            <span aria-hidden className="mr-1">
                              {i === authors.length - 2 ? ' and' : ','}
                            </span>
                          )}
                        </span>
                      ))}
                    </span>
                  </span>
                );
              })()}
              {blog.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(blog.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              )}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-lime-50 text-lime-700 text-xs font-semibold px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {blog.coverImage && (
              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            )}

            {aiSummary && aiSummary.trim() && (
              // Answer-first, and the same text llms.txt carries for this post,
              // so what an assistant quotes is what the page says.
              <aside className="mb-8 rounded-2xl border border-lime-200 bg-lime-50/60 p-4 sm:p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-lime-800 mb-1.5">
                  In short
                </h2>
                <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                  {aiSummary.trim()}
                </p>
              </aside>
            )}

            {prepared.headings.length >= 3 && (
              // The anchors exist for Google and for assistants citing one
              // section; a contents list is what makes them reachable by the
              // reader too, and it is the cheapest internal linking a long
              // post has.
              <nav aria-label="On this page" className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  On this page
                </h2>
                <ol className="space-y-1.5 text-sm">
                  {prepared.headings.map((h) => (
                    <li key={h.id} className={h.level === 3 ? 'ml-4' : undefined}>
                      <a href={`#${h.id}`} className="text-gray-700 hover:text-lime-700 hover:underline">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {blog.content ? (
              <div
                // prose-a:text-lime-600 is a utility on the container, so it
                // beats the --tw-prose-links value the dark theme sets and no
                // remap can reach it. Lime 600 goes muddy on the dark ground;
                // 300 is the same hue at a step that reads on it.
                className="prose prose-gray max-w-none prose-headings:font-bold prose-a:text-lime-600 dark:prose-a:text-lime-300 prose-img:rounded-xl prose-headings:scroll-mt-24"
                // Anchors and image ALT are added first, then the whole lot —
                // author markup and ours alike — goes through the sanitiser.
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(prepared.html) }}
              />
            ) : (
              <p className="text-gray-500">No content available for this blog post.</p>
            )}
          </motion.article>
        )}
      </div>
    </div>
  );
}
