/**
 * Single source of truth for the company details shown on the public policy pages.
 *
 * The Privacy Policy, Terms of Use, Shipping Policy and Return & Refund Policy
 * pages now carry the text Yukizi supplied on 6 August 2026. Values below that
 * are quoted in those documents have been set from them.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STILL OUTSTANDING
 * ─────────────────────────────────────────────────────────────────────────────
 * The values still marked TO CONFIRM are placeholders and are rendered on the
 * customer-facing About and Contact pages, so they need the real details before
 * this is announced to customers.
 *
 * Fill them in here once and every page updates.
 */

export const COMPANY = {
  /** Trading name used throughout the site copy. */
  brandName: 'Yukizi',

  /**
   * Legal entity name. Confirmed by Rishi 19 August 2026 (registered
   * address/CIN/GSTIN supplied together) as "Yukizi Market Services Private
   * Limited" - resolves the earlier discrepancy against the AWS account name,
   * which used the same "Services" form; the supplied policy-page text
   * without "Services" was the wrong one.
   */
  legalName: 'Yukizi Market Services Private Limited',

  /** Public website URL quoted in the policy documents. */
  websiteUrl: 'https://yukizi.com/',

  /** Registered office address. Confirmed by Rishi 19 August 2026. */
  registeredAddress: 'Phase 2, Laxmi Narayan Residency, Flat No. 103, Jekegram, Thane, Thane - 400606, Maharashtra',

  /** GSTIN. Confirmed by Rishi 19 August 2026. */
  gstin: '27AACCY1892P1ZJ',

  /** CIN. Confirmed by Rishi 19 August 2026. */
  cin: 'U62013MR2026PTC474669',

  /** TO CONFIRM: the address customers post returns to (often not the registered office). */
  returnsAddress: '[Returns address — to be provided]',

  /**
   * Support inbox published in the policy documents.
   *
   * Must be an address that actually receives mail. yukizi.in is registered
   * but suspended pending WHOIS verification — no nameservers, no MX, nothing
   * resolves — so support@yukizi.in bounces and always has. yukizi.com has
   * live Google Workspace MX records.
   *
   * Overridden by the admin setting wherever settings can be read; this is the
   * fallback for the places that cannot read settings.
   */
  supportEmail: 'support@yukizi.com',

  /** Published support phone number, confirmed by Rishi 2026-08-13. */
  supportPhone: '+91 82912 80021',

  /** Published support hours. */
  supportHours: 'Monday to Saturday, 10:00 – 18:00 IST',

  /**
   * Grievance Officer. Publishing a named officer with contact details is required
   * of Indian e-commerce intermediaries under the Consumer Protection
   * (E-Commerce) Rules, 2020 and the IT Rules, 2021.
   * Confirmed by the owner on 2026-09-16.
   */
  grievanceOfficer: {
    name: 'Rupali Salvekar',
    // Was support@yukizi.in, which does not resolve and cannot receive mail —
    // see supportEmail above. Publishing a grievance contact that bounces is
    // not only unhelpful, it defeats the purpose of the Consumer Protection
    // (E-Commerce) Rules requirement this field exists to satisfy. Moved to
    // the domain that has working mail.
    email: 'support@yukizi.com',
  },

  /** TO CONFIRM: courts of which city have jurisdiction under the Terms. */
  jurisdictionCity: '[City — to be provided]',

  /** Window, in days from delivery, for raising a return or damage claim. */
  returnWindowDays: 3,

  /** Delivery window quoted in the Shipping Policy, measured from dispatch. */
  deliveryWindow: '4–7 business days',

  /**
   * Last reviewed date shown at the top of each policy page.
   * Update whenever the policy text changes.
   */
  policiesLastUpdated: '6 August 2026',
} as const;
