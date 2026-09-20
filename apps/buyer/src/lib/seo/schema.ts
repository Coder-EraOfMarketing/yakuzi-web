import { COMPANY } from '@/config/company';
import {
  SITE_NAME,
  SITE_URL,
  ORG_LEGAL_NAME,
  SITE_SUMMARY,
  SUPPORT_EMAIL,
  absoluteUrl,
} from './site';

// `contact` lets the homepage pass the admin-set support details through, so
// the structured data and the contact page can never publish different
// numbers. Defaults to the built-in constants for any caller that has none.
export function organizationSchema(
  sameAs: string[] = [],
  contact: { email?: string; phone?: string } = {},
) {
  return {
    '@context': 'https://schema.org',
    // Two types, because Yukizi is genuinely both and was only declaring one.
    // `Organization` alone leaves a machine to infer what kind of thing this
    // is, and it was inferring "marketplace" from the copy and filing the site
    // away from questions about where to BUY something. OnlineStore is the
    // schema.org type for exactly that, and stating it is cheaper and more
    // reliable than hoping the prose carries it.
    '@type': ['Organization', 'OnlineStore'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'Yukizi India',
    legalName: ORG_LEGAL_NAME,
    description: SITE_SUMMARY,
    url: SITE_URL,
    logo: absoluteUrl('/YukiziLogo.png'),
    image: absoluteUrl('/YukiziLogo.png'),
    email: SUPPORT_EMAIL,
    // The registration numbers. These are the difference between a site that
    // claims to be a business and one that can be looked up in a register —
    // published on the policy pages already, but nowhere a machine would read.
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'CIN', value: COMPANY.cin },
      { '@type': 'PropertyValue', propertyID: 'GSTIN', value: COMPANY.gstin },
    ],
    taxID: COMPANY.gstin,
    vatID: COMPANY.gstin,
    // Where this sells and in what currency, stated rather than inferred from
    // the prices happening to carry a rupee sign.
    areaServed: { '@type': 'Country', name: 'India' },
    /**
     * Shipping and returns, on the Organization node — which means on every
     * page, including the homepage.
     *
     * Asked "does Yukizi ship across India?", an assistant replied that it
     * "couldn't verify Yukizi's current shipping policy from an official
     * source". /shipping said so plainly and was crawlable; the assistant had
     * fetched the homepage, which said nothing about delivery at all. A site
     * gets one fetch, and it is rarely the page you would have picked.
     *
     * Both mirror the policy pages exactly. `merchantReturnDays` and the
     * delivery window are read from COMPANY, so a policy change cannot leave
     * the structured data quietly contradicting the page.
     */
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'IN',
      returnPolicyCategory:
        'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: COMPANY.returnWindowDays,
      url: absoluteUrl('/returns'),
    },
    // Free shipping, anywhere in India. Stated as a zero rate rather than
    // described in prose, because "free" in a sentence is not a number a
    // machine can act on.
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: { '@type': 'MonetaryAmount', value: '0', currency: 'INR' },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'IN',
      },
      url: absoluteUrl('/shipping'),
    },
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, Debit Card, UPI, Net Banking',
    knowsLanguage: ['en', 'hi'],
    // Real, published details only (the same values the Contact page shows) —
    // they let Google/LLMs pin the entity to a concrete registered business.
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Phase 2, Laxmi Narayan Residency, Flat No. 103, Jekegram',
      addressLocality: 'Thane',
      addressRegion: 'Maharashtra',
      postalCode: '400606',
      addressCountry: 'IN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      telephone: contact.phone || COMPANY.supportPhone,
      email: contact.email || SUPPORT_EMAIL,
      areaServed: 'IN',
      availableLanguage: ['en'],
    },
    // The entity link: connects this site to the brand's profiles elsewhere,
    // which is how Google and AI assistants corroborate they are the same
    // organisation. Omitted entirely when none are configured.
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { '@id': `${SITE_URL}/#organization` },
    // The homepage doubles as the search-results view (?search=…), so this is
    // a real, working target — enables sitelinks-search-box eligibility.
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export interface BreadcrumbItem { name: string; path?: string }
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.path ? { item: absoluteUrl(it.path) } : {}),
    })),
  };
}

// Product schema from the public GET /products/:slug payload.
// Only include what is REAL: no invented ratings, no fake availability.
export function productSchema(p: {
  name?: string; slug?: string; id: string; description?: string;
  image?: string | null; images?: Array<{ url?: string } | string> | null;
  manufacturer?: string; price?: number | null; mrp?: number | null;
  stock?: number; hasSellers?: boolean; shippingPrice?: number | null;
  sku?: string | null; mpn?: string | null; gtin?: string | null;
  updatedAt?: string | Date | null;
  category?: { name?: string } | null;
  reviewSummary?: { average?: number; count?: number } | null;
  listings?: unknown[] | null; sellerCount?: number; sellerName?: string;
}) {
  const images: string[] = [];
  if (p.image) images.push(p.image);
  for (const im of p.images ?? []) {
    const url = typeof im === 'string' ? im : im?.url;
    if (url && !images.includes(url)) images.push(url);
  }
  const price = p.price ?? p.mrp;
  const url = absoluteUrl(`/products/${p.slug ?? p.id}`);
  const hasSellers = p.hasSellers ?? ((p.listings?.length ?? 0) > 0 || (p.sellerCount ?? 0) > 0);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    ...(p.name ? { name: p.name } : {}),
    url,
    ...(images.length ? { image: images } : {}),
    ...(p.description ? { description: p.description } : {}),
    ...(p.manufacturer ? { brand: { '@type': 'Brand', name: p.manufacturer } } : {}),
    ...(p.category?.name ? { category: p.category.name } : {}),
    // Identifiers let Google reconcile this page with the Merchant feed as
    // ONE product instead of two unlinked descriptions of the same item.
    ...(p.sku ? { sku: p.sku } : {}),
    ...(p.mpn ? { mpn: p.mpn } : {}),
    ...(p.gtin ? { gtin: p.gtin } : {}),
    // Freshness: assistants weight recency when choosing between sources,
    // and a page that can't prove it loses to one that can.
    ...(p.updatedAt ? { dateModified: new Date(p.updatedAt).toISOString() } : {}),
    ...(price != null && hasSellers
      ? {
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'INR',
            price: String(price),
            // Google treats an absent/stale price date as a soft warning and
            // some surfaces then suppress the price entirely. Rolling 30 days.
            priceValidUntil: new Date(Date.now() + 30 * 86_400_000)
              .toISOString()
              .slice(0, 10),
            availability:
              (p.stock ?? 0) > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            ...(p.sellerName ? { seller: { '@type': 'Organization', name: p.sellerName } } : {}),
            // The platform has no used/refurbished concept — every listing is new.
            itemCondition: 'https://schema.org/NewCondition',
            // Real policy from /returns: damaged/wrong-item only, buyer must
            // notify within 3 days of delivery. Don't invent returnFees — the
            // policy page doesn't state who pays.
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'IN',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 3,
              url: absoluteUrl('/returns'),
            },
            // Only when the payload carries a real per-listing shipping price;
            // no deliveryTime — deliveryText is free-form and unparseable.
            ...(p.shippingPrice != null
              ? {
                  shippingDetails: {
                    '@type': 'OfferShippingDetails',
                    shippingRate: {
                      '@type': 'MonetaryAmount',
                      value: String(p.shippingPrice),
                      currency: 'INR',
                    },
                    shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'IN' },
                  },
                }
              : {}),
          },
        }
      : {}),
    // Both fields guarded: gating on count alone once risked emitting
    // ratingValue:"undefined" when a caller set count without average.
    ...(p.reviewSummary?.count &&
    typeof p.reviewSummary.average === 'number' &&
    Number.isFinite(p.reviewSummary.average) &&
    p.reviewSummary.average > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: String(Math.round(p.reviewSummary.average * 10) / 10),
            reviewCount: p.reviewSummary.count,
            bestRating: '5',
            worstRating: '1',
          },
        }
      : {}),
  };
}

/**
 * A guide, as an Article authored by the organisation.
 *
 * Deliberately `Article` and not `BlogPosting`: a BlogPosting belongs to a
 * Blog and `articleSchema` below correctly points its `isPartOf` at
 * `/blogs#blog`. Guides are reference pages, not dated posts, and claiming
 * they are part of a blog they are not in would be a structural lie about the
 * site — the sort of mismatch that gives Google a reason to discount the
 * markup entirely.
 *
 * Also deliberately NOT `HowTo`, even for the guides that are step-shaped.
 * Google retired HowTo rich results, so the type buys nothing, and several of
 * these guides are decision aids rather than procedures — typing them as
 * instructions would misdescribe them.
 *
 * `author` is the Organization rather than a Person. That is the honest
 * answer: there is no named byline to point at, and inventing one to satisfy
 * an E-E-A-T checklist would be fabricating a person.
 */
export function guideArticleSchema(guide: {
  title: string;
  slug: string;
  description: string;
  updated: string;
  /** Word count of the rendered body, for `wordCount`. */
  wordCount?: number;
  /** Category label, emitted as articleSection. */
  section?: string;
}) {
  const url = absoluteUrl(`/guides/${guide.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: guide.title,
    description: guide.description,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en-IN',
    // Both dates are the review date. There is no separate authored date to
    // report, and guessing one would be worse than stating the truth twice.
    datePublished: guide.updated,
    dateModified: guide.updated,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    ...(guide.section ? { articleSection: guide.section } : {}),
    ...(guide.wordCount && guide.wordCount > 0 ? { wordCount: guide.wordCount } : {}),
  };
}

/** "/blogs/author/jane-doe" — authors have no slug of their own. */
export function authorSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * A named author with a page of their own, not a bare string.
 *
 * Google's guidance on who wrote a piece is not decoration: an anonymous
 * byline on an article about spotting counterfeits is asking readers to
 * trust authentication advice from nobody. The @id lets every post by the
 * same person resolve to one entity rather than a fresh unknown each time.
 */
export function personSchema(author: { name: string; bio?: string; avatar?: string }) {
  const url = absoluteUrl(`/blogs/author/${authorSlug(author.name)}`);
  return {
    '@type': 'Person',
    '@id': `${url}#person`,
    name: author.name,
    url,
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.avatar ? { image: absoluteUrl(author.avatar) } : {}),
  };
}

export function articleSchema(post: {
  title: string; slug: string; excerpt?: string; featuredImage?: string;
  createdAt?: string; updatedAt?: string; publishedAt?: string;
  author?: { name?: string; bio?: string; avatar?: string } | null;
  category?: { name?: string } | null;
  tags?: string[];
  content?: unknown;
}) {
  const url = absoluteUrl(`/blogs/${post.slug}`);
  // Rough but honest: strips tags, counts words. Google uses wordCount as one
  // signal of whether a page is substantial; guessing it would be worse than
  // omitting it, so it is only emitted when the content is really there.
  const text = typeof post.content === 'string' ? post.content.replace(/<[^>]+>/g, ' ') : '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return {
    '@context': 'https://schema.org',
    // BlogPosting rather than Article: it is the specific type for a blog
    // entry, and it is what a blog's isPartOf Blog expects to contain.
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    url,
    mainEntityOfPage: url,
    inLanguage: 'en-IN',
    isPartOf: { '@type': 'Blog', '@id': `${SITE_URL}/blogs#blog`, name: `${SITE_NAME} Blog` },
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.featuredImage ? { image: [absoluteUrl(post.featuredImage)] } : {}),
    ...(post.publishedAt || post.createdAt ? { datePublished: post.publishedAt || post.createdAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.author?.name ? { author: personSchema({ name: post.author.name, bio: post.author.bio, avatar: post.author.avatar }) } : {}),
    // What the piece is about, so a post sits in a topic rather than alone.
    ...(post.category?.name ? { articleSection: post.category.name } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
    ...(wordCount > 0 ? { wordCount } : {}),
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** The blog itself, so posts have a parent to belong to. */
export function blogSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blogs#blog`,
    name: `${SITE_NAME} Blog`,
    url: absoluteUrl('/blogs'),
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** `basePath` defaults to products; the blog index passes "/blogs". */
export function itemListSchema(
  name: string,
  items: Array<{ name?: string; slug?: string; id: string }>,
  basePath = '/products',
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: items.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`${basePath}/${p.slug ?? p.id}`),
      ...(p.name ? { name: p.name } : {}),
    })),
  };
}

/**
 * An ItemList of PAGES rather than of products.
 *
 * `itemListSchema` above builds product URLs by gluing a slug onto a base
 * path, which is right for a grid and wrong for a directory: the entries on
 * `/anime` are hub pages whose paths are already complete. Passing them
 * through the product builder produced `https://anime/naruto` — a different
 * host, not a different path. This takes the finished path instead.
 */
export function pageListSchema(
  name: string,
  items: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: absoluteUrl(it.path),
    })),
  };
}

export function faqPageSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/**
 * A category/collection page as a typed CollectionPage wrapping its ItemList —
 * this is what tells Google "a curated set", not "a page that happens to have
 * links". `mainEntity` keeps the list attached to the page entity.
 */
export function collectionPageSchema(opts: {
  name: string;
  path: string;
  description?: string | null;
  items: Array<{ name?: string; slug?: string; id: string }>;
  /** Newest product update in the set — the page's own freshness. */
  dateModified?: string | Date | null;
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: opts.name,
    url,
    ...(opts.description ? { description: opts.description } : {}),
    isPartOf: { '@id': `${SITE_URL}/#website` },
    ...(opts.dateModified
      ? { dateModified: new Date(opts.dateModified).toISOString() }
      : {}),
    mainEntity: {
      '@type': 'ItemList',
      name: opts.name,
      itemListElement: opts.items.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/products/${p.slug ?? p.id}`),
        ...(p.name ? { name: p.name } : {}),
      })),
    },
  };
}

/**
 * The delivery-area node for a place page.
 *
 * Deliberately `OnlineStore` and NOT `LocalBusiness`. LocalBusiness asserts a
 * physical establishment at an address, and Yukizi has exactly one of those —
 * in Thane. Emitting LocalBusiness on `/anime-store/karnataka/bengaluru`
 * would tell Google there is a shop in Bengaluru to send people to, which is
 * false, and false location markup is both a structured-data violation and
 * the kind of claim a buyer can disprove by turning up.
 *
 * `OnlineStore` with `areaServed` says the true thing instead: one business,
 * trading online, that serves this place. The Organization node it points at
 * carries the single real address.
 */
export function onlineStoreServingSchema(opts: {
  placeName: string;
  /** "City" for a city page, "State" for a state page. */
  placeType: 'City' | 'State';
  containedIn?: string | null;
  path: string;
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${url}#store`,
    name: SITE_NAME,
    url,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    areaServed: {
      '@type': opts.placeType,
      name: opts.placeName,
      ...(opts.containedIn
        ? { containedInPlace: { '@type': 'State', name: opts.containedIn } }
        : {}),
    },
    currenciesAccepted: 'INR',
  };
}

/**
 * A franchise/licence as a named entity.
 *
 * Series hubs emit this so "Demon Slayer" on the page resolves to a thing
 * rather than to a string, which is what lets an entity-based index connect
 * the hub to everything else it knows about the franchise.
 */
export function brandEntitySchema(opts: {
  name: string;
  description: string;
  path: string;
  alternateNames?: string[];
}) {
  const url = absoluteUrl(opts.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    '@id': `${url}#brand`,
    name: opts.name,
    description: opts.description,
    url,
    ...(opts.alternateNames?.length ? { alternateName: opts.alternateNames } : {}),
  };
}

/**
 * Collapses the page's separate JSON-LD blocks into ONE @graph.
 *
 * Emitting Organization / WebSite / Product / Breadcrumb as disconnected
 * blocks makes Google resolve four orphan facts; inside a @graph — where the
 * nodes already carry stable @ids — it resolves a single connected entity.
 * That connectedness is what entity-based search and LLM retrieval reason
 * over, so this is the strongest on-page understanding lever available.
 *
 * Each node keeps whatever @id it declared; the wrapper drops the per-node
 * @context (it belongs once, at the top).
 */
export function graph(...nodes: Array<object | null | undefined>) {
  const cleaned = nodes
    .filter((n): n is Record<string, unknown> => !!n)
    .map(({ ['@context']: _ctx, ...rest }) => rest);
  return { '@context': 'https://schema.org', '@graph': cleaned };
}
