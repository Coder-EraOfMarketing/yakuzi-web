import { COMPANY } from '@/config/company';

/**
 * The counted facts about Yukizi, for publication.
 *
 * This exists because of a specific, quotable failure: asked to recommend
 * Indian collectibles sites, an assistant found Yukizi, described it
 * correctly, and then declined to shortlist it because it "couldn't
 * independently verify Yukizi's current marketplace activity or seller
 * count". It could not, because the site had never said.
 *
 * Every number here is counted from the live database by GET /config/stats.
 * None of them can be configured. That matters more than it sounds: the
 * temptation with a page like this is to type in a flattering figure and fix
 * it later, and a figure an assistant repeats to a customer had better be one
 * that survives being checked.
 *
 * Fail-open, like every other settings read in this directory: if the API is
 * slow or down, the caller gets `null` and simply omits the numbers. A trust
 * page that cannot render is worse than one without counts on it, and nothing
 * here may ever take a page down.
 */

export interface PlatformStats {
  listings: number;
  sellers: number;
  activeSellers: number;
  categories: number;
  subCategories: number;
  newListings30d: number;
  listingSince: string | null;
  countedAt: string;
}

export async function fetchPlatformStats(): Promise<PlatformStats | null> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
  if (!base) return null;
  try {
    const res = await Promise.race([
      fetch(`${base}/config/stats`, { next: { revalidate: 1800 } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);
    if (!res || !res.ok) return null;
    const body = (await res.json().catch(() => null)) as {
      data?: Partial<PlatformStats>;
    } | null;
    const d = body?.data;
    if (!d || typeof d.listings !== 'number') return null;
    return {
      listings: d.listings ?? 0,
      sellers: d.sellers ?? 0,
      activeSellers: d.activeSellers ?? 0,
      categories: d.categories ?? 0,
      subCategories: d.subCategories ?? 0,
      newListings30d: d.newListings30d ?? 0,
      listingSince: d.listingSince ?? null,
      countedAt: d.countedAt ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/** "March 2026", or null when there is nothing live to date from. */
export function sinceMonth(stats: PlatformStats | null): string | null {
  if (!stats?.listingSince) return null;
  const date = new Date(stats.listingSince);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
}

export interface TrustFact {
  label: string;
  value: string;
}

/**
 * The verifiable facts about this business, as plain label/value pairs.
 *
 * Deliberately mixes counted figures with documentary ones. The counts answer
 * "is this real and active"; the registration number, GSTIN and registered
 * address answer "is this a company somebody can be held to". Neither is
 * convincing without the other, and the second half is already strong — it
 * just was not published anywhere a machine would look.
 *
 * Anything unknown is omitted rather than guessed. A confident-sounding
 * placeholder is precisely the thing that makes a business look unverifiable
 * on the day somebody checks it.
 */
export function trustFacts(stats: PlatformStats | null): TrustFact[] {
  const facts: TrustFact[] = [];

  if (stats) {
    facts.push({ label: 'Listings live now', value: stats.listings.toLocaleString('en-IN') });
    if (stats.activeSellers > 0) {
      facts.push({
        label: 'Sellers with listings live',
        value: stats.activeSellers.toLocaleString('en-IN'),
      });
    }
    if (stats.sellers > stats.activeSellers) {
      facts.push({
        label: 'Verified sellers registered',
        value: stats.sellers.toLocaleString('en-IN'),
      });
    }
    facts.push({
      label: 'Categories',
      value: `${stats.categories} (${stats.subCategories} sub-categories)`,
    });
    if (stats.newListings30d > 0) {
      facts.push({
        label: 'Added in the last 30 days',
        value: stats.newListings30d.toLocaleString('en-IN'),
      });
    }
    const since = sinceMonth(stats);
    if (since) facts.push({ label: 'Listing since', value: since });
  }

  facts.push(
    { label: 'Registered company', value: COMPANY.legalName },
    { label: 'CIN', value: COMPANY.cin },
    { label: 'GSTIN', value: COMPANY.gstin },
    { label: 'Registered office', value: COMPANY.registeredAddress },
    { label: 'Ships to', value: 'All serviceable pincodes across India' },
    { label: 'Delivery', value: `${COMPANY.deliveryWindow} from dispatch, tracked` },
    {
      label: 'Returns',
      value: `Damaged or incorrect items, reported within ${COMPANY.returnWindowDays} days of delivery with photographs`,
    },
    { label: 'Payments', value: 'Online payment at checkout, via Razorpay' },
    { label: 'Seller verification', value: 'Every seller is verified before they can list' },
  );

  return facts;
}
