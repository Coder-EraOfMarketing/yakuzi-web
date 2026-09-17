/**
 * The price axis — budget-shaped queries.
 *
 * "anime figures under 1000" is one of the highest-volume shapes in Indian
 * collectibles search and one of the least contested, because marketplaces
 * serve it with a filtered listing URL that carries no copy and no canonical
 * of its own. A real page with real copy beats a filter parameter every time.
 *
 * Unlike every other axis here, these hubs are defined purely by a numeric
 * bound: membership is decided by the live price, so a hub can never claim a
 * product it does not have at that price. When a seller re-prices, the product
 * moves hubs on the next revalidation with no edit anywhere.
 *
 * Bounds are inclusive of `min` and exclusive of `max`, so the bands tile the
 * whole range with no gap and no overlap — a product cannot appear in two,
 * which is what would otherwise make these pages duplicates of each other.
 */

export interface PriceBandDef {
  slug: string;
  name: string;
  /** Inclusive lower bound in rupees. */
  min: number;
  /** Exclusive upper bound in rupees; omit for the open-ended top band. */
  max?: number;
  title: string;
  metaDescription: string;
  h1: string;
  /** Hand-written, distinct per band — these must not read as one template. */
  intro: string[];
  faqs: Array<{ question: string; answer: string }>;
}

/** A price hub needs this many live matches before it may index. */
export const MIN_PRODUCTS_PRICE = 3;

export const PRICE_BANDS: PriceBandDef[] = [
  {
    slug: 'under-1000',
    name: 'Under ₹1,000',
    min: 0,
    max: 1000,
    title: 'Anime Figures & Collectibles Under ₹1,000',
    metaDescription:
      'Anime figures and collectibles under ₹1,000 in India — small-format figures, keychains and manga from verified sellers on Yukizi.',
    h1: 'Anime Collectibles Under ₹1,000',
    intro: [
      'This is the entry shelf. Below a thousand rupees you are generally buying small-format pieces — noodle-stopper figures, miniatures, keychains, single manga volumes — rather than scale statues, and that is worth knowing before you order rather than after. The sculpting on this tier is simpler and the paint applications fewer, but the licensing is the same and the character reads correctly, which is the whole point of a first figure.',
      'Everything on this page is priced live from the marketplace, so the list re-sorts itself as sellers adjust. If a piece you want sits just over the line, check it again in a week — discounts move products across these bands constantly.',
    ],
    faqs: [
      {
        question: 'What kind of anime figure can you actually get under ₹1,000 in India?',
        answer:
          'Realistically: small-format pieces. Noodle-stopper and prize figures, chibi and miniature sculpts, keychains and acrylic charms, and single manga volumes. Full scale statues start higher because the resin, the sculpt complexity and the box all cost more.',
      },
      {
        question: 'Are cheaper figures on Yukizi still officially licensed?',
        answer:
          'Every seller on Yukizi is verified before they can list, and the listing photographs show the actual packaging. Price tier reflects format and size, not authenticity — a ₹900 noodle stopper is a licensed FuRyu prize figure, not a lesser version of a bigger one.',
      },
      {
        question: 'Is shipping worth it on a low-value order?',
        answer:
          'Shipping is charged per listing and is shown on the product page before you commit, so you can see the landed cost rather than discovering it at checkout. Combining pieces from one seller is usually the cheaper route on this tier.',
      },
    ],
  },
  {
    slug: '1000-to-2500',
    name: '₹1,000 – ₹2,500',
    min: 1000,
    max: 2500,
    title: 'Anime Figures Between ₹1,000 and ₹2,500',
    metaDescription:
      'Anime figures from ₹1,000 to ₹2,500 in India — Funko Pops, action figures and mid-size statues from verified sellers on Yukizi.',
    h1: 'Anime Figures from ₹1,000 to ₹2,500',
    intro: [
      'The mid-tier is where most collections actually get built. This band covers the bulk of the Funko Pop catalogue, standard articulated action figures, and the smaller end of the collectible statue range — pieces substantial enough to anchor a shelf without committing to a centrepiece.',
      'A practical note on choosing within this band: articulation and fixed-pose sculpts cost roughly the same here but age differently on a shelf. Articulated figures let you change the display; statues hold a single silhouette but usually carry better paintwork at the same price. Neither is the right answer — it depends on whether you like rearranging.',
    ],
    faqs: [
      {
        question: 'What is the typical price of a Funko Pop in India?',
        answer:
          'Standard Funko Pops generally land inside this band. Exclusives, convention releases and chase variants price above it, and the sticker on the box is what drives that difference — check the listing photographs for it before ordering.',
      },
      {
        question: 'Should I buy an action figure or a statue in this range?',
        answer:
          'Articulated action figures let you change the pose and suit a display you rearrange. Fixed-pose statues put the same money into sculpt and paint instead, so they usually look better standing still. At this price the two are genuinely comparable — pick by how you display.',
      },
    ],
  },
  {
    slug: '2500-to-5000',
    name: '₹2,500 – ₹5,000',
    min: 2500,
    max: 5000,
    title: 'Anime Statues & Figures Between ₹2,500 and ₹5,000',
    metaDescription:
      'Anime statues and collectibles from ₹2,500 to ₹5,000 in India — larger scale figures and detailed sculpts from verified sellers on Yukizi.',
    h1: 'Anime Figures from ₹2,500 to ₹5,000',
    intro: [
      'Above ₹2,500 the format changes: sculpts get larger, bases get sculpted rather than moulded flat, and effect parts — aura, flame, water — start appearing as separate translucent pieces rather than painted-on suggestions. This is the band where a figure stops being a shelf-filler and starts being the thing people notice in the room.',
      'Size becomes a real consideration here. Check the stated height on the listing against the shelf you intend to use, because a 30 cm piece with an effect base often needs closer to 35 cm of clearance and considerably more depth than photographs suggest.',
    ],
    faqs: [
      {
        question: 'What changes about a figure above ₹2,500?',
        answer:
          'Three things, usually: overall height, the base (sculpted and themed rather than a plain disc), and separate translucent effect parts for things like aura and flame. The paint also moves from flat application to blended gradients on faces and hair.',
      },
      {
        question: 'How much shelf space does a figure in this range need?',
        answer:
          'More than the height alone suggests. Effect bases add both height and depth, so allow roughly 15–20% over the stated dimensions. The listing states the height for each piece — check it before ordering rather than after.',
      },
    ],
  },
  {
    slug: '5000-to-10000',
    name: '₹5,000 – ₹10,000',
    min: 5000,
    max: 10000,
    title: 'Premium Anime Statues Between ₹5,000 and ₹10,000',
    metaDescription:
      'Premium anime statues from ₹5,000 to ₹10,000 in India — large-scale sculpts and diorama pieces from verified sellers on Yukizi.',
    h1: 'Premium Anime Statues from ₹5,000 to ₹10,000',
    intro: [
      'These are display centrepieces rather than collection volume. At this level you are paying for scale and for sculpt complexity that cannot be mass-moulded: multi-part dioramas, layered translucent effects, textured terrain bases and hand-finished gradients on skin and fabric.',
      'Buying at this tier is worth slowing down for. Read the listing photographs closely — at this size, paint transitions and seam lines are visible from across a room, and the photographs are of the actual piece being sold. Transit damage on large resin pieces is covered when reported within 3 days of delivery with clear photographs of both the piece and the packaging.',
    ],
    faqs: [
      {
        question: 'What justifies the price of a statue above ₹5,000?',
        answer:
          'Scale and sculpt complexity. Multi-part dioramas, translucent effect pieces, textured bases and hand-finished paint gradients cannot be produced at small-format cost. These are single display centrepieces, not shelf volume.',
      },
      {
        question: 'How are large statues protected in transit across India?',
        answer:
          'Sellers pack large pieces for courier transit, and transit damage is covered: report it within 3 days of delivery with clear photographs of the piece and the packaging for a replacement or a refund to your original payment method.',
      },
    ],
  },
  {
    slug: 'above-10000',
    name: 'Above ₹10,000',
    min: 10000,
    title: 'Grail Anime Statues & Prop Replicas Above ₹10,000',
    metaDescription:
      'Grail-tier anime statues and 1:1 prop replicas above ₹10,000 in India — the largest and most detailed pieces from verified sellers on Yukizi.',
    h1: 'Grail Statues & Replicas Above ₹10,000',
    intro: [
      'Collectors call these grails: the one piece a shelf is built around. Above ₹10,000 the catalogue is large-scale statues measured in tens of centimetres and 1:1 prop replicas meant to be worn or mounted rather than displayed on a desk.',
      'Two things matter more at this tier than at any other. First, dimensions — verify the stated height and the depth of the base against your actual display space, because returns on change of mind are not accepted. Second, photographs: every listing shows the specific piece, so study the paintwork before you commit rather than relying on the manufacturer’s promotional renders.',
    ],
    faqs: [
      {
        question: 'What is available above ₹10,000 on Yukizi?',
        answer:
          'Large-scale collectible statues — typically 50 cm and up — and 1:1 prop replicas such as wearable helmets. These are single-purchase centrepieces rather than collection volume.',
      },
      {
        question: 'Can I return a grail piece if I change my mind?',
        answer:
          'No. Change-of-mind returns are not accepted at any price on Yukizi. Returns cover damaged or incorrect deliveries, reported within 3 days of delivery with photographs. At this tier that makes checking the stated dimensions before ordering genuinely important.',
      },
    ],
  },
];

export function priceBandBySlug(slug: string): PriceBandDef | undefined {
  return PRICE_BANDS.find((b) => b.slug === slug);
}

/** The single band a price falls in, or undefined for a missing price. */
export function bandForPrice(price: number | null | undefined): PriceBandDef | undefined {
  if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0) return undefined;
  return PRICE_BANDS.find((b) => price >= b.min && (b.max == null || price < b.max));
}
