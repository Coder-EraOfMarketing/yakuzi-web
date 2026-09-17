/**
 * The product-type axis — what FORM the collectible takes.
 *
 * PharmaBag's equivalent is dosage form (`/categories/[cat]/[form]`): the same
 * molecule as a tablet and as a syrup are different purchases, so they are
 * different pages. Here, a Funko Pop and a 70 cm resin statue of the same
 * character are different purchases at ten times the price, and buyers search
 * for them with different words.
 *
 * This axis carries the price signal that the series and character axes
 * cannot. "Demon Slayer figure" is ambiguous about budget; "Demon Slayer
 * Funko Pop" is not, and the resulting page can state a real price range
 * because every product in it sits in the same band.
 *
 * `subCategorySlugs` links a type to the platform's own sub-category taxonomy
 * where one already exists, so the two do not drift into separate worlds. The
 * regex is still authoritative — sellers do not reliably pick the right
 * sub-category, and the product name almost always says what the thing is.
 */

export interface ProductTypeDef {
  slug: string;
  /** Plural display name — "Action Figures". */
  name: string;
  /** Singular, lowercase, for mid-sentence use — "action figure". */
  singular: string;
  /** What distinguishes this form. Factual, about the format, not the stock. */
  note: string;
  /** Regex source, case-insensitive. Authoritative over sub-category. */
  match: string;
  /** Product slugs the pattern catches wrongly. */
  exclude?: string[];
  /** Platform sub-category slugs that mean the same thing, when any do. */
  subCategorySlugs?: string[];
  /**
   * Whether this type is worth crossing with a series.
   * `/anime/demon-slayer/funko-pop` is a real query; `/anime/demon-slayer/general`
   * is not. Only types flagged here generate cross pages.
   */
  crossWithSeries?: boolean;
}

/** A type hub needs this many live matches before it may index. */
export const MIN_PRODUCTS_TYPE = 3;

/** A series x type cross page needs this many. Set higher — these are the
 *  pages most at risk of reading as templated doorways, so they must earn it. */
export const MIN_PRODUCTS_SERIES_TYPE = 3;

export const PRODUCT_TYPES: ProductTypeDef[] = [
  {
    slug: 'action-figures',
    name: 'Action Figures',
    singular: 'action figure',
    note: 'Articulated figures with movable joints, usually PVC or ABS, designed to be reposed rather than fixed in one pose.',
    match: 'action figure|articulated figure|figma\\b|\\bs\\.h\\. ?figuarts\\b',
    subCategorySlugs: ['action-figures'],
    crossWithSeries: true,
  },
  {
    slug: 'collectible-statues',
    name: 'Collectible Statues',
    singular: 'collectible statue',
    note: 'Fixed-pose display pieces, typically resin or heavyweight PVC, sculpted for a single silhouette rather than articulation.',
    match: 'collectible statue|collectable statue|\\bstatue\\b|\\bbust\\b|\\bscale figure\\b|1[:/]\\d',
    subCategorySlugs: ['figures-statues'],
    crossWithSeries: true,
  },
  {
    slug: 'funko-pop',
    name: 'Funko Pop Figures',
    singular: 'Funko Pop',
    note: 'Funko’s stylised vinyl line, identifiable by the oversized square head and black eyes, sold in window packaging most collectors keep sealed.',
    match: '\\bfunko\\b|\\bpop! ?vinyl\\b|\\bpop vinyl\\b',
    subCategorySlugs: ['funko-pop'],
    crossWithSeries: true,
  },
  {
    slug: 'diorama-figures',
    name: 'Diorama Figures',
    singular: 'diorama figure',
    note: 'Multi-element scenes on a sculpted base, staging a moment from the source work rather than a single character standing.',
    match: '\\bdiorama\\b|end scene|battle scene|\\bvs\\.? \\w+ (?:collectible )?statue',
    crossWithSeries: true,
  },
  {
    slug: 'noodle-stopper-figures',
    name: 'Noodle Stopper Figures',
    singular: 'noodle stopper figure',
    note: 'FuRyu’s sitting-pose prize line, designed with a flat top so the figure can weigh down the lid of an instant-noodle cup.',
    match: 'noodle ?stopper',
    crossWithSeries: false,
  },
  {
    slug: 'miniature-figures',
    name: 'Miniature Figures',
    singular: 'miniature figure',
    note: 'Small-format pieces, usually under 10 cm, sold individually or as multi-character sets.',
    match: '\\bminiature\\b|\\bmini figure\\b|\\bchibi\\b|\\bnendoroid\\b|\\bpetit\\b',
    crossWithSeries: true,
  },
  {
    slug: 'figure-sets',
    name: 'Figure Sets',
    singular: 'figure set',
    note: 'Multi-piece releases sold as one unit — a squad, a team, or a set of evolutions — rather than as single figures.',
    match: 'set of \\d+|figure set|\\bmulti[- ]pack\\b|\\b\\d+[- ]pack\\b',
    crossWithSeries: true,
  },
  {
    slug: 'led-figures',
    name: 'LED & Light-Up Figures',
    singular: 'LED figure',
    note: 'Figures with integrated lighting in the base or the sculpt, usually USB or battery powered, meant to be displayed lit.',
    match: '\\bled\\b|light[- ]up|night light|\\blamp\\b|illuminated',
    crossWithSeries: false,
  },
  {
    slug: 'prop-replicas',
    name: 'Prop Replicas',
    singular: 'prop replica',
    note: 'Wearable or full-scale recreations of objects from the source work — helmets, weapons and masks — rather than figures of characters.',
    match: '\\bhelmet\\b|\\breplica\\b|1:1|life[- ]size|\\bprop\\b|\\bmask\\b|\\bsword\\b(?! art)',
    crossWithSeries: false,
  },
  {
    slug: 'manga-comics',
    name: 'Manga & Comics',
    singular: 'manga volume',
    note: 'Printed volumes: manga tankobon, graphic novels, single-issue comics and box sets.',
    match: '\\bmanga\\b|\\bcomic\\b|\\bissue \\d+\\b|\\bvolume \\d+\\b|\\bvol\\.? ?\\d+\\b|graphic novel|box set',
    subCategorySlugs: ['manga', 'comics', 'books-comics', 'box-sets', 'art-books'],
    crossWithSeries: true,
  },
  {
    slug: 'trading-cards',
    name: 'Trading Cards',
    singular: 'trading card',
    note: 'Collectible card products: sealed booster packs, elite trainer boxes and graded singles.',
    match: 'trading card|\\btcg\\b|booster (?:pack|box)|\\bcard pack\\b',
    subCategorySlugs: ['trading-cards'],
    crossWithSeries: true,
  },
  {
    slug: 'keychains',
    name: 'Keychains & Small Merch',
    singular: 'keychain',
    note: 'Pocket-format merchandise — keychains, acrylic charms, pins and badges — usually the lowest-priced entry into a series.',
    match: '\\bkey ?chain\\b|\\bkey ?ring\\b|\\bcharm\\b|\\bacrylic stand\\b|\\bbadge\\b|\\bpin\\b(?!k)',
    subCategorySlugs: ['pins-badges', 'acrylic-display-items'],
    crossWithSeries: true,
  },
];

export function productTypeBySlug(slug: string): ProductTypeDef | undefined {
  return PRODUCT_TYPES.find((t) => t.slug === slug);
}

/** The types worth generating `/anime/[series]/[type]` pages for. */
export const CROSSABLE_TYPES = PRODUCT_TYPES.filter((t) => t.crossWithSeries);
