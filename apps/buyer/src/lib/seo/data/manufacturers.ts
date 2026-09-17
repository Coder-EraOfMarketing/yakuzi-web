/**
 * The manufacturer axis — who actually made the figure.
 *
 * This is the direct equivalent of PharmaBag's `/brands/[brand]` family, which
 * is its single largest at 905 pages and is generated entirely from a
 * populated `manufacturer` column. Yukizi's column is effectively empty:
 * `manufacturer` reads "Unknown" on 75 of 83 live products, with the rest
 * split between "Maayan Publications", "Pokémon", "Yukizi" and "Testing".
 *
 * ⚠️ NAMING COLLISION, deliberately avoided. The platform already has a
 * concept called "brands" (`GET /brands`, `useBrands()`), and it is NOT
 * manufacturers — it holds FRANCHISES used as decorative homepage hero tiles,
 * currently containing "Naruto", "Dragon Ball", "Bleach", and the typos
 * "Demon" and "Action on Titans". Those belong to the series axis in
 * `series.ts`. This family therefore lives at `/manufacturers/[slug]` rather
 * than `/brands/[slug]`, so that if those hero tiles are ever made clickable
 * they can point at `/anime/[series]` without two meanings of "brand"
 * fighting over one URL namespace.
 *
 * ── How a page here becomes live ──────────────────────────────────────
 *
 * Membership is the union of two signals:
 *
 *   1. The product's `manufacturer` field, matched case-insensitively
 *      against the name and every alias below. This is the signal that
 *      SHOULD carry the family, and today carries almost nothing.
 *   2. A name/description text match, for makers whose name appears in the
 *      product title anyway.
 *
 * Signal 2 means the Funko page works TODAY — "Funko" is in 22 product names.
 * Every other maker below is waiting on signal 1, because a Banpresto prize
 * figure is listed as "Demon Slayer — Kyojuro Rengoku Flame Breathing Figure"
 * with no mention of Banpresto anywhere.
 *
 * So the value of this file is conditional and worth stating plainly: fill in
 * the `manufacturer` field on the seller form and roughly 15 commercially
 * strong pages appear on the next revalidation with no further work. Leave it
 * empty and this family stays at one page forever. That is a seller-form
 * change, not an SEO change, which is exactly why it tends to get deferred.
 *
 * Every `note` is a publicly verifiable fact about the company. None of them
 * describe Yukizi's stock — counts and prices come from the live catalogue.
 */

export interface ManufacturerDef {
  slug: string;
  /** Canonical company name as collectors write it. */
  name: string;
  /** Country of origin — a real differentiator buyers screen on. */
  country: string;
  /**
   * Spellings that mean the same company. Matched against the product's
   * `manufacturer` field AND folded into the text pattern.
   */
  aliases?: string[];
  /** One verifiable fact about the company. */
  note: string;
  /** What this maker is known for — shapes the page's own copy. */
  knownFor: string;
  /**
   * Extra regex alternatives for the TEXT signal, when a maker's product
   * lines are recognisable even though the company name is absent. Regex
   * source, case-insensitive.
   */
  extraMatch?: string[];
  exclude?: string[];
}

/** A manufacturer hub needs this many live matches before it may index. */
export const MIN_PRODUCTS_MANUFACTURER = 3;

export const MANUFACTURERS: ManufacturerDef[] = [
  {
    slug: 'funko',
    name: 'Funko',
    country: 'United States',
    aliases: ['Funko Pop', 'Funko LLC'],
    note: 'Founded in 1998 in Washington state, Funko holds licences across effectively every major entertainment property and is the largest producer of licensed vinyl collectibles in the world.',
    knownFor:
      'Pop! vinyl figures — the stylised square-headed line sold in window packaging that most collectors keep sealed.',
    extraMatch: ['\\bpop! ?vinyl\\b', '\\bpop vinyl\\b'],
  },
  {
    slug: 'banpresto',
    name: 'Banpresto',
    country: 'Japan',
    aliases: ['Bandai Spirits Banpresto', 'Banpresto Japan'],
    note: 'A Bandai Namco subsidiary established in 1977, Banpresto produces the prize figures distributed through Japanese arcade crane games rather than through retail.',
    knownFor:
      'Prize figures — retail-quality sculpts at a lower price point, sold without a stated scale. Lines include Ichiban Kuji, Grandista and Q Posket.',
    extraMatch: ['ichiban ?kuji', 'grandista', 'q ?posket', '\\bmasterlise\\b'],
  },
  {
    slug: 'bandai-spirits',
    name: 'Bandai Spirits',
    country: 'Japan',
    aliases: ['Bandai', 'Bandai Namco', 'Tamashii Nations'],
    note: 'The Bandai Namco division responsible for collector-oriented toys and model kits, spun out as a separate company in 2018.',
    knownFor:
      'S.H.Figuarts articulated figures, the Figure-rise and Gunpla model-kit lines, and the Tamashii Nations collector label.',
    extraMatch: ['s\\.?h\\.? ?figuarts', 'figure[- ]rise', '\\bgunpla\\b', 'tamashii'],
  },
  {
    slug: 'good-smile-company',
    name: 'Good Smile Company',
    country: 'Japan',
    aliases: ['Good Smile', 'GSC', 'Goodsmile'],
    note: 'Founded in 2001 in Tokyo, Good Smile Company is the manufacturer behind the Nendoroid and figma lines and one of the most widely collected figure makers outside Bandai.',
    knownFor:
      'Nendoroids — roughly 10 cm chibi figures with interchangeable faces and parts — and full-scale 1/7 and 1/8 statues.',
    extraMatch: ['\\bnendoroid\\b', '\\bfigma\\b'],
  },
  {
    slug: 'furyu',
    name: 'FuRyu',
    country: 'Japan',
    aliases: ['Furyu Corporation'],
    note: 'A Japanese entertainment company that produces prize figures for the arcade and crane-game channel alongside its photo-booth business.',
    knownFor:
      'The Noodle Stopper line — sitting-pose figures with a flat top designed to weigh down an instant-noodle cup lid — and the Trio-Try-iT series.',
    extraMatch: ['noodle ?stopper', 'trio[- ]try'],
  },
  {
    slug: 'kotobukiya',
    name: 'Kotobukiya',
    country: 'Japan',
    aliases: ['Koto'],
    note: 'Operating since 1947 and producing figures since the 1980s, Kotobukiya holds both Japanese and Western licences including Marvel and DC.',
    knownFor:
      'ARTFX and ARTFX J scale statues, the Bishoujo line of reinterpreted Western characters, and snap-fit model kits.',
    extraMatch: ['artfx', 'bishoujo', 'cu[- ]poche'],
  },
  {
    slug: 'megahouse',
    name: 'MegaHouse',
    country: 'Japan',
    aliases: ['Mega House'],
    note: 'A Bandai Namco subsidiary specialising in high-detail scale figures, particularly long-running shonen licences.',
    knownFor:
      'The Portrait.Of.Pirates One Piece line, widely regarded as the reference standard for that franchise, and the Lookup and G.E.M. series.',
    extraMatch: ['portrait\\.?of\\.?pirates', '\\bp\\.?o\\.?p\\.? ?(?:limited|maximum|sailing)', '\\bg\\.?e\\.?m\\.?\\b'],
  },
  {
    slug: 'sega',
    name: 'Sega',
    country: 'Japan',
    aliases: ['Sega Prize', 'SEGA Fave'],
    note: 'Beyond video games, Sega operates one of Japan’s largest arcade networks and manufactures the prize figures stocked in them.',
    knownFor:
      'Luminasta, SPM (Super Premium Figure) and PM Perching prize lines, usually the most affordable retail-quality figures of a given character.',
    extraMatch: ['luminasta', '\\bspm figure\\b', 'pm perching'],
  },
  {
    slug: 'taito',
    name: 'Taito',
    country: 'Japan',
    aliases: ['Taito Corporation'],
    note: 'A Square Enix subsidiary and arcade operator, and the company that originally released Space Invaders in 1978.',
    knownFor:
      'Coreful and Artist MasterPiece prize figures distributed through its own arcade network.',
    extraMatch: ['\\bcoreful\\b', 'artist masterpiece'],
  },
  {
    slug: 'alter',
    name: 'Alter',
    country: 'Japan',
    aliases: ['ALTER Japan'],
    note: 'A Japanese manufacturer with a reputation among collectors for consistency of sculpt and paint quality across its scale range.',
    knownFor:
      'High-end 1/7 and 1/8 scale figures, usually produced in smaller runs than the prize manufacturers.',
  },
  {
    slug: 'aniplex',
    name: 'Aniplex',
    country: 'Japan',
    aliases: ['Aniplex+', 'Aniplex of America'],
    note: 'A Sony Music Entertainment Japan subsidiary that produces and distributes anime, including Demon Slayer and Fate/stay night.',
    knownFor:
      'Limited-run figures and merchandise released through its own Aniplex+ store, typically for series it produces itself.',
  },
  {
    slug: 'square-enix',
    name: 'Square Enix',
    country: 'Japan',
    aliases: ['Squenix', 'Square Enix Products'],
    note: 'The publisher of Final Fantasy, Dragon Quest and Kingdom Hearts, which manufactures figures of its own properties in-house.',
    knownFor:
      'The Play Arts and Bring Arts articulated lines, and Static Arts scale statues of Square Enix game characters.',
    extraMatch: ['play arts', 'bring arts', 'static arts'],
  },
  {
    slug: 'first-4-figures',
    name: 'First 4 Figures',
    country: 'United Kingdom',
    aliases: ['F4F'],
    note: 'A British manufacturer founded in 2003, working almost exclusively with video-game licences.',
    knownFor:
      'Large resin statues, frequently with light-up elements, produced as numbered limited editions.',
  },
  {
    slug: 'prime-1-studio',
    name: 'Prime 1 Studio',
    country: 'Japan',
    aliases: ['Prime1', 'Prime One Studio'],
    note: 'A Tokyo-based manufacturer of large-format collectibles, operating since 2012 across game, film and comic licences.',
    knownFor:
      'Museum-grade 1/4 and 1/3 scale statues, the upper end of the collectibles market by both size and price.',
  },
  {
    slug: 'hot-toys',
    name: 'Hot Toys',
    country: 'Hong Kong',
    aliases: ['Hot Toys Limited'],
    note: 'A Hong Kong manufacturer founded in 2000, known for licensed film collectibles at one-sixth scale.',
    knownFor:
      'Movie Masterpiece 1/6 figures with tailored fabric costumes and highly accurate head sculpts.',
    extraMatch: ['movie masterpiece'],
  },
  {
    slug: 'mcfarlane-toys',
    name: 'McFarlane Toys',
    country: 'United States',
    aliases: ['McFarlane'],
    note: 'Founded in 1994 by Spawn creator Todd McFarlane, and the current holder of the DC Multiverse action-figure licence.',
    knownFor:
      'DC Multiverse and video-game action figures at a mass-retail price point, sold on blister cards.',
    extraMatch: ['dc multiverse'],
  },
  {
    slug: 'jada-toys',
    name: 'Jada Toys',
    country: 'United States',
    aliases: ['Jada', 'Jada Toys Inc'],
    note: 'A California die-cast manufacturer founded in 1999, holding both automotive and entertainment licences.',
    knownFor:
      'Die-cast vehicles and metal-bodied figures, including the Hollywood Rides and Anime Rides lines.',
    extraMatch: ['hollywood rides', 'anime rides'],
  },
  {
    slug: 'maayan-publications',
    name: 'Maayan Publications',
    country: 'India',
    aliases: ['Maayan'],
    note: 'An Indian comics publisher producing original English-language titles.',
    knownFor: 'Single-issue comics and collected volumes published in India.',
    extraMatch: ['\\bmaayan\\b'],
  },
];

function escapeLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The TEXT signal — a regex over the product name, slug and description.
 *
 * Secondary to the `manufacturer` field, and only fires for makers whose name
 * or product line actually appears in the listing title. See the module
 * comment for why that currently means Funko and almost nothing else.
 */
export function manufacturerPattern(def: ManufacturerDef): string {
  const literals = [def.name, ...(def.aliases ?? [])].map(
    (n) => `\\b${escapeLiteral(n)}\\b`,
  );
  return [...literals, ...(def.extraMatch ?? [])].join('|');
}

/**
 * Names that satisfy the `manufacturer` FIELD signal, lowercased.
 *
 * Kept separate from the text pattern because the field is an exact-ish
 * value chosen from a form, not prose — comparing it as a set membership
 * test is both cheaper and less prone to a partial-word false positive than
 * running a regex over it.
 */
export function manufacturerFieldNames(def: ManufacturerDef): string[] {
  return [def.name, ...(def.aliases ?? [])].map((n) => n.trim().toLowerCase());
}

export function manufacturerBySlug(slug: string): ManufacturerDef | undefined {
  return MANUFACTURERS.find((m) => m.slug === slug);
}

/**
 * Values seen in the `manufacturer` column that carry no information.
 *
 * "Unknown" is the seller form's default and accounts for 75 of 83 products;
 * "Testing" and "Yukizi" are internal placeholders. Treating any of them as a
 * real maker would create a hub page for a value that means "nobody filled
 * this in", which is worse than having no page at all.
 */
export const PLACEHOLDER_MANUFACTURERS = new Set([
  'unknown',
  'testing',
  'test',
  'n/a',
  'na',
  'none',
  '-',
  'yukizi',
]);

export function isRealManufacturerValue(value?: string | null): boolean {
  const v = (value ?? '').trim().toLowerCase();
  return v.length > 0 && !PLACEHOLDER_MANUFACTURERS.has(v);
}
