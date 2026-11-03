'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isPromoPage, isPromoSuppressed } from '@yukizi/utils';
import styles from './PromoPopup.module.css';

/**
 * Free-shipping promo: the popup, and the small notification that follows it.
 * (The slim bar across the top is AnnouncementBar.)
 *
 * WHAT IT CLAIMS, AND WHY IT HAS NO END DATE: Yukizi's shipping policy and the
 * checkout both state that shipping is free on eligible orders across India
 * ("Free (Included in price)"). That is the standing policy, so this advertises
 * it as exactly that. Do NOT add a "till <date>" here unless the offer genuinely
 * changes: a deadline on something that is always free tells shoppers it is
 * normally charged, which is a misleading time-limited claim.
 *
 * Sequencing, so the two never stack: the popup comes first; the notification
 * appears once the popup is closed, or on its own when the popup has already
 * been seen this week. A visitor who clicks "Shop Now" is already acting on the
 * offer, so they get neither again.
 *
 * Change PROMO_ID to re-show everything to people who already dismissed it (a
 * new campaign); leave it alone for copy tweaks.
 */
const PROMO_ID = 'free-shipping-v1';
const POPUP_KEY = `yz_promo_${PROMO_ID}`;
const TOAST_KEY = `yz_promo_${PROMO_ID}_toast`;
const POPUP_DELAY_MS = 3000;
const TOAST_ALONE_DELAY_MS = 1800;
const TOAST_AUTOHIDE_MS = 12000;
const HIDE_FOR_DAYS = 7;

// Cheap and small (~130 KB together), so they are preloaded as soon as the
// popup is going to show, not when it opens — otherwise the hero pops in empty.
const IMAGES = {
  figure: { src: '/promo/free-ship-figure.webp', w: 560, h: 419 },
  cards: { src: '/promo/free-ship-cards.webp', w: 300, h: 603 },
  car: { src: '/promo/free-ship-car.webp', w: 520, h: 419 },
} as const;

const read = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Private mode / storage disabled. Treated as "never dismissed" — the refs
    // below still limit each piece to once per page load.
    return null;
  }
};

const remember = (key: string) => {
  try {
    window.localStorage.setItem(key, String(Date.now()));
  } catch {
    /* storage unavailable — nothing useful to do */
  }
};

function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 6h13v10H1z" />
      <path d="M14 9h4.5L22 12.5V16h-8z" />
      <circle cx="6" cy="17.5" r="2" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="17.5" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function PromoPopup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [toastTop, setToastTop] = useState<number | null>(null);
  const titleId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusTo = useRef<HTMLElement | null>(null);
  // Once per page load, whatever storage says and however many client-side
  // navigations follow.
  const popupShown = useRef(false);
  const toastShown = useRef(false);
  const toastTimer = useRef<number | undefined>(undefined);

  const dismissToast = useCallback(() => {
    window.clearTimeout(toastTimer.current);
    remember(TOAST_KEY);
    setToastTop(null);
  }, []);

  const showToast = useCallback(() => {
    if (toastShown.current) return;
    if (isPromoSuppressed(read(TOAST_KEY), Date.now(), HIDE_FOR_DAYS)) return;
    toastShown.current = true;
    // Sit just under the cookie banner when it is up (it is a fixed overlay at
    // the very top), otherwise just under the announcement bar. Covering the
    // banner's right-hand side would hide its "Accept all" button.
    const consent = document.querySelector('.yz-consent-bar');
    const below = consent ? Math.round(consent.getBoundingClientRect().bottom) + 12 : 56;
    setToastTop(Math.max(56, below));
    // Seen is seen: auto-dismiss counts, so it does not nag on every landing.
    toastTimer.current = window.setTimeout(dismissToast, TOAST_AUTOHIDE_MS);
  }, [dismissToast]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  useEffect(() => {
    if (!isPromoPage(pathname)) return;

    const popupSuppressed = popupShown.current || isPromoSuppressed(read(POPUP_KEY), Date.now(), HIDE_FOR_DAYS);

    if (popupSuppressed) {
      // Popup already seen this week: the notification stands alone.
      if (toastShown.current) return;
      const t = window.setTimeout(showToast, TOAST_ALONE_DELAY_MS);
      return () => window.clearTimeout(t);
    }

    for (const { src } of Object.values(IMAGES)) {
      const img = new window.Image();
      img.src = src;
    }

    const timer = window.setTimeout(() => {
      popupShown.current = true;
      returnFocusTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    }, POPUP_DELAY_MS);

    // Leaving for a page that must not show it (checkout, say) within the
    // delay cancels it.
    return () => window.clearTimeout(timer);
  }, [pathname, showToast]);

  const close = useCallback(
    (viaCta = false) => {
      remember(POPUP_KEY);
      setOpen(false);
      returnFocusTo.current?.focus?.();
      if (viaCta) {
        // Already acting on the offer — and about to land on another promo page.
        remember(TOAST_KEY);
        toastShown.current = true;
      } else {
        showToast();
      }
    },
    [showToast],
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !cardRef.current) return;
      // Keep Tab inside the dialog: the page behind it is inert to the user.
      const focusable = cardRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, close]);

  return (
    <>
      {toastTop !== null && (
        // role="status": announced politely, never steals focus — unlike the
        // dialog, this is not something the visitor has to deal with.
        <div className={styles.toast} role="status" style={{ top: toastTop }}>
          <span className={styles.toastIcon} aria-hidden="true">
            <TruckIcon className={styles.toastTruck} />
          </span>
          <div className={styles.toastText}>
            <strong className={styles.toastTitle}>Free shipping</strong>
            <span className={styles.toastSub}>On all eligible orders across India</span>
          </div>
          <button type="button" className={styles.toastClose} onClick={dismissToast} aria-label="Dismiss notification">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>
      )}

      {open && (
        <div
          className={styles.backdrop}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div ref={cardRef} className={styles.card} role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div className={styles.hero} aria-hidden="true">
              <span className={`${styles.shape} ${styles.shapeA}`} />
              <span className={`${styles.shape} ${styles.shapeB}`} />
              <span className={`${styles.sparkle} ${styles.sparkleA}`} />
              <span className={`${styles.sparkle} ${styles.sparkleB}`} />
              <span className={`${styles.sparkle} ${styles.sparkleC}`} />

              {/* Decorative: the headline beside them carries the meaning. */}
              <img className={`${styles.item} ${styles.cards}`} src={IMAGES.cards.src} width={IMAGES.cards.w} height={IMAGES.cards.h} alt="" decoding="async" />
              <img className={`${styles.item} ${styles.car}`} src={IMAGES.car.src} width={IMAGES.car.w} height={IMAGES.car.h} alt="" decoding="async" />
              <img className={`${styles.item} ${styles.figure}`} src={IMAGES.figure.src} width={IMAGES.figure.w} height={IMAGES.figure.h} alt="" decoding="async" />

              <div className={styles.badge}>
                <TruckIcon className={styles.badgeTruck} />
                <span className={styles.badgeBig}>FREE</span>
                <span className={styles.badgeSmall}>SHIPPING</span>
              </div>
            </div>

            <button ref={closeRef} type="button" className={styles.close} onClick={() => close()} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>

            <div className={styles.body}>
              <h2 id={titleId} className={styles.title}>
                <span className={styles.titleAccent}>Free shipping</span>{' '}
                <br />
                across India
              </h2>
              <p className={styles.lead}>Action figures, trading cards and die-cast cars from verified sellers, delivered free.</p>
              <Link href="/products" className={styles.cta} onClick={() => close(true)}>
                Shop Now
              </Link>
              <p className={styles.fine}>
                On all eligible orders. <Link href="/shipping" onClick={() => close(true)}>Shipping policy</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
