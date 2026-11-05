'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './PreOrderChip.module.css';

/**
 * "Pre-order · expected 5 Dec 2026" on one line, always.
 *
 * The string is long enough to wrap inside a 2-up product card, where it took
 * two lines and pushed the card's bottom row out of shape. It now stays on one
 * line and, only when it genuinely does not fit, scrolls right-to-left on a
 * loop instead of wrapping or being cut off.
 *
 * Whether it fits depends on the card's width, which depends on the viewport,
 * so it cannot be decided in CSS alone — the width is measured here and the
 * scrolling class is applied only when it is needed. A chip with room to
 * spare never moves.
 *
 * The scroll speed is derived from the overflow distance so a slightly-too-long
 * string does not crawl and a very long one does not race.
 */
export default function PreOrderChip({ label, className }: { label: string; className?: string }) {
  const windowRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLSpanElement>(null);
  const [scroll, setScroll] = useState<{ on: boolean; seconds: number }>({ on: false, seconds: 9 });

  const measure = useCallback(() => {
    const win = windowRef.current;
    const copy = copyRef.current;
    if (!win || !copy) return;
    // A fraction of a pixel of overflow is a rounding artefact, not a reason
    // to animate; 4px keeps borderline chips still.
    const overflow = copy.scrollWidth - win.clientWidth;
    if (overflow <= 4) {
      setScroll((s) => (s.on ? { on: false, seconds: s.seconds } : s));
      return;
    }
    // One full pass covers the text plus the gap before the second copy, at a
    // readable ~45px/s, and never shorter than 6s on a nearly-fitting chip.
    const seconds = Math.max(6, Math.round(((copy.scrollWidth + 28) / 45) * 10) / 10);
    setScroll({ on: true, seconds });
  }, []);

  useEffect(() => {
    measure();
    const win = windowRef.current;
    if (!win || typeof ResizeObserver === 'undefined') return;
    // The card resizes with the viewport and with its grid, so a one-shot
    // measurement on mount goes stale the first time the window is dragged.
    const ro = new ResizeObserver(measure);
    ro.observe(win);
    return () => ro.disconnect();
  }, [measure, label]);

  return (
    <span
      className={[styles.chip, scroll.on ? styles.scrolling : '', className].filter(Boolean).join(' ')}
      style={scroll.on ? ({ ['--yz-marquee-duration' as string]: `${scroll.seconds}s` } as React.CSSProperties) : undefined}
      // The scrolling copy is duplicated and may be mid-pass, so the accessible
      // name comes from here rather than from the visible text.
      aria-label={label}
      title={label}
    >
      <span className={styles.dot} aria-hidden="true" />
      <span ref={windowRef} className={styles.window}>
        <span className={styles.track}>
          <span ref={copyRef} className={styles.copy} aria-hidden="true">
            {label}
          </span>
          {/* Second copy exists only to make the loop seamless. */}
          {scroll.on && (
            <span className={styles.copy} aria-hidden="true">
              {label}
            </span>
          )}
        </span>
      </span>
    </span>
  );
}
