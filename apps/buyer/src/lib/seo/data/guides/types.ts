/**
 * Guides — the informational layer.
 *
 * Every other page family on this site is generated from the catalogue, which
 * means every one of them is capped by it: 83 products can only support so
 * many honest facet pages. Guides are the one family with no such ceiling,
 * and they do a job the product pages cannot.
 *
 * The distinction worth being precise about: product and hub pages answer
 * TRANSACTIONAL queries ("nezuko figure price"), and on those Amazon and the
 * established Indian retailers have years of authority Yukizi does not.
 * Guides answer QUESTION queries ("how to spot a fake funko pop"), where
 * authority counts for much less than actually answering the question — and
 * question queries are what AI assistants quote, because an assistant
 * summarising "how do I tell if a Funko is fake" needs a page that explains
 * it, not a page that sells one.
 *
 * Content rules, which are not negotiable because the topic is authenticity
 * advice and getting it wrong has real consequences for a reader:
 *
 *  - Only claims I can stand behind. Where a figure, rate or threshold moves
 *    over time (customs duty especially), say so and point at the primary
 *    source rather than freezing a number into the page.
 *  - `answer` must stand alone. It is the passage most likely to be lifted
 *    into an AI Overview, so it repeats the subject rather than leaning on
 *    the H1 above it and never says "see below".
 *  - Tables where the content is genuinely tabular. A model parsing a
 *    label/value row mis-attributes far less often than one parsing the same
 *    fact out of a paragraph.
 *  - No padding. A 400-word guide that answers the question beats a
 *    1,500-word one that buries it.
 *
 * Guides carry `related*` hub links because this family is also the fix for
 * the one structural weakness in the facet hubs: they are linked from
 * products and from the footer, but nothing EDITORIAL links to them. A guide
 * about figure scales linking to `/figures/collectible-statues` is a
 * contextual link from relevant prose, which is worth considerably more than
 * another footer entry.
 */

export type GuideCategory = 'authenticity' | 'india' | 'formats' | 'ownership';

export const GUIDE_CATEGORY_LABEL: Record<GuideCategory, string> = {
  authenticity: 'Authenticity & Buying Safely',
  india: 'Collecting in India',
  formats: 'Formats & Terminology',
  ownership: 'Care, Display & Storage',
};

export const GUIDE_CATEGORY_BLURB: Record<GuideCategory, string> = {
  authenticity:
    'How to tell an official figure from a recast, what the stickers on a Funko box mean, and which signals actually matter.',
  india:
    'Import duty, why prices differ from Japan, where to buy, and how large statues survive an Indian courier network.',
  formats:
    'Scales, prize figures, Nendoroids, noodle stoppers, and the material a figure is actually made of.',
  ownership:
    'Cleaning without stripping paint, stopping yellowing before it starts, and displaying and storing a collection.',
};

export interface GuideTable {
  caption?: string;
  /** Column headers. Two columns: label and value. */
  head?: [string, string];
  rows: Array<{ label: string; value: string }>;
}

export interface GuideSection {
  heading: string;
  paras?: string[];
  bullets?: string[];
  table?: GuideTable;
}

export interface GuideDef {
  slug: string;
  category: GuideCategory;
  /** SERP title, without the site suffix. */
  title: string;
  h1: string;
  metaDescription: string;
  /**
   * ISO date this guide's content was last reviewed.
   *
   * Emitted as `dateModified` on the Article node. Assistants and Google both
   * weight recency when choosing between sources, and a page that cannot
   * prove when it was last checked loses to one that can. Bump it when the
   * content actually changes — a date that moves without the content moving
   * is a lie that is easy to tell and easy to catch.
   */
  updated: string;
  /** Self-contained answer, 1–3 sentences. The passage most likely quoted. */
  answer: string;
  sections: GuideSection[];
  faqs: Array<{ question: string; answer: string }>;
  /** Slugs from the corresponding data files. */
  relatedTypes?: string[];
  relatedSeries?: string[];
  relatedManufacturers?: string[];
  relatedPriceBands?: string[];
  relatedGuides?: string[];
  /**
   * Renders a block generated from live catalogue data.
   *
   * Only one exists: the price table. It is what lets a single guide state
   * real, current, checkable numbers instead of an author's recollection of
   * them — the same property that got PharmaBag's figures quoted verbatim.
   */
  dataBlock?: 'price-table';
}
