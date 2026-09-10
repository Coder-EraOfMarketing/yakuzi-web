import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Cache drop for admin edits, called by the API.
 *
 * An SEO override is fetched with `revalidate: 300` and the page that reads it
 * carries its own `revalidate = 300`, so an admin's save took up to ten
 * minutes to reach the storefront — long enough that people assumed the save
 * had failed and typed it again. The API pings this the moment a SeoMeta row
 * is written.
 *
 * Requires STOREFRONT_REVALIDATE_SECRET to be set here and to the same value
 * on the API. Unset, this answers 503 and nothing else changes: pages still
 * refresh on their timer, exactly as before.
 *
 * NOTE: next.config rewrites `/api/:path*` to the backend, but an array of
 * rewrites is applied AFTER filesystem routes, so this exact path wins — the
 * same way `/api/track` already does. A dynamic route under /api would not.
 */

export const dynamic = 'force-dynamic';

/** Enough for one entity; a caller asking for more is not one of ours. */
const MAX_ENTRIES = 20;

/** Site-relative paths only — no absolute URLs, no traversal. */
function cleanPaths(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (p): p is string =>
        typeof p === 'string' &&
        p.startsWith('/') &&
        !p.startsWith('//') &&
        !p.includes('://') &&
        !p.includes('..'),
    )
    .slice(0, MAX_ENTRIES);
}

function cleanTags(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((t): t is string => typeof t === 'string' && t.length > 0 && t.length <= 256)
    .slice(0, MAX_ENTRIES);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ revalidated: false, reason: 'not configured' }, { status: 503 });
  }
  if (req.headers.get('x-revalidate-secret') !== secret) {
    return NextResponse.json({ revalidated: false, reason: 'bad secret' }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as
    | { tags?: unknown; paths?: unknown }
    | null;
  if (!body) {
    return NextResponse.json({ revalidated: false, reason: 'bad body' }, { status: 400 });
  }

  const tags = cleanTags(body.tags);
  const paths = cleanPaths(body.paths);

  // Tags do the real work: the /seo/meta fetch is labelled with one, so
  // dropping it invalidates both the cached response and any render that used
  // it, wherever that page lives. Paths are a belt-and-braces extra for pages
  // the API can name outright.
  for (const tag of tags) revalidateTag(tag);
  for (const path of paths) revalidatePath(path);

  return NextResponse.json({ revalidated: true, tags, paths });
}
