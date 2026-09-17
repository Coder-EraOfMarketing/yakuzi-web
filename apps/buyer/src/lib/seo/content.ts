import type { CatalogProduct } from './catalog';
import { inStock, priceRange, priceOf, selectProducts, typeMatcher, characterMatcher } from './hub';
import { PRODUCT_TYPES, type ProductTypeDef } from './data/product-types';
import { charactersOfSeries, type CharacterDef } from './data/characters';
import { type SeriesDef } from './data/series';
import { SITE_NAME } from './site';

/**
 * Copy generation for the facet hubs.
 *
 * Everything here is derived from live catalogue data. Nothing is invented.
 *
 * That is not squeamishness, it is the entire strategy. The measurable thing
 * PharmaBag's pages do that Yukizi's did not is emit self-contained, numeric,
 * entity-named sentences — and when an answer engine was asked about that
 * site it quoted those sentences back verbatim ("a catalogue of 26,815
 * products", "436 manufacturers", "each order line must reach Rs 20,000").
 * Adjective-led prose, however well written, gives a retrieval system nothing
 * to lift.
 *
 * Style rules, chosen for how models actually consume a page:
 *
 *  - Lead with the answer. The first sentence must stand alone when quoted
 *    out of its page with no surrounding context.
 *  - Name the entity in full. Never "it", "this series", "these figures" —
 *    a quoted sentence loses its antecedent and becomes unattributable.
 *  - Prefer a number to an adjective. "from Rs 905" beats "affordable"; it is
 *    checkable, it is specific, and it is what the buyer actually asked.
 *  - Emit a sentence only when the underlying field exists. A sparse hub
 *    yields a short page rather than a confident wrong one.
 *
 * The consequence worth stating plainly: every number below is recomputed
 * from the live product set on each revalidation, so a hub can never claim a
 * price it does not offer or a count it does not have.
 */

/** Rupees, formatted the way Indian buyers read them. */
export function inr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/** Trimmed, single-spaced, length-capped text for meta fields. */
export function squash(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 40))}…`;
}

function plural(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}

/** "a figure" / "an action figure" — the FAQ headings read wrong without it. */
function article(word: string): string {
  return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
}

/** "Rs 905 to Rs 10,105", or "Rs 905" when everything costs the same. */
export function rangeText(products: CatalogProduct[]): string | null {
  const range = priceRange(products);
  if (!range) return null;
  return range.min === range.max
    ? inr(range.min)
    : `${inr(range.min)} to ${inr(range.max)}`;
}

/** Which product formats are actually present in a set, most-stocked first. */
export function typesPresent(products: CatalogProduct[]): Array<{
  def: ProductTypeDef;
  count: number;
}> {
  return PRODUCT_TYPES.map((def) => ({
    def,
    count: selectProducts(products, typeMatcher(def)).length,
  }))
    .filter((t) => t.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** Which characters of a series are actually represented, most-stocked first. */
export function charactersPresent(
  seriesSlug: string,
  products: CatalogProduct[],
): Array<{ def: CharacterDef; count: number }> {
  return charactersOfSeries(seriesSlug)
    .map((def) => ({
      def,
      count: selectProducts(products, characterMatcher(def)).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

/** Joins a list the way English does, with an Oxford-free final "and". */
export function listSentence(items: string[], max = 5): string {
  const shown = items.slice(0, max);
  if (shown.length === 0) return '';
  if (shown.length === 1) return shown[0];
  return `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}`;
}

export interface SpecRow {
  label: string;
  value: string;
}

/**
 * The at-a-glance table rendered near the top of every hub.
 *
 * Tables are disproportionately valuable for answer engines: a model parsing a
 * label/value pair is far less likely to mis-attribute a fact than one parsing
 * it out of a paragraph. Empty fields are dropped rather than rendered as
 * "N/A", which would otherwise teach a model that the value is literally the
 * string "N/A".
 */
export function hubSpecs(
  products: CatalogProduct[],
  extra: SpecRow[] = [],
): SpecRow[] {
  const range = priceRange(products);
  const available = products.filter(inStock).length;
  const formats = typesPresent(products);

  const rows: Array<SpecRow | null> = [
    { label: 'Products listed', value: String(products.length) },
    available > 0 ? { label: 'In stock now', value: String(available) } : null,
    range ? { label: 'Price range', value: rangeText(products) as string } : null,
    range && range.min !== range.max
      ? { label: 'Starting from', value: inr(range.min) }
      : null,
    formats.length
      ? {
          label: plural(formats.length, 'Format', 'Formats'),
          value: listSentence(formats.map((f) => f.def.name), 6),
        }
      : null,
    ...extra.map((r) => (r.value?.trim() ? r : null)),
    { label: 'Ships to', value: 'All India, tracked from dispatch' },
    { label: 'Sold by', value: `Verified sellers on ${SITE_NAME}` },
  ];

  return rows.filter(Boolean) as SpecRow[];
}

// ─── Series ──────────────────────────────────────────────────────────

export function seriesTitle(def: SeriesDef): string {
  return `${def.name} Figures & Merchandise — Buy Online in India`;
}

export function seriesDescription(
  def: SeriesDef,
  products: CatalogProduct[],
): string {
  const range = rangeText(products);
  const bits = [
    `Buy ${def.name} figures and collectibles online in India on ${SITE_NAME}.`,
  ];
  if (products.length) {
    bits.push(
      `${products.length} ${plural(products.length, 'product', 'products')} listed${range ? ` from ${inr(priceRange(products)!.min)}` : ''}.`,
    );
  }
  bits.push('Verified sellers, tracked delivery across India.');
  return squash(bits.join(' '));
}

/**
 * The paragraph most likely to be lifted into an AI Overview.
 *
 * It repeats the series name instead of leaning on the H1 above it, states
 * counts and prices as numbers, and never says "see below" — all three are
 * what make a passage quotable in isolation rather than merely readable.
 */
export function seriesSummary(def: SeriesDef, products: CatalogProduct[]): string {
  const sentences: string[] = [];
  const range = priceRange(products);
  const formats = typesPresent(products);
  const characters = charactersPresent(def.slug, products);
  const aka = def.aka?.length ? ` (also written ${listSentence(def.aka, 2)})` : '';

  sentences.push(
    `${def.name}${aka} merchandise on ${SITE_NAME} covers ${products.length} ${plural(
      products.length,
      'product',
      'products',
    )} listed by verified sellers and shipped across India.`,
  );

  sentences.push(`${def.note}`);

  if (range) {
    sentences.push(
      range.min === range.max
        ? `${def.name} collectibles on ${SITE_NAME} are listed at ${inr(range.min)}.`
        : `Prices for ${def.name} collectibles run from ${inr(range.min)} to ${inr(range.max)}, with the entry tier at ${inr(range.min)}.`,
    );
  }

  if (formats.length) {
    sentences.push(
      `The ${def.name} range is available as ${listSentence(
        formats.map((f) => f.def.name.toLowerCase()),
        4,
      )}.`,
    );
  }

  if (characters.length) {
    sentences.push(
      `Characters currently represented include ${listSentence(
        characters.map((c) => c.def.short),
        6,
      )}.`,
    );
  }

  const available = products.filter(inStock).length;
  if (available > 0) {
    sentences.push(
      `${available} ${plural(available, 'item is', 'items are')} in stock and ready to dispatch.`,
    );
  }

  return sentences.join(' ');
}

export function seriesFaqs(
  def: SeriesDef,
  products: CatalogProduct[],
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const range = priceRange(products);
  const formats = typesPresent(products);
  const characters = charactersPresent(def.slug, products);

  if (range) {
    faqs.push({
      question: `How much do ${def.name} figures cost in India?`,
      answer:
        range.min === range.max
          ? `${def.name} collectibles on ${SITE_NAME} are currently listed at ${inr(range.min)}. Prices are set by the seller and change with the format and size of the piece.`
          : `${def.name} collectibles on ${SITE_NAME} run from ${inr(range.min)} to ${inr(range.max)}. The lower end is small-format — miniatures, prize figures and keychains — and the upper end is large-scale statues. Prices are set by individual verified sellers and move with format, size and sculpt complexity.`,
    });
  }

  if (formats.length) {
    faqs.push({
      question: `What kinds of ${def.name} merchandise can I buy on ${SITE_NAME}?`,
      answer: `${def.name} is currently available on ${SITE_NAME} as ${listSentence(
        formats.map((f) => `${f.def.name.toLowerCase()} (${f.count})`),
        6,
      )}. New listings join this page automatically as sellers add them.`,
    });
  }

  if (characters.length) {
    faqs.push({
      question: `Which ${def.name} characters are available as figures?`,
      answer: `${listSentence(
        characters.map((c) => c.def.name),
        8,
      )} are currently listed on ${SITE_NAME}. Each character has its own page with every piece of that character in one place.`,
    });
  }

  faqs.push({
    question: `Are ${def.name} figures on ${SITE_NAME} authentic?`,
    answer: `Every seller on ${SITE_NAME} is verified before they are allowed to list, and each listing shows photographs of the actual item and its packaging. ${SITE_NAME} operates as a marketplace: multiple verified sellers may list the same ${def.name} piece, and the price shown is the best current offer.`,
  });

  faqs.push({
    question: `How long does delivery take for ${def.name} orders in India?`,
    answer: `Orders are processed within 24–48 hours of payment and typically deliver in 4–7 business days from dispatch anywhere in India. Tracking details are sent by email or phone once the parcel ships.`,
  });

  return faqs;
}

// ─── Character ───────────────────────────────────────────────────────

export function characterTitle(def: CharacterDef, seriesName: string): string {
  return `${def.name} Figures — Buy ${def.short} ${seriesName} Collectibles in India`;
}

export function characterDescription(
  def: CharacterDef,
  seriesName: string,
  products: CatalogProduct[],
): string {
  const range = priceRange(products);
  return squash(
    `Buy ${def.name} figures and statues from ${seriesName} online in India. ${products.length} ${plural(
      products.length,
      'listing',
      'listings',
    )}${range ? ` from ${inr(range.min)}` : ''} on ${SITE_NAME}, from verified sellers with tracked all-India delivery.`,
  );
}

export function characterSummary(
  def: CharacterDef,
  seriesName: string,
  products: CatalogProduct[],
): string {
  const sentences: string[] = [];
  const range = priceRange(products);
  const formats = typesPresent(products);

  sentences.push(
    `${def.name} is a character from ${seriesName}. ${def.note}`,
  );

  sentences.push(
    `${SITE_NAME} lists ${products.length} ${plural(
      products.length,
      'collectible',
      'collectibles',
    )} of ${def.short}${range ? `, priced ${range.min === range.max ? `at ${inr(range.min)}` : `from ${inr(range.min)} to ${inr(range.max)}`}` : ''}.`,
  );

  if (formats.length) {
    // Plural form names, not `singular`: "available as action figure and
    // collectible statue" is ungrammatical, and this sentence ships on every
    // character hub.
    sentences.push(
      `${def.short} is available as ${listSentence(
        formats.map((f) => f.def.name.toLowerCase()),
        4,
      )}.`,
    );
  }

  const available = products.filter(inStock).length;
  sentences.push(
    available > 0
      ? `${available} ${plural(available, 'listing is', 'listings are')} in stock now, sold by verified sellers and shipped across India.`
      : `Every ${def.short} listing is currently out of stock; new listings appear on this page automatically as sellers restock.`,
  );

  return sentences.join(' ');
}

export function characterFaqs(
  def: CharacterDef,
  seriesName: string,
  products: CatalogProduct[],
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const range = priceRange(products);
  const formats = typesPresent(products);

  if (range) {
    faqs.push({
      question: `What is the price of a ${def.short} figure in India?`,
      answer:
        range.min === range.max
          ? `${def.name} figures are listed on ${SITE_NAME} at ${inr(range.min)}. The price is set by the seller and covers the piece as photographed in the listing.`
          : `${def.name} figures on ${SITE_NAME} are listed from ${inr(range.min)} to ${inr(range.max)}. The spread is format-driven: small-format and prize figures sit at the lower end, large-scale statues at the upper end.`,
    });
  }

  if (formats.length) {
    faqs.push({
      question: `What kinds of ${def.short} figures are available?`,
      answer: `${def.name} is currently listed as ${listSentence(
        formats.map((f) => `${f.def.name.toLowerCase()} (${f.count})`),
        5,
      )} on ${SITE_NAME}.`,
    });
  }

  faqs.push({
    question: `Which series is ${def.short} from?`,
    answer: `${def.name} appears in ${seriesName}. ${def.note}`,
  });

  faqs.push({
    question: `Does ${SITE_NAME} deliver ${def.short} figures across India?`,
    answer: `Yes. Every order ships across India and is tracked from dispatch, with delivery typically 4–7 business days after the parcel leaves the seller. Returns cover damaged or incorrect deliveries reported within 3 days with photographs; change-of-mind returns are not accepted.`,
  });

  return faqs;
}

// ─── Product type ────────────────────────────────────────────────────

export function typeTitle(def: ProductTypeDef): string {
  return `${def.name} — Buy Anime & Pop Culture ${def.name} Online in India`;
}

export function typeDescription(
  def: ProductTypeDef,
  products: CatalogProduct[],
): string {
  const range = priceRange(products);
  return squash(
    `Shop ${def.name.toLowerCase()} in India on ${SITE_NAME}. ${products.length} ${plural(
      products.length,
      'listing',
      'listings',
    )}${range ? ` from ${inr(range.min)}` : ''}, across anime, gaming and comic licences, from verified sellers.`,
  );
}

export function typeSummary(
  def: ProductTypeDef,
  products: CatalogProduct[],
  seriesNames: string[],
): string {
  const sentences: string[] = [];
  const range = priceRange(products);

  sentences.push(`${def.note}`);
  sentences.push(
    `${SITE_NAME} lists ${products.length} ${def.name.toLowerCase()}${range ? ` priced ${range.min === range.max ? `at ${inr(range.min)}` : `from ${inr(range.min)} to ${inr(range.max)}`}` : ''}, sold by verified sellers and shipped across India.`,
  );
  if (seriesNames.length) {
    sentences.push(
      `Licences currently represented as ${def.name.toLowerCase()} include ${listSentence(seriesNames, 6)}.`,
    );
  }
  return sentences.join(' ');
}

export function typeFaqs(
  def: ProductTypeDef,
  products: CatalogProduct[],
): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const range = priceRange(products);

  faqs.push({
    question: `What is ${article(def.singular)} ${def.singular}?`,
    answer: def.note,
  });

  if (range) {
    faqs.push({
      question: `How much do ${def.name.toLowerCase()} cost in India?`,
      answer:
        range.min === range.max
          ? `${def.name} on ${SITE_NAME} are listed at ${inr(range.min)}.`
          : `${def.name} on ${SITE_NAME} are listed from ${inr(range.min)} to ${inr(range.max)}. Within a single format the spread is driven by licence, size and how recently the piece was released.`,
    });
  }

  faqs.push({
    question: `Are ${def.name.toLowerCase()} on ${SITE_NAME} officially licensed?`,
    answer: `Every seller is verified before listing, and each listing carries photographs of the actual item and its packaging. ${SITE_NAME} is a marketplace, so more than one verified seller may list the same piece and the price shown is the best current offer.`,
  });

  return faqs;
}

// ─── Series x type cross ─────────────────────────────────────────────

export function seriesTypeTitle(series: SeriesDef, type: ProductTypeDef): string {
  return `${series.name} ${type.name} — Buy Online in India`;
}

export function seriesTypeDescription(
  series: SeriesDef,
  type: ProductTypeDef,
  products: CatalogProduct[],
): string {
  const range = priceRange(products);
  return squash(
    `Buy ${series.name} ${type.name.toLowerCase()} online in India. ${products.length} ${plural(
      products.length,
      'listing',
      'listings',
    )}${range ? ` from ${inr(range.min)}` : ''} on ${SITE_NAME}, from verified sellers with tracked delivery.`,
  );
}

export function seriesTypeSummary(
  series: SeriesDef,
  type: ProductTypeDef,
  products: CatalogProduct[],
): string {
  const range = priceRange(products);
  const characters = charactersPresent(series.slug, products);
  const sentences: string[] = [];

  sentences.push(
    `${SITE_NAME} lists ${products.length} ${series.name} ${type.name.toLowerCase()}${range ? `, priced ${range.min === range.max ? `at ${inr(range.min)}` : `from ${inr(range.min)} to ${inr(range.max)}`}` : ''}.`,
  );
  // The format defines itself on every cross page, so the page stands alone
  // when it is the only one an assistant has fetched.
  sentences.push(type.note);
  if (characters.length) {
    sentences.push(
      `${series.name} characters available in this format: ${listSentence(
        characters.map((c) => c.def.short),
        6,
      )}.`,
    );
  }
  return sentences.join(' ');
}

// ─── Place ───────────────────────────────────────────────────────────

export function placeTitle(placeName: string): string {
  return `Anime Figures & Collectibles in ${placeName} — Buy Online`;
}

export function placeDescription(
  placeName: string,
  products: CatalogProduct[],
): string {
  const range = priceRange(products);
  return squash(
    `Buy anime figures, Funko Pops and collectibles in ${placeName} on ${SITE_NAME}. ${products.length} ${plural(
      products.length,
      'product',
      'products',
    )}${range ? ` from ${inr(range.min)}` : ''}, delivered to ${placeName} with tracking.`,
  );
}

/**
 * Place copy, written to be honest about what a place page actually is.
 *
 * Yukizi has no branch, no local warehouse and no city-level price. Saying so
 * outright costs nothing — a buyer searching "anime store in Pune" wants to
 * know they can get the thing delivered, not that a shop exists — and it
 * keeps the page from making a claim that a Google reviewer, or a buyer,
 * could check and find false.
 */
export function placeSummary(
  placeName: string,
  regionName: string | null,
  note: string | undefined,
  products: CatalogProduct[],
): string {
  const sentences: string[] = [];
  const range = priceRange(products);
  const formats = typesPresent(products);

  sentences.push(
    `${SITE_NAME} delivers anime figures, Funko Pops, manga and pop-culture collectibles to ${placeName}${regionName ? `, ${regionName}` : ''}.`,
  );
  sentences.push(
    `${SITE_NAME} is an online marketplace rather than a physical shop: there is no ${placeName} store to visit, and orders placed from ${placeName} ship from verified sellers across India with tracking from dispatch.`,
  );
  if (note) sentences.push(note);
  if (range) {
    sentences.push(
      `${products.length} ${plural(products.length, 'product is', 'products are')} listed for delivery to ${placeName}, priced from ${inr(range.min)} to ${inr(range.max)}.`,
    );
  }
  if (formats.length) {
    sentences.push(
      `Formats available include ${listSentence(formats.map((f) => f.def.name.toLowerCase()), 5)}.`,
    );
  }
  sentences.push(
    `Delivery to ${placeName} typically takes 4–7 business days from dispatch, with orders processed within 24–48 hours of payment.`,
  );

  return sentences.join(' ');
}

export function placeFaqs(
  placeName: string,
  products: CatalogProduct[],
): Array<{ question: string; answer: string }> {
  const range = priceRange(products);
  const faqs: Array<{ question: string; answer: string }> = [
    {
      question: `Does ${SITE_NAME} deliver anime figures to ${placeName}?`,
      answer: `Yes. ${SITE_NAME} ships to every serviceable pin code in ${placeName} and across India. Orders are processed within 24–48 hours of payment and typically arrive 4–7 business days after dispatch, with tracking sent by email or phone.`,
    },
    {
      question: `Is there a ${SITE_NAME} store in ${placeName}?`,
      answer: `No. ${SITE_NAME} is an online marketplace, not a chain of shops — there is no counter to visit in ${placeName}. Every order is placed on the site and delivered by courier from a verified seller.`,
    },
  ];

  if (range) {
    faqs.push({
      question: `How much do anime figures cost in ${placeName}?`,
      answer: `Listings delivered to ${placeName} run from ${inr(range.min)} to ${inr(range.max)} on ${SITE_NAME}. Prices are set nationally by each seller — there is no ${placeName}-specific price — and shipping is shown on the product page before checkout.`,
    });
  }

  faqs.push({
    question: `Where can I buy authentic Funko Pops and anime statues in ${placeName}?`,
    answer: `${SITE_NAME} lists ${products.length} ${plural(products.length, 'product', 'products')} from sellers verified before they are allowed to list, each with photographs of the actual item and packaging. Orders ship to ${placeName} with tracking, and damaged or incorrect deliveries are covered when reported within 3 days with photographs.`,
  });

  return faqs;
}

// ─── Price band ──────────────────────────────────────────────────────

export function priceSummary(
  bandName: string,
  products: CatalogProduct[],
  seriesNames: string[],
): string {
  const sentences: string[] = [];
  const range = priceRange(products);
  const formats = typesPresent(products);

  sentences.push(
    `${SITE_NAME} lists ${products.length} anime and pop-culture ${plural(
      products.length,
      'collectible',
      'collectibles',
    )} priced ${bandName.toLowerCase()}${range ? `, running from ${inr(range.min)} to ${inr(range.max)}` : ''}.`,
  );
  if (formats.length) {
    sentences.push(
      `At this price the catalogue is mostly ${listSentence(
        formats.slice(0, 3).map((f) => f.def.name.toLowerCase()),
        3,
      )}.`,
    );
  }
  if (seriesNames.length) {
    sentences.push(`Licences in this band include ${listSentence(seriesNames, 6)}.`);
  }
  return sentences.join(' ');
}

export { priceOf };
