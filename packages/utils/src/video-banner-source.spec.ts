import { describe, expect, it } from 'vitest';
import { bannerSourceBootstrap, NARROW_VIEWPORT_QUERY, pickBannerSource } from './video-banner-source';

const D = 'https://cdn.example/banners/desktop.mp4';
const MV = 'https://cdn.example/banners/mobile.mp4';
const MI = 'https://cdn.example/banners/mobile.jpg';
const DI = 'https://cdn.example/banners/desktop.jpg';

describe('pickBannerSource', () => {
  it('gives desktop the desktop file', () => {
    expect(pickBannerSource({ isNarrow: false, desktop: D, mobile: MV })).toEqual({ videoSrc: D, still: null });
  });

  it('gives a phone the mobile VIDEO when there is one', () => {
    expect(pickBannerSource({ isNarrow: true, desktop: D, mobile: MV })).toEqual({ videoSrc: MV, still: null });
  });

  it('gives a phone the mobile STILL and loads no video at all', () => {
    expect(pickBannerSource({ isNarrow: true, desktop: D, mobile: MI })).toEqual({ videoSrc: null, still: MI });
  });

  it('shows a desktop STILL and loads no video when the desktop slot is an image', () => {
    expect(pickBannerSource({ isNarrow: false, desktop: DI, mobile: MV })).toEqual({ videoSrc: null, still: DI });
    expect(pickBannerSource({ isNarrow: true, desktop: DI })).toEqual({ videoSrc: null, still: DI });
  });

  it('still plays the mobile video on a phone when only the desktop slot is an image', () => {
    expect(pickBannerSource({ isNarrow: true, desktop: DI, mobile: MV })).toEqual({ videoSrc: MV, still: null });
  });

  it('falls back to desktop when no mobile slot is set', () => {
    expect(pickBannerSource({ isNarrow: true, desktop: D })).toEqual({ videoSrc: D, still: null });
    expect(pickBannerSource({ isNarrow: true, desktop: D, mobile: null })).toEqual({ videoSrc: D, still: null });
    expect(pickBannerSource({ isNarrow: true, desktop: D, mobile: '' })).toEqual({ videoSrc: D, still: null });
  });
});

/** Runs the emitted script against a fake DOM, exactly as the browser would at parse time. */
function runBootstrap(script: string, opts: { narrow: boolean; sibling?: 'VIDEO' | 'DIV' | null }) {
  const attrs: Record<string, string> = {};
  const video = { tagName: opts.sibling ?? 'VIDEO', setAttribute: (k: string, v: string) => { attrs[k] = v; } };
  const queries: string[] = [];
  const fakeWindow = { matchMedia: (q: string) => { queries.push(q); return { matches: opts.narrow }; } };
  const fakeDocument = { currentScript: { previousElementSibling: opts.sibling === null ? null : video } };
  new Function('window', 'document', script)(fakeWindow, fakeDocument);
  return { attrs, queries };
}

describe('bannerSourceBootstrap — the script that runs before hydration', () => {
  it('sets the desktop source on a wide viewport', () => {
    const { attrs, queries } = runBootstrap(bannerSourceBootstrap(D, MV), { narrow: false });
    expect(attrs).toEqual({ src: D });
    expect(queries).toEqual([NARROW_VIEWPORT_QUERY]);
  });

  it('sets the MOBILE source on a phone, so the desktop file is never requested', () => {
    expect(runBootstrap(bannerSourceBootstrap(D, MV), { narrow: true }).attrs).toEqual({ src: MV });
  });

  it('sets no source at all on a phone whose mobile slot is a still image', () => {
    expect(runBootstrap(bannerSourceBootstrap(D, MI), { narrow: true }).attrs).toEqual({});
  });

  it('uses desktop on a phone when there is no mobile slot', () => {
    expect(runBootstrap(bannerSourceBootstrap(D), { narrow: true }).attrs).toEqual({ src: D });
  });

  it('makes the same choice as pickBannerSource for every combination', () => {
    for (const desktop of [D, DI]) {
      for (const mobile of [MV, MI, null, undefined]) {
        for (const narrow of [true, false]) {
          const picked = pickBannerSource({ isNarrow: narrow, desktop, mobile }).videoSrc;
          const { attrs } = runBootstrap(bannerSourceBootstrap(desktop, mobile), { narrow });
          expect(attrs.src ?? null).toBe(picked);
        }
      }
    }
  });

  it('never puts an image into the <video> (desktop still, wide viewport)', () => {
    expect(runBootstrap(bannerSourceBootstrap(DI, MV), { narrow: false }).attrs).toEqual({});
  });

  it('does nothing when the previous sibling is not a <video> or is missing', () => {
    expect(runBootstrap(bannerSourceBootstrap(D, MV), { narrow: false, sibling: 'DIV' }).attrs).toEqual({});
    expect(runBootstrap(bannerSourceBootstrap(D, MV), { narrow: false, sibling: null }).attrs).toEqual({});
  });

  it('cannot be broken out of by a URL containing </script> (the URL is admin-editable)', () => {
    const evil = 'https://x.example/"</script><img src=x onerror=alert(1)>/a.mp4';
    const script = bannerSourceBootstrap(evil, null);
    expect(script).not.toContain('</script>');
    expect(script).not.toMatch(/<img/i);
    // ...and it still round-trips to the exact original string at runtime.
    expect(runBootstrap(script, { narrow: false }).attrs).toEqual({ src: evil });
  });
});
