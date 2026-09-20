import { COMPANY } from '@/config/company';

/**
 * Support contact details, admin-editable.
 *
 * These appear on the contact and about pages, in every policy document, in
 * llms.txt and in the Organization schema — and until now they lived only in
 * config/company.ts, so changing the published support email or phone number
 * needed a developer and a deploy. Worse, the number in the constants
 * (+91 82912 80021) had already drifted from the one hardcoded in the
 * homepage footer (+91 99033 19794): two different support numbers shipped on
 * the same site.
 *
 * A blank setting means "use the built-in value", the same convention the
 * storefront SEO defaults follow, so clearing a field in admin restores the
 * fallback rather than publishing an empty contact.
 *
 * Fail-open with a short timeout, like every other settings read here: a
 * settings outage must cost the override, never the page.
 */
export interface SupportContact {
  email: string;
  phone: string;
}

const FALLBACK: SupportContact = {
  email: COMPANY.supportEmail,
  phone: COMPANY.supportPhone,
};

/**
 * Domains that can no longer receive mail, and what to use instead.
 *
 * yukizi.in has no MX record. It is registered, and it now 301-redirects to
 * yukizi.com, but no mail server has ever accepted mail for it — every message
 * sent to an @yukizi.in address bounces. yukizi.com has live Google Workspace.
 *
 * This matters because the support address is admin-editable, and the value
 * saved in Platform Settings is @yukizi.in. Code alone cannot change a
 * database row, and until somebody edits that setting the site would keep
 * publishing a bouncing address on /contact, /shipping, /returns, /privacy,
 * /terms, the cookie policy, the homepage, llms.txt and brand.json — ten
 * surfaces, all reading the same setting.
 *
 * So the setting is honoured for everything except the part that is provably
 * broken: an address on a retired domain is rewritten to the same mailbox on
 * the domain that answers. support@yukizi.in becomes support@yukizi.com.
 *
 * TO REMOVE THIS: correct the value in Admin -> Settings -> Support Email,
 * then delete the RETIRED_MAIL_DOMAINS entry. It is a guard against publishing
 * an address that cannot be read, not a permanent redirect — if mail is ever
 * set up on yukizi.in, taking the entry out restores full control to the
 * setting.
 */
const RETIRED_MAIL_DOMAINS: Record<string, string> = {
  'yukizi.in': 'yukizi.com',
};

/**
 * Rewrites an address on a retired domain onto the one that receives mail.
 *
 * Anything else is returned untouched, so a completely different support
 * address configured in admin still works exactly as set.
 */
export function usableSupportEmail(email: string): string {
  const trimmed = (email ?? '').trim();
  const at = trimmed.lastIndexOf('@');
  if (at < 0) return trimmed;

  const domain = trimmed.slice(at + 1).toLowerCase();
  const replacement = RETIRED_MAIL_DOMAINS[domain];
  if (!replacement) return trimmed;

  const rewritten = `${trimmed.slice(0, at)}@${replacement}`;
  // Visible in the build/server log, so this is discoverable rather than
  // mysterious to whoever wonders why the setting is not being obeyed.
  console.warn(
    `[support-contact] "${trimmed}" is on ${domain}, which has no mail server. ` +
      `Publishing "${rewritten}" instead. Fix the value in Admin -> Settings ` +
      `-> Support Email to silence this.`,
  );
  return rewritten;
}

export async function fetchSupportContact(): Promise<SupportContact> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!base) return FALLBACK;
  try {
    const res = await Promise.race([
      fetch(`${base}/config/platform`, { next: { revalidate: 600 } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000)),
    ]);
    if (!res || !res.ok) return FALLBACK;
    const body = (await res.json().catch(() => null)) as {
      data?: Record<string, string | undefined>;
    } | null;
    const d = body?.data ?? {};
    return {
      email: usableSupportEmail(d.supportEmail?.trim() || FALLBACK.email),
      phone: d.supportPhone?.trim() || FALLBACK.phone,
    };
  } catch {
    return FALLBACK;
  }
}
