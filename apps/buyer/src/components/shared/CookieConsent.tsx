'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import {
  applyConsent,
  getStoredConsent,
  hasStoredConsent,
  OPEN_PREFERENCES_EVENT,
  saveConsent,
} from '@/lib/cookie-consent';

/**
 * Minimal cookie-consent bar, fixed to the TOP of the viewport.
 *
 * Two opt-in categories, each honest about what it does:
 *   - Analytics: the first-party visitor id (yz_vid), anonymous. Declining it
 *     genuinely disables the tracker and removes the cookie.
 *   - Marketing: the Meta advertising Pixel (+ server Conversions API).
 *     Declining it means no Pixel loads and no ad event fires.
 * The choice offered is the choice enforced (see applyConsent). Essential
 * cookies (checkout/session) cannot be toggled — shown locked.
 *
 * Renders nothing until mounted (consent state lives in localStorage), so
 * it adds zero server HTML and zero CLS — it overlays the page rather than
 * pushing it down.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(true);
  const [marketingOn, setMarketingOn] = useState(true);

  useEffect(() => {
    if (!hasStoredConsent()) setVisible(true);

    // The footer's "Cookie preferences" link reopens the bar, pre-filled with
    // the current choices and expanded so the toggles are right there.
    const onReopen = () => {
      const stored = getStoredConsent();
      if (stored) {
        setAnalyticsOn(stored.analytics);
        setMarketingOn(stored.marketing);
      }
      setShowPrefs(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, onReopen);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, onReopen);
  }, []);

  if (!visible) return null;

  const decide = (analytics: boolean, marketing: boolean) => {
    saveConsent({ analytics, marketing });
    applyConsent({ analytics, marketing });
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="yz-consent-bar fixed inset-x-0 top-0 z-[120] border-b border-white/15 shadow-2xl"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex items-start gap-3">
            <span aria-hidden className="text-2xl leading-none sm:text-3xl">🍪</span>
            <div>
              <p className="text-base font-bold text-white sm:text-lg">We value your privacy</p>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/85">
                We use essential cookies to run the store, plus optional analytics and marketing
                cookies to improve it and measure our ads.{' '}
                <Link href="/cookie-policy" className="font-medium underline underline-offset-2 hover:opacity-80">
                  Cookie policy
                </Link>
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center justify-end gap-3">
            {/* A faded gear, not a button, so "Accept all" reads as the one
                clear action and only the deliberate few open preferences. */}
            <button
              type="button"
              onClick={() => setShowPrefs((v) => !v)}
              aria-expanded={showPrefs}
              aria-label="Cookie preferences"
              title="Cookie preferences"
              className="yz-consent-gear shrink-0 p-2 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => decide(true, true)}
              className="yz-consent-btn-accept flex-1 rounded-full px-8 py-3 text-base font-bold shadow-lg transition-colors sm:flex-none"
            >
              Accept all
            </button>
          </div>
        </div>

        {showPrefs && (
          <div className="mt-4 flex flex-col gap-3 border-t border-white/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2.5 text-sm text-white sm:flex-row sm:items-center sm:gap-6">
              <label className="flex items-center gap-2 opacity-80">
                <input type="checkbox" checked disabled className="h-4 w-4 accent-white" />
                Essential (required)
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={analyticsOn}
                  onChange={(e) => setAnalyticsOn(e.target.checked)}
                  className="h-4 w-4 accent-white"
                />
                Analytics (anonymous)
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={marketingOn}
                  onChange={(e) => setMarketingOn(e.target.checked)}
                  className="h-4 w-4 accent-white"
                />
                Marketing (Meta ads)
              </label>
            </div>
            <button
              type="button"
              onClick={() => decide(analyticsOn, marketingOn)}
              className="yz-consent-btn-save self-start rounded-full px-5 py-2 text-sm font-semibold transition-colors sm:self-auto"
            >
              Save choices
            </button>
          </div>
        )}
      </div>

      {/*
        Colours stated explicitly, not via bg-white/text-[#...] utilities:
        globals.css remaps those inside `.dark` (right for content cards, wrong
        for controls sitting ON this chrome bar). A dedicated class matches no
        remap list, so one rule serves both themes.

        The bar itself is a SOLID brand-purple gradient rather than the old
        translucent glass — over the bright hero the translucent bar was easy
        to miss, and the whole point is that it should not be.
      */}
      <style jsx global>{`
        .yz-consent-bar {
          background: linear-gradient(180deg, #5a2ea6 0%, #46207f 100%) !important;
        }
        .yz-consent-btn-accept {
          background-color: #ffffff !important;
          color: #4a2287 !important;
        }
        .yz-consent-btn-accept:hover {
          background-color: #f3ecff !important;
        }
        .yz-consent-btn-save {
          border: 1px solid rgba(255, 255, 255, 0.55) !important;
          color: #ffffff !important;
          background-color: transparent !important;
        }
        .yz-consent-btn-save:hover {
          background-color: rgba(255, 255, 255, 0.14) !important;
        }
        .yz-consent-gear {
          color: rgba(255, 255, 255, 0.55) !important;
          background: transparent !important;
        }
        .yz-consent-gear:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
