import styles from './TrustBadges.module.css';

/**
 * The three standing promises, shown just above the reviews on a product page.
 *
 * FREE SHIPPING HAS NO END DATE, deliberately — the shipping policy and the
 * checkout both state it as permanent ("Free (Included in price)"), so a
 * deadline here would present an always-free service as a limited offer. Same
 * rule as AnnouncementBar and PromoPopup; change all three together or none.
 *
 * The claims are the platform's own and hold for every listing, so this takes
 * no props: nothing here is per-product, and nothing here is invented about a
 * seller's item.
 */
const BADGES = [
  {
    label: 'Free Shipping',
    sub: 'Across India',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 6h13v10H1z" />
        <path d="M14 9h4.5L22 12.5V16h-8z" />
        <circle cx="6" cy="17.5" r="2" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="17.5" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: '100% Authentic',
    sub: 'Verified sellers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.5l7.5 3v6c0 4.6-3.1 8.6-7.5 10-4.4-1.4-7.5-5.4-7.5-10v-6z" />
        <path d="M8.75 11.9l2.2 2.2 4.3-4.4" />
      </svg>
    ),
  },
  {
    label: 'Best Quality',
    sub: 'Checked before dispatch',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="9" r="5.5" />
        <path d="M8.3 13.3L7 22l5-2.6L17 22l-1.3-8.7" />
      </svg>
    ),
  },
];

export default function TrustBadges({ className }: { className?: string }) {
  return (
    <ul className={className ? `${styles.strip} ${className}` : styles.strip} aria-label="Yukizi promises">
      {BADGES.map(({ label, sub, icon }) => (
        <li key={label} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
          <span className={styles.label}>{label}</span>
          {/* Hidden on phones by CSS, so it must not be the only place the
              claim is stated — the label above carries it. */}
          <span className={styles.sub}>{sub}</span>
        </li>
      ))}
    </ul>
  );
}
