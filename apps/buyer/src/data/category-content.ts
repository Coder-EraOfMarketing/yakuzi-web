/**
 * Curated SEO content for the /category/[slug] pages — titles, intro copy,
 * FAQs and related-collection chips, keyed by category slug.
 *
 * Precedence on the page (highest wins):
 *   1. Admin SEO panel override (SeoMeta CATEGORY) — applySeoOverride, always
 *   2. This file
 *   3. The category's DB `description` (Collections modal)
 *   4. Generic template
 * So an admin can still override everything per category from the SEO
 * dashboard without touching code; this file just replaces the generic
 * fallbacks with real copy. Written by hand per category — intros must not
 * share sentence structure (templated siblings read as doorway pages).
 */

export interface CategoryContent {
  slug: string;
  /** SERP title without the site suffix (~≤60 chars incl. " | Yukizi"). */
  title: string;
  metaDescription: string;
  intro: string[];
  faqs: Array<{ question: string; answer: string }>;
  /** Slugs of related /collections hubs, rendered as chips. */
  collections: string[];
}

export const CATEGORY_CONTENT: CategoryContent[] = [
  {
    slug: 'figurines',
    title: 'Buy Anime Figures & Statues Online in India',
    metaDescription:
      'Anime figures and collectible statues in India — Naruto, Demon Slayer, One Piece and Dragon Ball sculpts from verified sellers, with free shipping on eligible orders.',
    intro: [
      'Figurines are the heart of the Yukizi catalogue: sculpted, fixed-pose statues that freeze one moment of a story — Nezuko mid-lunge on ribbons of demon-art flame, Gaara behind his sand, a golden Super Saiyan mid-charge. Most pieces here come with themed bases and translucent effect parts, built to hold a shelf rather than to be posed.',
      'Every listing shows the exact sculpt in photos, the seller, price with taxes, and a delivery estimate before checkout. If you collect by series rather than browsing everything, the collection pages below cut straight to your show.',
    ],
    faqs: [
      {
        question: 'Are these anime figures poseable or fixed statues?',
        answer:
          'Most figurines on Yukizi are fixed-pose collectible statues — one sculpted moment with a themed base — rather than articulated action figures. Each listing’s photos show exactly what ships, so check the gallery before ordering.',
      },
      {
        question: 'How should I display and care for a collectible figure?',
        answer:
          'Keep figures out of direct sunlight (UV dulls paint and translucent effect parts), dust with a soft dry brush, and handle pieces by the base rather than thin sculpted details like flames or hair.',
      },
    ],
    collections: ['naruto', 'demon-slayer', 'one-piece', 'dragon-ball'],
  },
  {
    slug: 'funko-pop',
    title: 'Buy Funko Pop Figures Online in India',
    metaDescription:
      'Funko Pop vinyl figures in India — anime, superheroes, gaming and pop culture Pops in original boxes from verified sellers on Yukizi.',
    intro: [
      'The Funko Pop shelf covers the whole pop-culture spectrum in one small vinyl format: Dragon Ball and Death Note for anime fans, Loki and Batman on the comics side, Kratos and Ghost of Yōtei for gamers, plus wildcards like a monochrome 1954 Godzilla. Pops ship boxed as pictured — and where a box carries a limited-edition or convention sticker, the listing photos show it, because with Pops the sticker is half the value.',
    ],
    faqs: [
      {
        question: 'Do the Funko Pops come in their original packaging?',
        answer:
          'Yes — every Pop ships boxed as shown in its listing photos. Check the gallery for edition stickers (limited, convention or exclusive runs) before ordering; the sticker shown is the sticker you get.',
      },
    ],
    collections: ['funko-pop'],
  },
  {
    slug: 'collectables',
    title: 'Buy Collectibles & Merchandise Online in India',
    metaDescription:
      'Pop-culture collectibles in India — superhero statues, replica props, desk pieces and display collectibles from verified sellers on Yukizi.',
    intro: [
      'Collectables is the catch-all cabinet: superhero statues, replica props like a voice-activated Iron Man helmet, desk-scale display pieces and the odd item that fits no tidy label. What unifies them is that each one is bought to be displayed — and each listing shows the seller, real photos and a delivery estimate up front so you know exactly what reaches your shelf.',
    ],
    faqs: [
      {
        question: 'What counts as a collectable on Yukizi?',
        answer:
          'Anything display-first that is not a standard figure line: statues, replica props, helmets, dioramas and desk pieces. If it exists to sit on a shelf and start conversations, it lives here.',
      },
    ],
    collections: ['marvel-superheroes', 'gaming'],
  },
  {
    slug: 'books',
    title: 'Buy Comics & Graphic Novels Online in India',
    metaDescription:
      'Comics and illustrated books in India — collectible issues from independent publishers, shipped across India by verified sellers on Yukizi.',
    intro: [
      'The Books shelf carries printed stories — currently led by the Maayan comic series from Maayan Publications, issue by issue. Comics ship flat and protected, and each listing states the issue number and language so you can complete a run without guesswork.',
    ],
    faqs: [
      {
        question: 'How are comics packed for shipping?',
        answer:
          'Sellers pack printed issues flat and protected for courier transit. If an issue arrives damaged, report it within 3 days of delivery with photos of the item and packaging for a replacement or refund.',
      },
    ],
    collections: [],
  },
  {
    slug: 'cosplay-props',
    title: 'Buy Cosplay Props & Replicas Online in India',
    metaDescription:
      'Cosplay props and wearable replicas in India — con-ready pieces from verified sellers on Yukizi. New drops added as sellers list them.',
    intro: [
      'Cosplay & Props is where wearable fandom lives — replica weapons, helmets and costume pieces built for conventions and photo shoots. Sellers are onboarding stock now; new listings appear here the moment they go live.',
    ],
    faqs: [],
    collections: ['marvel-superheroes'],
  },
  {
    slug: 'diy-kits-hobby-kits',
    title: 'Buy DIY & Hobby Kits Online in India',
    metaDescription:
      'Model kits and DIY hobby builds in India — buildable kits from verified sellers on Yukizi. New kits added as sellers list them.',
    intro: [
      'DIY & Hobby Kits covers the build-it-yourself side of collecting — model kits and craft builds where the assembly is half the fun. Sellers are onboarding stock now; check back or browse the full catalogue meanwhile.',
    ],
    faqs: [],
    collections: [],
  },
  {
    slug: 'gaming',
    title: 'Buy Gaming Collectibles Online in India',
    metaDescription:
      'Video game figures and gaming collectibles in India — Valorant, Elden Ring, Hollow Knight and more from verified sellers on Yukizi.',
    intro: [
      'Gaming pulls together collectibles born in game engines — from Valorant agents to Elden Ring and Hollow Knight statues. Much of the current stock lives in the Figurines category too; the gaming collection below gathers every game piece on the marketplace in one place.',
    ],
    faqs: [],
    collections: ['gaming'],
  },
  {
    slug: 'merch',
    title: 'Buy Anime Merchandise Online in India',
    metaDescription:
      'Anime and pop-culture merchandise in India — apparel and everyday fandom gear from verified sellers on Yukizi. New drops added as sellers list them.',
    intro: [
      'Merch is fandom you can use — apparel and everyday items carrying the series you love. Sellers are onboarding stock in this category now; new drops appear here automatically the moment they list.',
    ],
    faqs: [],
    collections: [],
  },
];

export function categoryContentBySlug(slug: string): CategoryContent | undefined {
  return CATEGORY_CONTENT.find((c) => c.slug === slug);
}
