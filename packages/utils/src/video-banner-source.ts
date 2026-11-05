import { isVideoUrl } from './media';

/** Viewports at or below this width get the mobile banner. Matches Tailwind's `sm` breakpoint minus one. */
export const NARROW_VIEWPORT_QUERY = '(max-width: 639px)';

/**
 * Which file a video banner should load for this viewport.
 *
 * A narrow viewport takes the mobile slot when there is one. If the slot that
 * applies holds a STILL image, no video is loaded at all and the image is shown
 * instead (a common, sensible combination: video on desktop, a light picture on
 * phones — or the other way round). An image is never handed to a <video>.
 */
export function pickBannerSource(params: {
  isNarrow: boolean;
  desktop: string;
  mobile?: string | null;
}): { videoSrc: string | null; still: string | null } {
  const { isNarrow, desktop, mobile } = params;
  if (isNarrow && mobile) {
    return isVideoUrl(mobile)
      ? { videoSrc: mobile, still: null }
      : { videoSrc: null, still: mobile };
  }
  return isVideoUrl(desktop)
    ? { videoSrc: desktop, still: null }
    : { videoSrc: null, still: desktop };
}

/**
 * A tiny inline script, emitted right after the <video> in the server-rendered
 * HTML, that gives the video its `src` BEFORE React hydrates.
 *
 * Why it exists: the viewport is unknown on the server, so the HTML used to
 * carry the DESKTOP file for everyone. A phone therefore started downloading
 * the desktop video the moment the HTML was parsed, then dropped it and started
 * the mobile one only after hydration — wasted bytes competing with the file it
 * actually needed, and a later start for that file. This picks the right file at
 * parse time, so only one is ever requested.
 *
 * It must make exactly the same choice as pickBannerSource (the component's
 * effect re-derives it after hydration and leaves the attribute alone when it
 * already matches — re-setting the same src would restart the load).
 *
 * The URLs come from an admin-editable record, so they are embedded as JSON with
 * `<` escaped: a URL containing `</script>` must not be able to end the script
 * and inject markup.
 */
export function bannerSourceBootstrap(desktop: string, mobile?: string | null): string {
  const data = JSON.stringify({
    d: desktop,
    m: mobile ?? null,
    dv: isVideoUrl(desktop),
    mv: mobile ? isVideoUrl(mobile) : false,
    q: NARROW_VIEWPORT_QUERY,
  }).replace(/</g, '\\u003c');

  return (
    `(function(){var c=${data},s=document.currentScript,v=s&&s.previousElementSibling;` +
    `if(!v||v.tagName!=='VIDEO')return;` +
    `var n=window.matchMedia(c.q).matches;` +
    `if(n&&c.m){if(!c.mv)return;v.setAttribute('src',c.m);return}` +
    `if(c.dv)v.setAttribute('src',c.d)})();`
  );
}
