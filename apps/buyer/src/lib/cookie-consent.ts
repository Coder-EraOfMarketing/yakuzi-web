'use client';

import { disable as disableTracker, startTracker } from '@/lib/analytics/tracker';

/**
 * Cookie-consent state, shared between the consent bar and the analytics
 * tracker. One localStorage record, one shape:
 *   { analytics: boolean, ts: number }
 *
 * Consent model is OPT-IN: until the visitor makes a choice, the analytics
 * tracker does not start (see startTracker's consent gate). Essential
 * cookies (checkout/session) are outside this system — the store cannot
 * function without them and the bar presents them as locked.
 */

export const CONSENT_KEY = 'yz_cookie_consent';

export interface CookieConsentState {
  analytics: boolean;
  ts: number;
}

function storage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getStoredConsent(): CookieConsentState | null {
  const store = storage();
  if (!store) return null;
  try {
    const raw = store.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.analytics !== 'boolean') return null;
    return parsed as CookieConsentState;
  } catch {
    return null;
  }
}

export function hasStoredConsent(): boolean {
  return getStoredConsent() !== null;
}

export function saveConsent(choice: { analytics: boolean }): void {
  const store = storage();
  try {
    store?.setItem(CONSENT_KEY, JSON.stringify({ analytics: choice.analytics, ts: Date.now() }));
  } catch {
    /* storage blocked: the choice still applies for this pageload */
  }
}

/** Enforce the visitor's choice immediately, without a reload. */
export function applyConsent(analytics: boolean): void {
  if (typeof window === 'undefined') return;
  if (analytics) {
    startTracker();
  } else {
    disableTracker();
  }
}
