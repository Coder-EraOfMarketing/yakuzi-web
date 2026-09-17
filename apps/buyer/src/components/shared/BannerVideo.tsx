'use client';

import { useEffect, useRef, useState } from 'react';
import { isVideoUrl } from '@yukizi/utils';

/**
 * A banner slide that happens to be a video.
 *
 * Three things make this different from dropping a <video> tag in:
 *
 *  1. **It only plays while it is the slide on screen.** Banners are a stack of
 *     absolutely-positioned slides — every one is in the DOM. Left alone, four
 *     video banners would all decode at once behind each other.
 *  2. **It picks one source, not both.** A <picture> can offer a desktop and a
 *     mobile crop and let the browser choose. Video has no equivalent that
 *     browsers honour, so the choice is made here — after mount, from the
 *     viewport — and only the chosen file is ever fetched.
 *  3. **It is muted, inline and loops.** Autoplay is only permitted for muted
 *     video, and `playsInline` is what stops iOS taking it fullscreen.
 *
 * If the video cannot play — a codec the browser refuses, a file that 404s —
 * the poster (or the mobile/desktop still, when one was uploaded) stays on
 * screen rather than leaving a black rectangle.
 */
export function BannerVideo({
  desktop,
  mobile,
  poster,
  active = true,
  fit = 'contain',
  title,
  className = '',
}: {
  desktop: string;
  mobile?: string;
  /**
   * A still shown until the first video frame is decoded.
   *
   * Without one a `<video>` paints NOTHING before it has data, so whatever is
   * behind it shows through — and in the hero that is a white container. The
   * banner therefore went white every time the carousel reached a video slide
   * and stayed white until enough of the file had arrived. Pass any non-video
   * image from the same banner record; if the admin has uploaded none, the
   * `preload` change below is what closes the gap instead.
   */
  poster?: string;
  /** Is this the slide currently shown? Off-screen slides stay paused. */
  active?: boolean;
  fit?: 'contain' | 'cover';
  title?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);
  // Server-rendered as the desktop source; corrected on mount if the viewport
  // is narrow. Nothing is fetched until the effect below has run, because
  // preload is "none" and playback is what starts the download.
  const [isNarrow, setIsNarrow] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 639px)');
    const apply = () => setIsNarrow(query.matches);
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const source = isNarrow && mobile ? mobile : desktop;
  // The other slot can hold a still image — a common and sensible combination:
  // video on desktop, a light picture on phones. If the narrow slot is not a
  // video, show that picture instead of playing the desktop file down a mobile
  // connection.
  const narrowStill = isNarrow && mobile && !isVideoUrl(mobile) ? mobile : null;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (active && !failed) {
      // play() rejects when autoplay is refused; that is not an error worth
      // surfacing — the poster simply stays.
      void el.play().catch(() => undefined);
    } else {
      el.pause();
    }
  }, [active, failed, source]);

  const objectFit = fit === 'cover' ? 'object-cover' : 'object-contain';

  if (narrowStill || failed) {
    const still =
      narrowStill ?? (isVideoUrl(desktop) ? null : desktop) ?? poster ?? null;
    return still ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={still} alt={title || 'Yukizi banner'} className={`h-full w-full ${objectFit} ${className}`} />
    ) : (
      <div className={`h-full w-full bg-gray-100 ${className}`} aria-hidden="true" />
    );
  }

  return (
    <video
      ref={ref}
      src={source}
      className={`h-full w-full ${objectFit} ${className}`}
      // Autoplay is only allowed for muted video, and iOS needs playsInline or
      // it takes over the screen.
      muted
      loop
      playsInline
      autoPlay={active}
      {...(poster ? { poster } : {})}
      // 'metadata' rather than 'none' for the slides waiting their turn.
      //
      // 'none' meant a video slide started downloading only at the instant it
      // became visible, so the first thing the viewer saw was the empty
      // element over a white background. 'metadata' asks for just the header
      // and enough of the stream to establish the first frame, which is a few
      // KB rather than the whole file — cheap enough to do for every slide,
      // and it means the frame is ready before the slide arrives.
      preload={active ? 'auto' : 'metadata'}
      // A banner is decoration: it carries no controls and no sound, and its
      // meaning is in the title next to it.
      controls={false}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      onError={() => setFailed(true)}
    />
  );
}
