'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { showsAnnouncementBar } from '@yukizi/utils';
import styles from './AnnouncementBar.module.css';

/**
 * Slim strip across the top of the storefront.
 *
 * Same standing claim as PromoPopup — free shipping across India on eligible
 * orders — and so, like it, NO end date. The checkout shows shipping as
 * "Free (Included in price)" and the shipping policy promises it permanently;
 * putting "till <date>" on that would present an always-free service as a
 * limited-time deal. Add a date only if the offer genuinely becomes one.
 *
 * Not dismissible: it is one quiet line, and unlike the popup there is nothing
 * to dismiss. Hidden on the payment and login steps (see showsAnnouncementBar).
 */
function SparkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.9 5.6L19.5 9.5l-5.6 1.9L12 17l-1.9-5.6L4.5 9.5l5.6-1.9L12 2zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14zM5 15l.7 2 2 .7-2 .7L5 20.4l-.7-2-2-.7 2-.7L5 15z" />
    </svg>
  );
}

export default function AnnouncementBar() {
  const pathname = usePathname();
  if (!showsAnnouncementBar(pathname)) return null;

  return (
    <div className={styles.bar} role="region" aria-label="Announcement">
      <SparkIcon className={styles.spark} />
      <span>
        Free shipping across India<span className={styles.extra}> on all eligible orders</span>!{' '}
        <Link href="/products" className={styles.link}>
          Shop now!
        </Link>
      </span>
    </div>
  );
}
