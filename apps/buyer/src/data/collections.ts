/**
 * Curated collection hubs — the landing pages for the searches buyers
 * actually type ("buy naruto figures india", "funko pop india", "demon
 * slayer figures online").
 *
 * Why a data file and not a DB feature: the catalogue is small enough that
 * membership is decided by matching product name/slug/description against a
 * hand-tuned per-hub pattern, so new products join their hubs automatically
 * on the next revalidation with zero admin work. Every field here is
 * hand-written per hub — intros and FAQs must NOT share sentence structure
 * across hubs, or the pages read as templated doorways (Google demotes
 * near-duplicate sibling pages; keep pairwise similarity low).
 *
 * Matching rules:
 * - `match` is a case-insensitive, word-boundary regex source. Substring
 *   matching is banned — "eren" inside "Frieren" and "gon" inside "dragon"
 *   are real bugs this file replaces.
 * - `exclude` lists product slugs that the pattern catches wrongly (phrase
 *   collisions like a Batman Funko whose description contains "one piece").
 * - A hub with fewer than MIN_PRODUCTS live matches renders noindex so a
 *   thinning catalogue can never leave an indexed empty page behind.
 */

export const MIN_PRODUCTS = 3;

export interface CollectionDef {
  slug: string;
  kind: 'brand' | 'series' | 'theme';
  /** Short display name — chips, footer, breadcrumbs. */
  name: string;
  /** SERP title (without the site suffix). */
  title: string;
  metaDescription: string;
  h1: string;
  /** 2–3 paragraphs, plain text. Unique voice per hub. */
  intro: string[];
  faqs: Array<{ question: string; answer: string }>;
  /** Case-insensitive regex SOURCE with word boundaries. */
  match: string;
  exclude?: string[];
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'funko-pop',
    kind: 'brand',
    name: 'Funko Pop',
    title: 'Buy Funko Pop Figures Online in India',
    metaDescription:
      'Shop Funko Pop vinyl figures in India — anime, superheroes, gaming and pop culture Pops from verified sellers, with free shipping on eligible orders.',
    h1: 'Funko Pop Figures in India',
    intro: [
      'Funko Pops are the entry drug of collecting: small vinyl figures with the signature square head and black eyes, boxed in window packaging that most collectors never open. Yukizi’s Funko shelf runs the whole pop-culture spectrum — Dragon Ball and Death Note on the anime side, Loki and Batman for comic fans, Kratos and Ghost of Yotei for gamers, and wildcards like a monochrome 1954 Godzilla or a Johnny Bravo throwback.',
      'A few listings on this page carry limited-edition or convention stickers on the box art shown in the photos — always check the product images for the exact sticker before ordering, because with Pops the sticker is half the value. Boxes ship as pictured, and every order is trackable from your account.',
      'Prices update live from sellers on the marketplace, and new Pops join this page automatically as they are listed — bookmark it if you hunt drops.',
    ],
    faqs: [
      {
        question: 'Do Funko Pops on Yukizi come in their original boxes?',
        answer:
          'Yes — Pops ship boxed as shown in each listing’s photos. If a box carries a limited-edition or convention sticker, it is visible in the product images, so check those before ordering.',
      },
      {
        question: 'Should I keep a Funko Pop in the box or display it loose?',
        answer:
          'Collectors are split. Boxed Pops hold resale value better, especially stickered editions; loose Pops display better on a desk. If you keep the box, store it away from direct sunlight — the window yellows over time.',
      },
      {
        question: 'How fast do Funko orders ship across India?',
        answer:
          'Orders are processed within 24–48 hours of payment, and delivery typically takes 4–7 business days from dispatch anywhere in India. Tracking details arrive by email or phone once shipped.',
      },
    ],
    match: '\\bfunko\\b',
  },
  {
    slug: 'naruto',
    kind: 'series',
    name: 'Naruto',
    title: 'Buy Naruto Figures Online in India',
    metaDescription:
      'Naruto and Naruto Shippuden figures in India — Kakashi, Itachi, Gaara, the Akatsuki and more collectible statues from verified sellers on Yukizi.',
    h1: 'Naruto Figures & Collectible Statues',
    intro: [
      'From a kid on a swing in Konoha to the Six Paths Sage — this page collects every Naruto figure listed on Yukizi. The roster leans into the series’ best rivalries and tragedies: Itachi, Zabuza mid-mist, Gaara with his sand, Hashirama in his wood-style stance, Pain with the Rinnegan, and Naruto and Sasuke side by side the way the story always meant them to be.',
      'These are display statues — sculpted single poses with effect pieces and themed bases, built to hold a shelf, not to be posed. If you are starting a Naruto shelf, the classic build is a three-piece arc: one Leaf shinobi, one rogue, one Akatsuki — the miniature Akatsuki set of six on this page shortcuts the third slot in one order.',
      'Buy Naruto figures online in India below — free shipping applies on eligible orders, and each product page lists the seller and delivery estimate up front.',
    ],
    faqs: [
      {
        question: 'Which Naruto characters are available as figures on Yukizi?',
        answer:
          'The lineup changes with seller stock, but regularly includes Naruto (kid and Six Paths versions), Sasuke, Kakashi, Itachi, Gaara, Zabuza, Hashirama, Pain, and an Akatsuki miniature set. Each listing’s photos show the exact sculpt.',
      },
      {
        question: 'Are these Naruto statues poseable action figures?',
        answer:
          'Most are fixed-pose collectible statues — a single sculpted moment with a themed base — rather than articulated action figures. The product photos make it clear what each piece is; what you see pictured is what ships.',
      },
      {
        question: 'What if my Naruto figure arrives damaged?',
        answer:
          'Report it within 3 days of delivery with clear photos of the figure and packaging, and the order is replaced or refunded to your original payment method after review. Change-of-mind returns are not accepted.',
      },
    ],
    match:
      '\\b(naruto|sasuke|kakashi|itachi|gaara|zabuza|hashirama|madara|jiraiya|obito|konoha|akatsuki|rinnegan)\\b',
  },
  {
    slug: 'dragon-ball',
    kind: 'series',
    name: 'Dragon Ball',
    title: 'Buy Dragon Ball Z Figures Online in India',
    metaDescription:
      'Dragon Ball and DBZ figures in India — Goku, Vegeta, Broly, Shenron and Super Saiyan statues with aura effects, from verified sellers on Yukizi.',
    h1: 'Dragon Ball & DBZ Figures',
    intro: [
      'No series sells energy like Dragon Ball, and the figures on this page are chosen for exactly that: golden Super Saiyan hair, ultra-instinct auras, a Kamehameha mid-charge, Shenron coiling out of the summon. Goku appears in most of his eras — kid Goku with the Power Pole, Super Saiyan, Ultra Instinct — alongside Vegeta, Broly, and a Goku-versus-Vegeta clash piece with a glowing energy sphere.',
      'DBZ statues are the loudest thing on any shelf, so give them room: effect pieces in translucent orange and gold read best against a plain wall or inside a lit cabinet, away from direct sun that dulls translucent parts. The Funko takes on Super Saiyan God Goku and Broly on this page suit collectors who want the characters in a smaller footprint.',
      'Every listing shows price, taxes and a delivery estimate before checkout, and delivery runs 4–7 business days from dispatch across India.',
    ],
    faqs: [
      {
        question: 'Which Goku versions can I buy as figures in India?',
        answer:
          'On Yukizi the range typically spans kid Goku with the Power Pole, classic Super Saiyan, Ultra Instinct with aura effects, and Funko Pop renditions like Super Saiyan God. Check each listing’s gallery for the exact form and pose.',
      },
      {
        question: 'Do the aura and energy effects light up?',
        answer:
          'Only where a listing explicitly says so — some pieces, like the Goku vs Vegeta clash with its energy sphere and certain lamp-style figures, feature lighting, while most auras are translucent sculpted parts that catch ambient light. The product page states any light-up function.',
      },
      {
        question: 'Is cash on delivery or tracking available for Dragon Ball figure orders?',
        answer:
          'Every order gets shipment tracking sent to your registered email or phone at dispatch. Available payment options are shown at checkout, and orders are processed within 24–48 hours of confirmation.',
      },
    ],
    match: '\\b(dragon ball|goku|vegeta|broly|shenron|frieza|saiyan|dbz|kamehameha)\\b',
  },
  {
    slug: 'demon-slayer',
    kind: 'series',
    name: 'Demon Slayer',
    title: 'Buy Demon Slayer Figures Online in India',
    metaDescription:
      'Demon Slayer (Kimetsu no Yaiba) figures in India — Nezuko, Rengoku, Akaza, Zenitsu and Hashira statues from verified sellers on Yukizi.',
    h1: 'Demon Slayer: Kimetsu no Yaiba Figures',
    intro: [
      'Demon Slayer’s fights are drawn like paintings, and its figures inherit that: Nezuko carried mid-lunge on ribbons of pink Blood Demon Art, Rengoku wrapped in flame breathing, Zenitsu on a lightning-effect base, and Akaza’s haunting half-demon, half-human farewell sculpt from the Infinity Castle arc. The Akaza-and-Koyuki end-scene set on this page is the quiet counterpart to all that fire — a piece for people who collect moments, not battles.',
      'Effect-heavy statues like these reward a little curation: face the flame and lightning bases toward the room’s light source, dust with a soft brush, and keep translucent parts out of direct sunlight. Cuter entries — Mitsuri with her parasol, Tengen’s noodle-stopper with a bunny plush — mix well between the big dioramas.',
      'All Demon Slayer listings below come from sellers onboarded on the Yukizi marketplace, with free shipping across India on eligible orders.',
    ],
    faqs: [
      {
        question: 'Which Demon Slayer characters are available as figures?',
        answer:
          'The page regularly carries Nezuko, Rengoku, Akaza, Zenitsu, Kokushibo, Mitsuri and Tengen Uzui, spanning dramatic battle dioramas to small desk-friendly pieces. Stock rotates with sellers, so check the live grid below.',
      },
      {
        question: 'What is a noodle-stopper figure?',
        answer:
          'A small seated figure originally designed to perch on the rim of an instant-noodle cup and hold the lid down while it steeps — now a popular compact display format. The Tengen Uzui listing on this page is that style.',
      },
      {
        question: 'How do I keep translucent effect parts from fading?',
        answer:
          'Keep the figure out of direct sunlight — UV dulls translucent pinks and oranges over time — and dust with a soft dry brush rather than a cloth, which can snag on thin sculpted ribbons and flames.',
      },
    ],
    match:
      '\\b(demon slayer|kimetsu|nezuko|akaza|rengoku|zenitsu|kokushibo|kokoshibo|tanjiro|tengen|uzui|mitsuri|hashira)\\b',
  },
  {
    slug: 'one-piece',
    kind: 'series',
    name: 'One Piece',
    title: 'Buy One Piece Figures Online in India',
    metaDescription:
      'One Piece figures in India — Luffy, Zoro, Sanji, Ace and Shanks collectible statues from verified sellers on Yukizi, with free shipping on eligible orders.',
    h1: 'One Piece Figures & Statues',
    intro: [
      'Twenty-five years of sailing and One Piece still produces the most emotional figures in anime. Yukizi’s crew currently musters Luffy, Zoro, Sanji with his Diable Jambe flames, Ace, and a throne-seated Shanks — the Straw Hats’ captain, first mate and cook plus the two men who shaped Luffy’s journey.',
      'One Piece statues tend to be storytelling pieces: a pose, an effect, a base that quotes a specific scene. That makes them strong single-character buys — you don’t need the whole crew for the shelf to work, though a Luffy-Zoro-Sanji trio is the classic monster-trio arrangement if you want to build one order at a time.',
      'Each listing below shows the seller, the exact sculpt in photos, and a delivery estimate before you commit — typically 4–7 business days from dispatch anywhere in India.',
    ],
    faqs: [
      {
        question: 'Which One Piece characters are in stock as figures?',
        answer:
          'The lineup currently features Luffy, Roronoa Zoro, Sanji, Portgas D. Ace and Shanks, with new listings joining this page automatically as sellers add them. Each product’s gallery shows the exact pose and base.',
      },
      {
        question: 'Are these One Piece figures good gifts for fans?',
        answer:
          'Very — One Piece statues capture specific scenes fans recognise instantly, which lands better than generic merchandise. Pick the recipient’s favourite character, and check the product photos so the pose matches the era they love.',
      },
      {
        question: 'What happens if the wrong figure is delivered?',
        answer:
          'Wrong-item deliveries qualify for return: report within 3 days of receiving the order with photos of the product and package, and after verification you get the correct item or a refund to your original payment method.',
      },
    ],
    match: '\\b(one piece|luffy|zoro|roronoa|sanji|shanks|straw hat|portgas|wano)\\b',
    exclude: ['funko-comic-covers-batman-unknown'],
  },
  {
    slug: 'marvel-superheroes',
    kind: 'theme',
    name: 'Marvel & Superheroes',
    title: 'Buy Marvel & Superhero Figures Online in India',
    metaDescription:
      'Marvel and superhero collectibles in India — Iron Man, Black Panther, Venom, Captain America statues and a voice-activated Iron Man helmet on Yukizi.',
    h1: 'Marvel & Superhero Collectibles',
    intro: [
      'The superhero shelf at Yukizi runs from display statues to wearable tech: Iron Man and Black Panther in classic hero stances, Venom mid-snarl, Captain America with the shield — and the outlier, a voice-activated Iron Man helmet whose faceplate responds to commands, which is less a figure than a prop you own.',
      'Statue collectors and prop collectors shop differently. Statues want cabinet space and consistent scale next to their neighbours; the helmet wants a stand at eye level and becomes the anchor of the room. Loki fans get two Funko options on this page — Mobius from season 2 and the Infinity Saga version — for a smaller-format entry point.',
      'Every listing is from a seller onboarded on the marketplace, with price, taxes and delivery estimate shown before checkout and tracking on every order.',
    ],
    faqs: [
      {
        question: 'Does the Iron Man helmet actually open with voice commands?',
        answer:
          'The helmet is voice-activated as named — the listing photos and description on its product page detail the interaction. It is a collector’s display prop; check the product page for exactly what the feature covers before ordering.',
      },
      {
        question: 'Are these Marvel statues to a consistent scale?',
        answer:
          'Listings come from different sellers and lines, so scale varies piece to piece. Compare the dimensions and photos on each product page if you plan to display several side by side.',
      },
      {
        question: 'How long does delivery take within India?',
        answer:
          'Orders are processed within 24–48 hours of payment and typically arrive 4–7 business days after dispatch, with tracking sent to your email or phone. Shipping is free on eligible orders across India.',
      },
    ],
    match:
      '\\b(marvel|iron man|ironman|black panther|venom|spider man|spiderman|avengers|loki|thor|hulk|captain america|deadpool|wolverine)\\b',
    exclude: ['testing-iron-man-testing'],
  },
  {
    slug: 'gaming',
    kind: 'theme',
    name: 'Gaming',
    title: 'Buy Video Game Figures Online in India',
    metaDescription:
      'Video game figures in India — Valorant Jett, Hollow Knight, Elden Ring and Assassin’s Creed collectible statues from verified sellers on Yukizi.',
    h1: 'Video Game Figures & Statues',
    intro: [
      'Game figures are still the rarest shelf in Indian collecting, and this page gathers Yukizi’s: Jett from Valorant in a dual-pose presentation, the Pure Vessel and the Knight from Hollow Knight in a single diorama, Ranni the Witch from Elden Ring in noodle-stopper form, and Altair of Assassin’s Creed on a bell-tower base.',
      'What makes game statues distinct is silhouette — these characters were designed to read instantly at a distance in-engine, and the same holds on a shelf. The Hollow Knight diorama in particular rewards close viewing: two characters, one base, and a glow detail in the rim that photographs beautifully.',
      'If your game is not here yet, it likely will be — new listings join this page automatically as sellers add them. Free shipping applies on eligible orders across India.',
    ],
    faqs: [
      {
        question: 'Do you have figures from games other than these?',
        answer:
          'This page updates automatically as sellers list new game figures, so the roster grows with the marketplace. Currently it spans Valorant, Hollow Knight, Elden Ring and Assassin’s Creed, plus Funko takes on God of War and Ghost of Yotei — check back for new arrivals.',
      },
      {
        question: 'Is the Valorant Jett figure articulated?',
        answer:
          'Jett is a dual-pose display figure — the listing’s photos show both presentations. Like most pieces on this page it is a sculpted display piece rather than an action figure; the product gallery shows exactly what ships.',
      },
      {
        question: 'How are fragile diorama figures packed for shipping?',
        answer:
          'Sellers pack for courier transit across India, and any damage in transit is covered: report it within 3 days of delivery with photos of the figure and packaging for a replacement or refund after review.',
      },
    ],
    match:
      '\\b(valorant|jett|hollow knight|assassin|assasins|altair|elden ring|ranni|witcher|kratos|god of war|ghost of yotei)\\b',
  },
  {
    slug: 'death-note',
    kind: 'series',
    name: 'Death Note',
    title: 'Buy Death Note Figures Online in India',
    metaDescription:
      'Death Note figures in India — Light Yagami and L collectibles from verified sellers on Yukizi. The classic psychological thriller, on your shelf.',
    h1: 'Death Note Figures & Collectibles',
    intro: [
      'Death Note built its legend on two chairs and two minds, and its figures keep that minimalism: Light Yagami rendered as a statue with a golden scythe-effect flourish, and both leads in Funko form — L crouched on his armchair exactly the way he sits in the series, mug in hand, and Light with the notebook that started it all.',
      'This is the collection for people whose shelves lean noir — no energy blasts, no battle bases, just character. The L Funko in particular is one of those rare Pops that communicates an entire personality in one pose, and it pairs naturally with Light for a protagonist-antagonist bookend arrangement.',
      'All three listings show seller, price and delivery estimate up front; orders ship with tracking and arrive within 4–7 business days of dispatch across India.',
    ],
    faqs: [
      {
        question: 'What Death Note figures does Yukizi carry?',
        answer:
          'Currently a Light Yagami collectible statue plus Funko Pop versions of both Light and L — L in his signature crouch on the armchair. New Death Note listings join this page automatically when sellers add them.',
      },
      {
        question: 'Is Death Note merchandise suitable as a gift?',
        answer:
          'For fans of psychological thrillers, absolutely — Death Note is one of the most-watched anime ever and its leads are instantly recognisable. The L-on-armchair Funko is the safest pick if you are unsure which character the recipient prefers.',
      },
    ],
    match: '\\b(death note|light yagami|yagami|ryuk|shinigami)\\b',
  },
];

/** Text a product is matched against: name + slug words + description. */
export function productMatchText(p: {
  name?: string;
  slug?: string;
  description?: string | null;
}): string {
  return [p.name ?? '', (p.slug ?? '').replace(/-/g, ' '), p.description ?? '']
    .join(' | ')
    .toLowerCase();
}

export function collectionBySlug(slug: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function matchProducts<T extends { name?: string; slug?: string; description?: string | null }>(
  def: CollectionDef,
  products: T[],
): T[] {
  const rx = new RegExp(def.match, 'i');
  const excluded = new Set(def.exclude ?? []);
  return products.filter((p) => !excluded.has(p.slug ?? '') && rx.test(productMatchText(p)));
}

/** Hubs a single product belongs to — used for the PDP's collection chips. */
export function collectionsForProduct(p: {
  name?: string;
  slug?: string;
  description?: string | null;
}): CollectionDef[] {
  const text = productMatchText(p);
  return COLLECTIONS.filter((def) => {
    if ((def.exclude ?? []).includes(p.slug ?? '')) return false;
    return new RegExp(def.match, 'i').test(text);
  });
}
