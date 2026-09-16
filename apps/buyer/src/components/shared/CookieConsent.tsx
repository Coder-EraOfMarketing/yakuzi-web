'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { applyConsent, hasStoredConsent, saveConsent } from '@/lib/cookie-consent';

/**
 * Minimal cookie-consent bar, fixed to the TOP of the viewport.
 *
 * Honest by construction: the site sets no ad/tracking pixels at all — the
 * only non-essential cookie is the first-party analytics visitor id
 * (yz_vid). Declining analytics genuinely disables the tracker and removes
 * that cookie (tracker.disable()), so the choice offered is the choice
 * enforced. Essential cookies (checkout/session) cannot be toggled because
 * the store cannot function without them — shown locked, per standard
 * consent-UI practice.
 *
 * Renders nothing until mounted (consent state lives in localStorage), so
 * it adds zero server HTML and zero CLS — it overlays the page rather than
 * pushing it down.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);

  useEffect(() => {
    if (!hasStoredConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const decide = (analytics: boolean) => {
    saveConsent({ analytics });
    applyConsent(analytics);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="glass-chrome fixed inset-x-0 top-0 z-[120] border-b border-white/20 shadow-md"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-2.5 sm:px-6">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-white sm:text-sm">
            We use essential cookies to run the store and one optional analytics cookie to
            understand how it&rsquo;s used.{' '}
            <Link href="/cookie-policy" className="underline underline-offset-2 hover:opacity-80">
              Cookie policy
            </Link>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPrefs((v) => !v)}
              aria-expanded={showPrefs}
              className="rounded-full border border-white/40 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10 sm:text-sm"
            >
              Preferences
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#562996] transition-colors hover:bg-purple-50 sm:text-sm"
            >
              Accept
            </button>
          </div>
        </div>

        {showPrefs && (
          <div className="flex flex-col gap-2 border-t border-white/20 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5 text-xs text-white sm:flex-row sm:items-center sm:gap-5 sm:text-sm">
              <label className="flex items-center gap-2 opacity-80">
                <input type="checkbox" checked disabled className="h-3.5 w-3.5 accent-white" />
                Essential (required — cart, checkout, sign-in)
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={analyticsOn}
                  onChange={(e) => setAnalyticsOn(e.target.checked)}
                  className="h-3.5 w-3.5 accent-white"
                />
                Analytics (anonymous, first-party only)
              </label>
            </div>
            <button
              type="button"
              onClick={() => decide(analyticsOn)}
              className="self-start rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-[#562996] transition-colors hover:bg-purple-50 sm:self-auto sm:text-sm"
            >
              Save choices
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
