/**
 * The gifting axis — occasion-shaped intent.
 *
 * Indian festival gifting is a large, strongly seasonal and badly served
 * search category. "diwali gift for brother", "rakhi gift ideas", "gift for
 * anime fan" all spike hard and predictably, and are answered mostly by
 * generic gifting listicles with no knowledge of the category.
 *
 * ── The honesty problem, and how these pages handle it ────────────────
 *
 * A gift page does NOT have a secret different catalogue. The Diwali page and
 * the Rakhi page draw on the same products, and pretending otherwise is how
 * an occasion family turns into nine near-identical doorway pages.
 *
 * What genuinely differs, and is therefore what these pages are built on:
 *
 *   1. BUDGET. A Rakhi gift and an anniversary gift are not the same amount
 *      of money, and the bounds below are real filters that produce
 *      materially different product sets. This is the load-bearing
 *      difference, not a cosmetic one.
 *   2. CRITERIA. What makes a good gift changes by occasion — recognisability
 *      for someone you know less well, a specific character for someone you
 *      know well, size for a shared living space.
 *   3. LEAD TIME. A festival has a fixed date and shipping does not care, so
 *      the order-by advice is genuinely different information per occasion.
 *
 * Each page states its bounds explicitly rather than implying a curated set
 * that does not exist, and noindexes when it has too few matches to be worth
 * ranking. Adding an occasion whose budget and criteria duplicate an existing
 * one produces a doorway page — the bounds are the test of whether it earns a
 * URL.
 *
 * Dates are described by their position in the calendar rather than pinned to
 * a specific date, because most of these follow the lunar calendar and a
 * hardcoded date goes wrong within a year.
 */

export interface GiftOccasionDef {
  slug: string;
  /** Short display name — chips, breadcrumbs, the link hub. */
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  /** When it falls. Honest about lunar-calendar variability. */
  timing: string;
  /** Inclusive lower price bound in rupees. */
  minPrice?: number;
  /** Exclusive upper price bound in rupees. */
  maxPrice?: number;
  /** Hand-written, distinct per occasion. Must not share sentence structure. */
  intro: string[];
  /** What makes a good gift for THIS occasion specifically. */
  criteria: string[];
  /** Order-by advice. Real, occasion-specific information. */
  leadTime: string;
  faqs: Array<{ question: string; answer: string }>;
}

/** A gift page needs this many live matches in its band before it may index. */
export const MIN_PRODUCTS_GIFT = 4;

export const GIFT_OCCASIONS: GiftOccasionDef[] = [
  {
    slug: 'anime-fan',
    name: 'For an Anime Fan',
    title: 'Gifts for Anime Fans — What to Buy and What to Avoid',
    metaDescription:
      'Gift ideas for anime fans in India under ₹5,000 — how to pick the right character, which formats are safest, and what to avoid buying.',
    h1: 'Gifts for Anime Fans',
    timing: 'Any time of year.',
    maxPrice: 5000,
    intro: [
      'Gifting an anime fan is easy to get wrong in a specific way: generic merch reads as generic. A hoodie with a large logo on it says you knew they liked anime. A figure of the right character says you knew which anime, and that is the whole difference.',
      'So the useful question is not "what do anime fans like" but "which series are they watching right now". One question answers it, and it is not a strange question to ask — fans talk about this readily and would much rather be asked than receive the wrong character.',
      'Everything on this page is under ₹5,000, which is the range where a figure is substantial enough to display without being a commitment you have to justify.',
    ],
    criteria: [
      'Pick the character, not the series. A fan of Demon Slayer has a favourite Hashira, and the wrong one is a near-miss rather than a hit.',
      'Check the pose in the listing photographs. Fans usually have a preferred era or form of their character, and a figure of the wrong arc reads as a guess.',
      'Under ₹2,500, a Funko Pop or a prize figure is the safest format — recognisable, well made, and unambiguous about what it is.',
      'Avoid apparel unless you know the size. Figures have no sizing problem.',
      'If you genuinely cannot find out the series, protagonists from Naruto, One Piece, Dragon Ball and Demon Slayer have the highest recognition in India by a wide margin.',
    ],
    leadTime:
      'Orders process within 24–48 hours and deliver in 4–7 business days from dispatch, so allow a week for anything with a date attached to it.',
    faqs: [
      {
        question: 'What is a safe gift if I do not know their favourite character?',
        answer:
          'Ask which anime they are currently watching and pick that series’ lead. If asking is not an option, the protagonists of Naruto, One Piece, Dragon Ball and Demon Slayer are the highest-recognition choices in India — a fan who does not collect that series will still know exactly who it is.',
      },
      {
        question: 'Is a Funko Pop a good gift for an anime fan?',
        answer:
          'Usually yes, and especially for a first gift. It is instantly recognisable, well made, sits on any desk, and at that price it reads as thoughtful without being a commitment. A serious collector may already own it — which is where asking about the series pays off.',
      },
      {
        question: 'How much should I spend on a gift for an anime fan?',
        answer:
          '₹1,000 to ₹2,500 buys a properly licensed figure of almost any popular character and is where most gifting lands. Below ₹1,000 you are buying small-format pieces, which are genuine but small. Above ₹5,000 you are buying a display centrepiece, which is a different kind of gift.',
      },
    ],
  },

  {
    slug: 'diwali',
    name: 'Diwali',
    title: 'Diwali Gifts for Anime Fans — Figures & Collectibles',
    metaDescription:
      'Diwali gift ideas for anime fans in India, ₹1,000–₹6,000 — boxed figures that present well, plus the order-by date for festival courier load.',
    h1: 'Diwali Gifts for Anime Fans',
    timing:
      'Diwali falls in October or November, following the lunar calendar, so the date moves each year.',
    minPrice: 1000,
    maxPrice: 6000,
    intro: [
      'Diwali gifting has a particular shape to it: gifts are given across a wide circle — siblings, cousins, colleagues, the family you visit — and they are given in person, usually over a few days. That makes size and presentability matter more than they do for a birthday present handed over privately.',
      'A boxed figure works well here for exactly that reason. It arrives looking like a gift without needing wrapping, the box carries the character so the recipient sees what it is immediately, and it survives being carried around to three houses in a car boot.',
      'The band on this page is ₹1,000 to ₹6,000, which covers the range most Diwali gifting actually occupies — above a token and below the point where a gift becomes awkward to receive.',
    ],
    criteria: [
      'Boxed rather than loose. The packaging does the presentation work, and a figure handed over in a box reads as a gift rather than as an object.',
      'Mid-size over large. A 50 cm statue is a beautiful thing and an awkward one to hand to someone in a room full of relatives.',
      'LED and light-up pieces suit the occasion unusually well — it is a festival of lights, and a lit figure is a display piece that is actually seasonal.',
      'Avoid anything with fragile thin extremities if the gift will be transported between houses.',
      'For colleagues and acquaintances, stay under ₹2,500 and choose a high-recognition character rather than a deep-cut one.',
    ],
    leadTime:
      'Order at least ten days before Diwali. Courier networks across India run at peak load through the festival season and transit times stretch, so the usual 4–7 business days from dispatch is the optimistic case rather than the expected one.',
    faqs: [
      {
        question: 'Are anime figures a good Diwali gift?',
        answer:
          'For a recipient who watches anime, yes — a boxed figure presents well, needs no wrapping, and is unmistakably chosen for them rather than bought in bulk. Choose mid-size and boxed over large and loose, since Diwali gifts tend to be handed over in person and carried between houses.',
      },
      {
        question: 'When should I order a Diwali gift to get it in time?',
        answer:
          'At least ten days before. Orders process in 24–48 hours and normally deliver 4–7 business days from dispatch, but courier networks run at peak load through the festival season and transit times stretch. Ordering two weeks out removes the risk entirely.',
      },
      {
        question: 'What is a good Diwali gift budget for a colleague?',
        answer:
          'Under ₹2,500 is comfortable for a colleague — enough to be a real gift without creating an obligation to reciprocate at the same level. Pick a widely recognised character rather than something specific to a series you are not sure they watch.',
      },
    ],
  },

  {
    slug: 'rakhi',
    name: 'Raksha Bandhan',
    title: 'Raksha Bandhan Gifts for Brothers Who Watch Anime',
    metaDescription:
      'Raksha Bandhan gift ideas for brothers who watch anime, ₹500–₹3,000 — Funko Pops, prize figures and desk-sized pieces, delivered across India.',
    h1: 'Rakhi Gifts for Anime Fans',
    timing:
      'Raksha Bandhan falls on the full moon of Shravana, usually in August. The date moves each year with the lunar calendar.',
    minPrice: 500,
    maxPrice: 3000,
    intro: [
      'The Rakhi return gift has an understood budget, and it is not a large one. That is genuinely useful information rather than a limitation: it narrows the field to the formats that are good at this price, which are Funko Pops, prize figures and small-format sculpts.',
      'It also has a specific advantage over most gifting occasions — you almost certainly know what your sibling watches. There is no guessing required, which means a ₹1,200 figure of the exact right character lands harder than a ₹4,000 figure of an approximately right one.',
      'This page is bounded at ₹500 to ₹3,000, which is where Rakhi gifting sits in practice.',
    ],
    criteria: [
      'You know their series — use that. This is the occasion where a specific character beats a safe one.',
      'Funko Pops are the strongest format at this budget: recognisable, boxed, and they sit on a desk or a hostel shelf without needing a cabinet.',
      'Desk-sized pieces travel well by post if you are sending rather than handing over.',
      'Noodle stopper and prize figures are the entry tier and are fully licensed — a ₹900 figure here is a real product, not a compromise.',
      'If they are at a hostel or a shared flat, small wins. Nobody thanks you for a 40 cm statue and no shelf.',
    ],
    leadTime:
      'Order a week ahead. If you are posting a Rakhi and a gift separately, send the gift first — Rakhi post volumes are heavy in the days before the festival and the parcel is the slower of the two.',
    faqs: [
      {
        question: 'What is a good Rakhi gift for a brother who likes anime?',
        answer:
          'A figure of the character from the series he actually watches. At the usual Rakhi budget of ₹500–₹3,000, a Funko Pop or a prize figure of the right character beats a larger piece of a character you guessed at. This is the one occasion where you almost certainly know the answer already.',
      },
      {
        question: 'How much should a Rakhi gift cost?',
        answer:
          'The understood range is roughly ₹500 to ₹3,000, and that is where this page is bounded. It covers Funko Pops, prize figures and small-format sculpts — the formats that are genuinely good rather than merely cheap at that price.',
      },
      {
        question: 'Can I send a Rakhi gift to another city?',
        answer:
          'Yes — orders ship to every serviceable pin code in India with tracking, typically 4–7 business days from dispatch. Send it about a week ahead, and earlier than the Rakhi itself if you are posting them separately, because parcel volumes peak just before the festival.',
      },
    ],
  },

  {
    slug: 'bhai-dooj',
    name: 'Bhai Dooj',
    title: 'Bhai Dooj Gifts — Anime Figures for Siblings',
    metaDescription:
      'Bhai Dooj gift ideas for siblings who watch anime, ₹500–₹3,000 — and why you need to order before Diwali week rather than after it.',
    h1: 'Bhai Dooj Gifts for Anime Fans',
    timing:
      'Bhai Dooj falls two days after Diwali, in October or November depending on the year.',
    minPrice: 500,
    maxPrice: 3000,
    intro: [
      'Bhai Dooj lands two days after Diwali, and that adjacency is the thing worth planning around. Courier networks are already at their annual peak, and anything ordered during Diwali week is competing with the entire country’s festival shipping.',
      'The gift itself follows similar conventions to Rakhi — a sibling gift at a moderate budget, given in person — so the same formats work: boxed, desk-sized, and a character you know they follow rather than one you hope they do.',
      'Bounded at ₹500 to ₹3,000, the range this occasion actually occupies.',
    ],
    criteria: [
      'Order before Diwali, not after. This is the single most useful piece of advice for this occasion.',
      'Boxed and desk-sized, as with Rakhi — the gift is handed over in person and often carried between houses.',
      'A character from a series they are currently watching, not one they watched years ago.',
      'If Diwali and Bhai Dooj gifts are both being given, avoid duplicating the format — two boxed Funko Pops two days apart reads as one idea used twice.',
    ],
    leadTime:
      'Order before Diwali week begins. Because Bhai Dooj falls two days after Diwali, a parcel placed during the festival is entering the courier network at its annual peak — build in at least two weeks.',
    faqs: [
      {
        question: 'When should I order a Bhai Dooj gift?',
        answer:
          'Before Diwali week starts, which in practice means at least two weeks before Bhai Dooj itself. The festival falls two days after Diwali, so anything ordered during Diwali is entering the courier network at its busiest point of the year.',
      },
      {
        question: 'What is a good Bhai Dooj gift for a sibling who watches anime?',
        answer:
          'A boxed, desk-sized figure of a character from a series they currently follow, in the ₹500–₹3,000 range. The conventions are close to Rakhi: moderate budget, given in person, and you usually know exactly what they watch.',
      },
    ],
  },

  {
    slug: 'friendship-day',
    name: 'Friendship Day',
    title: 'Friendship Day Gifts for Anime Fans in India',
    metaDescription:
      'Friendship Day gifts for anime fans under ₹1,500 — keychains, miniatures, noodle stopper figures and manga volumes, all officially licensed.',
    h1: 'Friendship Day Gifts for Anime Fans',
    timing: 'Friendship Day is observed in India on the first Sunday of August.',
    maxPrice: 1500,
    intro: [
      'Friendship Day gifting is deliberately small, and that is the point of it — a token that says you remembered, not a present that creates an obligation. Which makes this the one occasion where the entry tier is not a compromise but the correct choice.',
      'Under ₹1,500 the catalogue is small-format: keychains, acrylic charms, miniature and chibi figures, noodle stoppers, single manga volumes. All of them are officially licensed, all of them fit in a pocket or a bag, and all of them are easy to hand over without ceremony.',
      'There is also a genuinely good move available here that costs almost nothing: a figure of a character from a series you both watch. It works as a gift and as a reference.',
    ],
    criteria: [
      'Keep it under ₹1,500. Going substantially over changes what the gift means.',
      'Small-format pieces are the right answer, not a budget version of one — noodle stoppers and miniatures are licensed products in their own tier.',
      'A shared reference beats an expensive object. A character from a series you both watch is the best value on this page.',
      'Keychains and charms work for a friend without shelf space, which covers most people in a hostel or a shared flat.',
      'Manga volumes are a good option if they read — a single volume sits comfortably in this band.',
    ],
    leadTime:
      'Friendship Day falls on the first Sunday of August, so order by the last week of July. Delivery is typically 4–7 business days from dispatch.',
    faqs: [
      {
        question: 'When is Friendship Day in India?',
        answer:
          'The first Sunday of August. Because it moves each year, order by the last week of July to allow the usual 4–7 business days from dispatch.',
      },
      {
        question: 'What is a good Friendship Day gift under ₹1,500?',
        answer:
          'Small-format licensed pieces: keychains and acrylic charms, chibi and miniature figures, noodle stopper figures, or a single manga volume. All are genuine licensed products rather than cheap substitutes, and the format matches the occasion — a token rather than a present.',
      },
      {
        question: 'Is a cheap figure a bad gift?',
        answer:
          'No. Prize figures, noodle stoppers and miniatures are officially licensed products made for a lower price tier, not lesser versions of expensive figures. For Friendship Day the small format is actively right, because the point is to be thoughtful rather than substantial.',
      },
    ],
  },

  {
    slug: 'valentines-day',
    name: "Valentine's Day",
    title: "Valentine's Day Gifts for Anime Fans",
    metaDescription:
      "Valentine's Day gifts for anime fans, ₹1,000–₹8,000 — how to pick their specific favourite character rather than the series protagonist.",
    h1: "Valentine's Day Gifts for Anime Fans",
    timing: "Valentine's Day is 14 February.",
    minPrice: 1000,
    maxPrice: 8000,
    intro: [
      'The advantage you have on this occasion, and should use, is that you know what they watch. There is no guessing involved — which means the gift can be specific in a way that a gift for a colleague or a distant cousin cannot.',
      'Specificity is what makes this land. A figure of the character they have talked about, in the pose from the arc they liked, is a different gift from a figure of the series lead. It demonstrates that you were listening, which is the actual content of the present.',
      'Bounded at ₹1,000 to ₹8,000, which spans a thoughtful gift through to a genuine display centrepiece.',
    ],
    criteria: [
      'Their character, not the protagonist. If they have a favourite who is not the lead, that is the gift.',
      'Check the pose and the arc in the listing photographs. Fans are specific about which version of a character they like.',
      'Consider where it will live. If you share the space, a large statue is a joint decision rather than a surprise.',
      'Paired or two-character pieces — diorama figures and figure sets — suit the occasion without being literal about it.',
      'Above ₹5,000 you are buying a display centrepiece. Check the stated height against the shelf it is going on, because change-of-mind returns are not accepted.',
    ],
    leadTime:
      'Order by the first week of February. 14 February is a fixed date and courier volumes rise in the days before it, so the usual 4–7 business days from dispatch needs headroom.',
    faqs: [
      {
        question: "What is a good Valentine's gift for someone who loves anime?",
        answer:
          'A figure of their specific favourite character — not the series protagonist — in the pose or arc they actually talk about. This is the occasion where you know enough to be specific, and specificity is what makes the gift read as attentive rather than generic.',
      },
      {
        question: 'Should I buy a large statue as a gift?',
        answer:
          'Only if you know where it is going. Above ₹5,000 these are display centrepieces measured in tens of centimetres, and if you share the space it is more a joint decision than a surprise. Check the stated height and depth against the shelf, since change-of-mind returns are not accepted.',
      },
      {
        question: "When should I order for Valentine's Day?",
        answer:
          'By the first week of February. The date is fixed, courier volumes rise just before it, and delivery normally takes 4–7 business days from dispatch after a 24–48 hour processing window.',
      },
    ],
  },

  {
    slug: 'birthday',
    name: 'Birthday',
    title: 'Birthday Gifts for Anime Fans — Every Budget',
    metaDescription:
      'Birthday gifts for anime fans at every budget — the one occasion where the lead time makes a large statue or a preorder genuinely practical.',
    h1: 'Birthday Gifts for Anime Fans',
    timing: 'Any time of year, on a date you know in advance.',
    intro: [
      'A birthday is the one gifting occasion with no budget convention attached to it, which is why this page has no price bounds. What it has instead is a fixed date known well in advance, and that is the thing to exploit: it is the only occasion where you can comfortably order a large or made-to-order piece without the delivery being a risk.',
      'It is also the occasion where a collector is most likely to have a specific want. Asking is not spoiling the surprise — "is there a figure on your list" is a normal question and produces a far better outcome than guessing across an entire catalogue.',
      'The full range is available here, from small-format pieces through to grail statues.',
    ],
    criteria: [
      'Ask if there is something on their list. Collectors usually have one, and hitting it beats surprising them.',
      'Use the lead time. This is the occasion where a large statue or a preorder is genuinely practical.',
      'For a milestone, one substantial piece beats several small ones — a centrepiece is remembered, three keychains are not.',
      'Check what they already own. Duplicates are the most common failure mode when buying for a collector.',
      'If they are new to the hobby, ₹1,000–₹2,500 and a high-recognition character is the reliable range.',
    ],
    leadTime:
      'You know the date in advance, so order two weeks out. That covers the 24–48 hour processing window, 4–7 business days of transit, and leaves room to resolve a damaged delivery within the 3-day reporting window before the birthday itself.',
    faqs: [
      {
        question: 'How much should I spend on an anime figure as a birthday gift?',
        answer:
          'There is no convention, which is why this page has no price limit. ₹1,000–₹2,500 buys a well-made licensed figure of almost any popular character and is the reliable range for someone new to the hobby. For a milestone, one substantial piece above ₹5,000 is remembered in a way that several small ones are not.',
      },
      {
        question: 'Should I ask what they want or surprise them?',
        answer:
          'Ask, if they collect. Collectors keep a list, duplicates are the most common way a figure gift goes wrong, and "is there a figure on your list" does not spoil anything. Surprise works better for someone who likes the anime but does not collect.',
      },
      {
        question: 'How far ahead should I order a birthday gift?',
        answer:
          'Two weeks. That covers processing and transit with room to spare, and leaves time to report a damaged delivery within the 3-day window and get it resolved before the date — which is the actual reason to order early rather than the transit time itself.',
      },
    ],
  },

  {
    slug: 'anniversary',
    name: 'Anniversary',
    title: 'Anniversary Gifts for Collectors — Premium Figures & Statues',
    metaDescription:
      'Anniversary gifts for figure collectors from ₹2,500 — display centrepieces, large-scale statues and dioramas, with the measurements to check first.',
    h1: 'Anniversary Gifts for Collectors',
    timing: 'Any time of year, on a date known well in advance.',
    minPrice: 2500,
    intro: [
      'An anniversary gift is expected to be substantial, and in this category substantial means a display centrepiece rather than a shelf addition. That is the reasoning behind the ₹2,500 floor on this page: below it you are buying a good figure, and above it you are buying a piece that anchors a room.',
      'At this tier the decision shifts from "which character" to "where does it go". Large-scale statues on effect bases are the deepest objects in the category and they need planning rather than enthusiasm — which is fine, because an anniversary is a date you knew about a year ago.',
      'No upper bound. The grail tier belongs on this page.',
    ],
    criteria: [
      'Measure the space first. Effect bases add roughly 15–20 per cent over the stated dimensions, and depth runs out before height does.',
      'Check the stated height against the shelf. Change-of-mind returns are not accepted, which matters most at this price.',
      'Diorama and two-character pieces suit the occasion and read as deliberate rather than literal.',
      'Study the listing photographs rather than the manufacturer’s renders. At this size, paint transitions and seam lines are visible from across a room.',
      'Order with enough margin to resolve transit damage before the date — large resin pieces are the ones that arrive with a snapped extremity.',
    ],
    leadTime:
      'Three weeks. Large pieces are the most likely to need a damage claim, the reporting window is 3 days from delivery, and a replacement needs its own transit time — so the margin matters more here than on any other occasion.',
    faqs: [
      {
        question: 'What is a good anniversary gift for a figure collector?',
        answer:
          'A display centrepiece rather than another shelf piece — a large-scale statue, a multi-part diorama or a prop replica, which is why this page starts at ₹2,500. Measure the intended space first: effect bases add 15–20 per cent over the stated dimensions and depth is the constraint.',
      },
      {
        question: 'How far ahead should I order a large statue?',
        answer:
          'Three weeks. Large resin pieces are the most likely to arrive with a damaged thin part, damage must be reported within 3 days of delivery, and a replacement needs its own transit time. That margin is the reason to order early, not the transit itself.',
      },
      {
        question: 'Can I return a large statue if it does not fit the space?',
        answer:
          'No. Change-of-mind returns are not accepted at any price, so the stated dimensions need checking before ordering. Returns cover damaged or incorrect deliveries reported within 3 days with photographs.',
      },
    ],
  },

  {
    slug: 'christmas',
    name: 'Christmas',
    title: 'Christmas Gifts for Anime Fans in India',
    metaDescription:
      'Christmas gifts for anime fans in India, ₹1,000–₹4,000 — boxed mid-size figures, and why the first week of December is the real deadline.',
    h1: 'Christmas Gifts for Anime Fans',
    timing: 'Christmas is 25 December.',
    minPrice: 1000,
    maxPrice: 4000,
    intro: [
      'Christmas gifting in India happens against the busiest shipping fortnight of the year, and that is the constraint that actually shapes the decision. Everything else — budget, format, character — is secondary to ordering early enough.',
      'The format that suits the occasion is boxed and mid-size. Gifts are handed over or placed under a tree, often several at once, and a boxed figure presents itself without wrapping while surviving being moved around.',
      'Bounded at ₹1,000 to ₹4,000, which is where Christmas gifting in this category sits comfortably.',
    ],
    criteria: [
      'Order in the first week of December. This is the binding constraint, not the budget.',
      'Boxed rather than loose — the packaging does the presentation and needs no wrapping.',
      'Mid-size travels and presents better than large. Save the centrepiece for a birthday you can plan around.',
      'LED and light-up figures suit the season and double as a display piece afterwards.',
      'For a gift exchange with a cap, the ₹1,000–₹2,500 band covers most Funko Pops and standard action figures.',
    ],
    leadTime:
      'Order in the first week of December. The second half of December is the heaviest courier period of the year in India and transit times stretch well beyond the usual 4–7 business days from dispatch.',
    faqs: [
      {
        question: 'When is the last date to order a Christmas gift in India?',
        answer:
          'Aim for the first week of December rather than a last date. The second half of December is the heaviest courier fortnight of the year and transit times stretch beyond the usual 4–7 business days from dispatch, so a mid-December order is a gamble rather than a plan.',
      },
      {
        question: 'What is a good Christmas gift for an anime fan under ₹2,500?',
        answer:
          'A boxed Funko Pop or a standard action figure of a character from a series they watch. Both present well without wrapping, survive being moved around, and sit at the price point most gift exchanges cap at.',
      },
    ],
  },
];

export function giftOccasionBySlug(slug: string): GiftOccasionDef | undefined {
  return GIFT_OCCASIONS.find((o) => o.slug === slug);
}

/** Human description of the band, for the spec table and the copy. */
export function giftBudgetText(def: GiftOccasionDef): string {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  if (def.minPrice != null && def.maxPrice != null) {
    return `${fmt(def.minPrice)} to under ${fmt(def.maxPrice)}`;
  }
  if (def.maxPrice != null) return `Under ${fmt(def.maxPrice)}`;
  if (def.minPrice != null) return `${fmt(def.minPrice)} and above`;
  return 'Every budget';
}
