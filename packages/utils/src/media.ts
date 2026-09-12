/**
 * Is this banner slot holding a video rather than a picture?
 *
 * Decided from the URL rather than from a column, deliberately. Every banner is
 * stored as a plain URL — hero desktop, hero mobile, and each slide of a
 * collection slideshow — and a stored "type" would have to be kept in step with
 * four of them per banner. It would also be a lie the moment somebody replaced
 * one file with the other kind. The upload path always ends in a real
 * extension (`storage.service.ts` builds keys as `<folder>/<uuid>.<ext>`), so
 * the URL already carries the answer.
 *
 * Query strings and fragments are ignored, so CDN URLs with cache-busting
 * parameters still resolve correctly.
 */
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov', '.m4v', '.ogv'];

export function isVideoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;

  // A data: URL carries its type up front instead of at the end.
  if (url.startsWith('data:')) return url.startsWith('data:video/');

  const withoutQuery = url.split(/[?#]/)[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((ext) => withoutQuery.endsWith(ext));
}

/** The same question about a File the admin has just picked, before upload. */
export function isVideoFile(file: { type?: string; name?: string } | null | undefined): boolean {
  if (!file) return false;
  if (file.type?.startsWith('video/')) return true;
  return isVideoUrl(file.name);
}

/** What the banner file pickers accept. Keep in step with the API's allow-list. */
export const BANNER_ACCEPT = 'image/*,video/mp4,video/webm,video/quicktime';
