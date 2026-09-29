/**
 * Everyone credited on a post, and everything it is filed under.
 *
 * A post now carries both: `authorId`/`categoryId` — the primary of each,
 * which every part of this app read before co-authors existed — and the full
 * sets in `authors`/`categories`. Reading them in one place means the byline,
 * the author pages and the Article schema cannot disagree about who wrote
 * something, which is worse than any one of them being wrong.
 *
 * Falls back to the single field whenever the sets are absent: a post saved
 * before the join tables existed, a cached response from an older API, or any
 * caller that selects less. The primary is always first.
 */

export interface BlogPerson {
  name: string;
  bio?: string | null;
  avatar?: string | null;
}

export interface BlogCategoryRef {
  name: string;
  slug?: string | null;
}

/** Position ascending; the API orders these, but a cached or hand-built
 *  response might not, and byline order is not cosmetic. */
function byPosition<T extends { position?: number }>(links: T[]): T[] {
  return [...links].sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0));
}

function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function postAuthors(post: any): BlogPerson[] {
  const links = Array.isArray(post?.authors) ? post.authors : [];
  const fromSet = byPosition(links)
    .map((link: any) => link?.author)
    .filter((a: any) => a?.name);
  if (fromSet.length) return dedupeByName(fromSet);

  // `author` is an object on every current response, but has been a bare
  // name string in older shapes.
  const single = typeof post?.author === 'string' ? { name: post.author } : post?.author;
  return single?.name ? [single] : [];
}

export function postCategories(post: any): BlogCategoryRef[] {
  const links = Array.isArray(post?.categories) ? post.categories : [];
  const fromSet = byPosition(links)
    .map((link: any) => link?.category)
    .filter((c: any) => c?.name);
  if (fromSet.length) return dedupeByName(fromSet);

  const single = typeof post?.category === 'string' ? { name: post.category } : post?.category;
  return single?.name ? [single] : [];
}

/** Whether `name` is credited on this post at all, primary or not. */
export function isCreditedAuthor(post: any, matches: (name: string) => boolean): boolean {
  return postAuthors(post).some((a) => matches(a.name));
}
