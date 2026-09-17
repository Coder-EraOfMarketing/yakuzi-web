import type { GuideDef } from './types';

/**
 * Format and terminology guides.
 *
 * These do double duty. They answer real queries ("what is a nendoroid",
 * "1/7 vs 1/8 scale"), and they are the editorial layer that links into the
 * `/figures/[format]` hubs from relevant prose rather than from a footer.
 *
 * Heights below are stated as ranges and tied to a reference character
 * height, because scale is a RATIO: a 1/7 figure of a child character is
 * genuinely much shorter than a 1/7 figure of an adult one, and quoting a
 * single centimetre figure per scale would be wrong for half the catalogue.
 */
export const FORMAT_GUIDES: GuideDef[] = [
  {
    slug: 'anime-figure-scales-explained',
    category: 'formats',
    title: 'Anime Figure Scales Explained: 1/4, 1/6, 1/7, 1/8 and 1/12',
    h1: 'Anime Figure Scales Explained',
    metaDescription:
      'What 1/7 and 1/8 scale actually mean, the height each works out to, why two figures at the same scale differ in size, and why prize figures state no scale at all.',
    updated: '2026-09-17',
    answer:
      'A figure’s scale is the ratio between the figure and the character’s canonical height, so 1/8 scale means one-eighth as tall as the character is said to be in the source work. For a typical adult character of around 170–175 cm that puts 1/8 at roughly 21–22 cm and 1/7 at roughly 24–25 cm — which is why two figures marked at the same scale can still differ in height if the characters do.',
    sections: [
      {
        heading: 'Scale is a ratio, not a size',
        paras: [
          'This is the point that causes most of the confusion. Scale does not specify a height; it specifies a division. A 1/7 figure of a 190 cm character is noticeably larger than a 1/7 figure of a 150 cm one, and both are correctly labelled.',
          'It also means the displayed height on a listing is the number you should actually plan your shelf around. Scale tells you roughly what tier of figure you are buying; the stated centimetre height tells you whether it fits.',
        ],
      },
      {
        heading: 'Approximate heights for a 170–175 cm adult character',
        table: {
          caption:
            'Indicative only — the height depends on the character’s canonical height and on pose.',
          head: ['Scale', 'Approximate height'],
          rows: [
            { label: '1/1', value: 'Life size. Effectively only prop replicas — helmets, weapons, masks.' },
            { label: '1/4', value: 'Around 42–45 cm. Large display centrepieces, usually resin.' },
            { label: '1/6', value: 'Around 28–30 cm. The standard for licensed film collectibles.' },
            { label: '1/7', value: 'Around 24–25 cm. The most common retail scale-figure size.' },
            { label: '1/8', value: 'Around 21–22 cm. The other common retail scale, slightly cheaper than 1/7.' },
            { label: '1/10', value: 'Around 17 cm.' },
            { label: '1/12', value: 'Around 14 cm. The common articulated action-figure scale.' },
          ],
        },
      },
      {
        heading: 'Dynamic poses break the arithmetic',
        paras: [
          'A figure mid-leap, crouching or seated is shorter than the scale suggests, and a figure on a tall effect base is taller. Manufacturers state the height as displayed, including the base, which is the honest measurement but does mean the height and the scale will not reconcile by simple division.',
          'Effect bases also add depth, which is the dimension people forget. Allow roughly 15–20 per cent over the stated dimensions when planning a cabinet shelf — depth runs out before height does.',
        ],
      },
      {
        heading: 'Why prize figures have no scale',
        paras: [
          'Prize figures from Banpresto, Sega, Taito and FuRyu are not produced to a stated scale. They are made to a size and a price point suited to Japanese arcade crane-game distribution, typically somewhere between 10 and 20 cm, and the box simply gives a height.',
          'That is not a mark against them — it is a different product category. If you want figures that stand consistently beside each other on a shelf, buy within one scale from retail manufacturers. If you want the character at a good price, the absence of a stated scale is irrelevant.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What does 1/7 scale mean on an anime figure?',
        answer:
          'That the figure is one-seventh of the character’s canonical height. For a typical adult character around 170–175 cm that works out to roughly 24–25 cm. Because it is a ratio, a 1/7 figure of a taller character will be taller.',
      },
      {
        question: 'Which is bigger, 1/7 or 1/8 scale?',
        answer:
          '1/7. Dividing by a smaller number leaves a larger figure, so 1/7 is about 24–25 cm for a typical adult character against about 21–22 cm at 1/8. 1/7 is usually slightly more expensive for the same character and manufacturer.',
      },
      {
        question: 'Why do two figures at the same scale have different heights?',
        answer:
          'Because the characters are different heights. Scale divides the character’s canonical height, so the same ratio produces different figures. Pose matters too — a crouching or seated figure is shorter than the scale implies, and an effect base makes it taller.',
      },
      {
        question: 'Why do prize figures not state a scale?',
        answer:
          'They are built to a size and price suited to Japanese arcade crane-game distribution rather than to a scale specification, usually 10–20 cm. The box gives a height instead. It is a different product category, not a lower-quality version of a scale figure.',
      },
    ],
    relatedTypes: ['collectible-statues', 'action-figures', 'miniature-figures', 'prop-replicas'],
    relatedGuides: [
      'prize-figure-vs-scale-figure',
      'action-figure-vs-statue',
      'how-to-display-anime-figures',
    ],
  },

  {
    slug: 'what-is-a-nendoroid',
    category: 'formats',
    title: 'What Is a Nendoroid?',
    h1: 'What Is a Nendoroid?',
    metaDescription:
      'Nendoroids explained: Good Smile Company’s 10 cm chibi line with interchangeable faces and parts, how they differ from figma and Nendoroid Doll, and what they cost.',
    updated: '2026-09-17',
    answer:
      'A Nendoroid is a roughly 10 cm chibi-proportioned figure made by Good Smile Company, distinguished by its interchangeable parts: each one ships with several swappable face plates, hands and accessories so a single figure can be posed and re-expressed. The line has run since 2006 and is numbered sequentially, and parts are broadly compatible across it.',
    sections: [
      {
        heading: 'What makes a Nendoroid a Nendoroid',
        bullets: [
          'Chibi proportions — an oversized head on a small body, at roughly 10 cm tall.',
          'Interchangeable face plates, typically two or three per release, covering different expressions.',
          'Swappable hands, arms, legs and hair parts, plus character-specific accessories.',
          'A clear articulated stand with an arm, so the figure can be posed in mid-air.',
          'A sequential release number, so collectors refer to them by number as well as name.',
        ],
      },
      {
        heading: 'Nendoroid, figma and Nendoroid Doll',
        table: {
          head: ['Line', 'What it is'],
          rows: [
            {
              label: 'Nendoroid',
              value:
                'Chibi-proportioned, around 10 cm, swappable faces and parts. The core line.',
            },
            {
              label: 'figma',
              value:
                'Also Good Smile, but realistically proportioned and fully articulated at roughly 1/12 scale. An action figure rather than a chibi one.',
            },
            {
              label: 'Nendoroid Doll',
              value:
                'Nendoroid heads on a soft-bodied, cloth-dressed frame. Outfits are actual fabric and can be changed between dolls.',
            },
            {
              label: 'Nendoroid More',
              value:
                'Accessory sets — alternative bases, outfits and parts — sold separately to use with the main line.',
            },
          ],
        },
      },
      {
        heading: 'Why collectors like them',
        paras: [
          'Two reasons, and they are practical rather than aesthetic. The first is footprint: at 10 cm a Nendoroid fits a bookshelf, a desk or a cabinet row where a scale figure would not, so a collection can grow without a display problem.',
          'The second is that they are the only mainstream format where one purchase gives you several presentations of the character. Swapping a face plate genuinely changes the piece, which makes a Nendoroid something you interact with rather than only look at.',
        ],
      },
      {
        heading: 'What to watch for',
        bullets: [
          'Small parts. Face plates, hands and accessories are easy to lose, and replacements are not sold individually.',
          'Joint tightness varies between releases, and a loose hip or shoulder limits which poses hold.',
          'The stand arm is release-specific in its fitting, so keep it with the figure.',
          'Price sits above a prize figure and below a retail scale figure — you are paying for the parts count, not for size.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How big is a Nendoroid?',
        answer:
          'Roughly 10 cm tall. Because the proportions are chibi — a large head on a small body — the height is broadly consistent across the line regardless of how tall the character is in the source work.',
      },
      {
        question: 'What is the difference between a Nendoroid and a figma?',
        answer:
          'Both are Good Smile Company lines. A Nendoroid is chibi-proportioned at about 10 cm with swappable face plates and parts. A figma is realistically proportioned and fully articulated at roughly 1/12 scale — an action figure rather than a stylised one.',
      },
      {
        question: 'Are Nendoroid parts interchangeable between figures?',
        answer:
          'Largely yes, which is part of the appeal — the joint and face-plate systems are shared across the line, so hands, arms and bases from one Nendoroid usually fit another. Face plates are character-specific in appearance but use the same mounting.',
      },
      {
        question: 'Are Nendoroids good for a first figure?',
        answer:
          'They are a strong first purchase if desk or shelf space is limited and you want something to handle rather than only display. If you want presence on a shelf, a scale figure or a statue gives you more of that for similar money.',
      },
    ],
    relatedTypes: ['miniature-figures', 'action-figures'],
    relatedManufacturers: ['good-smile-company'],
    relatedGuides: [
      'funko-pop-vs-nendoroid',
      'anime-figure-scales-explained',
      'action-figure-vs-statue',
    ],
  },

  {
    slug: 'what-is-a-noodle-stopper-figure',
    category: 'formats',
    title: 'What Is a Noodle Stopper Figure?',
    h1: 'What Is a Noodle Stopper Figure?',
    metaDescription:
      'FuRyu’s Noodle Stopper line explained — sitting-pose prize figures with a flat top designed to hold down an instant-noodle cup lid, and why they are so affordable.',
    updated: '2026-09-17',
    answer:
      'A Noodle Stopper is a prize figure line made by FuRyu, built in a sitting or perching pose with a deliberately flat upper surface so the figure can be set on top of an instant-noodle cup to hold the lid down while it brews. They are distributed through the Japanese arcade prize channel rather than retail, which is why they cost a fraction of a retail scale figure of the same character.',
    sections: [
      {
        heading: 'The name is literal',
        paras: [
          'Japanese cup noodles need the lid held closed for a few minutes. The line exists because a small figure sitting on the lid does that job, and FuRyu designed the poses around it: the characters sit, perch or lean, and the top of the sculpt is flat enough to rest on a lid without tipping.',
          'In practice most buyers never use one for noodles. What the design produces is a figure that sits naturally on a shelf edge, a monitor stand or a desk — which is why the line has a following well outside Japan.',
        ],
      },
      {
        heading: 'What to expect',
        table: {
          head: ['Attribute', 'Typical'],
          rows: [
            { label: 'Manufacturer', value: 'FuRyu' },
            { label: 'Height', value: 'Roughly 10–14 cm, depending on the pose' },
            { label: 'Pose', value: 'Sitting, perching or leaning — fixed, not articulated' },
            { label: 'Scale', value: 'None stated. Prize figures are made to a size, not a ratio' },
            { label: 'Channel', value: 'Japanese arcade prize distribution, then export' },
            { label: 'Price tier', value: 'The entry end of officially licensed figures' },
          ],
        },
      },
      {
        heading: 'Cheap, but not a bootleg',
        paras: [
          'The most common misunderstanding about this line is that the price implies something is wrong with it. It does not. Prize figures are licensed products manufactured to a lower cost point because the prize channel supports one — simpler paint applications, no stated scale, lighter packaging — and FuRyu is a legitimate manufacturer of them.',
          'A ₹900 Noodle Stopper is a real, licensed FuRyu figure. A ₹900 1/7 scale statue from a retail manufacturer is not, and knowing which tier you are looking at is what lets you tell the difference.',
        ],
      },
      {
        heading: 'Related FuRyu lines',
        bullets: [
          'Trio-Try-iT — standing prize figures, slightly larger, same channel.',
          'Noodle Stopper Premium — a higher-finish variant of the same concept.',
          'Other makers run comparable prize lines: Banpresto’s Q Posket and Grandista, Sega’s Luminasta and PM Perching, Taito’s Coreful.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can you actually use a Noodle Stopper figure on cup noodles?',
        answer:
          'Yes — that is what the flat top and the sitting pose are for, and the line is named after it. Most owners display them instead, because the same design makes them sit well on a shelf edge or a desk.',
      },
      {
        question: 'How tall is a Noodle Stopper figure?',
        answer:
          'Usually 10–14 cm, varying with the pose. Like other prize figures they carry no stated scale, so the box gives a height rather than a ratio.',
      },
      {
        question: 'Why are Noodle Stopper figures so cheap?',
        answer:
          'Because they are prize figures, made for Japanese arcade crane-game distribution at a lower cost point — simpler paint, no stated scale, lighter packaging. They are fully licensed FuRyu products; the price reflects the channel, not the legitimacy.',
      },
    ],
    relatedTypes: ['noodle-stopper-figures', 'miniature-figures'],
    relatedManufacturers: ['furyu'],
    relatedPriceBands: ['under-1000', '1000-to-2500'],
    relatedGuides: [
      'prize-figure-vs-scale-figure',
      'how-to-spot-a-bootleg-anime-figure',
      'anime-figure-scales-explained',
    ],
  },

  {
    slug: 'prize-figure-vs-scale-figure',
    category: 'formats',
    title: 'Prize Figure vs Scale Figure: What Actually Differs',
    h1: 'Prize Figure vs Scale Figure',
    metaDescription:
      'Why two official figures of the same character can be five times apart in price — the difference between arcade prize figures and retail scale figures, point by point.',
    updated: '2026-09-17',
    answer:
      'A prize figure was produced for Japanese arcade crane-game distribution and a scale figure was produced for retail sale, and that channel difference explains nearly every other difference between them: prize figures state no scale, use simpler paint applications and lighter packaging, and cost a fraction as much. Both are fully licensed — a cheap prize figure is not a lower-grade version of a scale figure, it is a different product.',
    sections: [
      {
        heading: 'Point by point',
        table: {
          head: ['Prize figure', 'Scale figure'],
          rows: [
            {
              label: 'Distributed through Japanese arcade crane games and prize outlets',
              value: 'Sold at retail and through preorder',
            },
            {
              label: 'No stated scale — a height on the box instead',
              value: 'Stated ratio: 1/4, 1/6, 1/7, 1/8',
            },
            {
              label: 'Typically 10–20 cm',
              value: 'Typically 20–45 cm',
            },
            {
              label: 'Simpler paint: fewer applications, flatter tones',
              value: 'Blended gradients, shading, multi-layer finishing',
            },
            {
              label: 'Plainer base, often a simple disc',
              value: 'Sculpted, themed base, frequently with effect parts',
            },
            {
              label: 'Light box, minimal insert',
              value: 'Large printed box with a moulded tray',
            },
            {
              label: 'Banpresto, Sega, Taito, FuRyu',
              value: 'Good Smile, Alter, Kotobukiya, MegaHouse, Aniplex',
            },
            {
              label: 'Entry price tier',
              value: 'Several times the price for the same character',
            },
          ],
        },
      },
      {
        heading: 'Why this is the most useful distinction to learn',
        paras: [
          'It is the fact that lets you read a price correctly. Without it, a catalogue looks arbitrary: the same character appears at ₹900 and at ₹6,000 and neither number seems to mean anything. With it, both prices are obvious.',
          'It is also the main defence against recasts. The instinct that "cheap means fake" sends people either to overpay unnecessarily or, worse, to trust a scale figure priced like a prize figure. What should trigger suspicion is a price that is wrong for the TIER — a large scale statue at prize-figure money — not a low price by itself.',
        ],
      },
      {
        heading: 'Which one to buy',
        bullets: [
          'Buy prize figures to collect breadth: more characters, less money, less shelf space each.',
          'Buy scale figures for a centrepiece: one character rendered as well as the format allows.',
          'Mixing them on one shelf works badly for consistency — different heights, different finishes — so many collectors keep a prize shelf and a scale shelf.',
          'If you want figures that line up, stay within one scale from retail manufacturers. Prize figures have no scale to line up with.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are prize figures official?',
        answer:
          'Yes. Banpresto, Sega, Taito and FuRyu are licensed manufacturers, and prize figures are legitimate products made for the Japanese arcade crane-game channel. They cost less because that channel supports a lower cost point, not because they are unofficial.',
      },
      {
        question: 'Why is the same character available at ₹900 and at ₹6,000?',
        answer:
          'Format. The ₹900 piece is almost certainly a prize figure — 10–20 cm, no stated scale, simpler paint. The ₹6,000 one is a retail scale figure — larger, a stated ratio, blended paint and a sculpted base. Both are licensed products at different tiers.',
      },
      {
        question: 'Is a prize figure bad quality?',
        answer:
          'No, just simpler. Sculpts in the prize channel are frequently excellent; what is reduced is paint complexity, base detail and packaging. For most shelves at most distances the difference is far smaller than the price gap suggests.',
      },
      {
        question: 'So when should a low price worry me?',
        answer:
          'When it is wrong for the tier. A large scale figure from a retail manufacturer priced like a prize figure is the warning sign. A prize figure priced like a prize figure is just a prize figure.',
      },
    ],
    relatedTypes: ['noodle-stopper-figures', 'collectible-statues', 'miniature-figures'],
    relatedManufacturers: ['banpresto', 'furyu', 'sega', 'good-smile-company', 'alter'],
    relatedGuides: [
      'anime-figure-scales-explained',
      'what-is-a-noodle-stopper-figure',
      'how-to-spot-a-bootleg-anime-figure',
      'why-anime-figures-cost-more-in-india',
    ],
  },

  {
    slug: 'resin-vs-pvc-vs-abs-figures',
    category: 'formats',
    title: 'Resin vs PVC vs ABS: What Anime Figures Are Made Of',
    h1: 'Resin vs PVC vs ABS Figures',
    metaDescription:
      'The four materials figures are made from — PVC, ABS, resin and polystone — how each behaves in heat and handling, and which one your figure probably is.',
    updated: '2026-09-17',
    answer:
      'Most mass-produced anime figures are PVC for the body with ABS for bases, weapons and joints, because PVC takes fine detail and paint well while ABS is rigid enough to bear weight. Resin and polystone are used for limited-run, high-end statues: they hold more detail and feel substantial, but they are brittle and considerably heavier, which matters both for display and for shipping.',
    sections: [
      {
        heading: 'The four materials',
        table: {
          head: ['Material', 'Behaviour'],
          rows: [
            {
              label: 'PVC (polyvinyl chloride)',
              value:
                'Slightly flexible, takes fine detail and paint well, light. Softens in sustained heat, which is why thin swords and hair spikes bend. The body material of almost every mass-produced figure.',
            },
            {
              label: 'ABS (acrylonitrile butadiene styrene)',
              value:
                'Rigid and strong, poorer at very fine detail. Used for bases, pegs, joints and weapons — the parts that must not flex.',
            },
            {
              label: 'Resin (polyurethane / polyester cast)',
              value:
                'Cast rather than injection-moulded, so it holds the sharpest detail. Heavy and brittle: it chips and snaps rather than bending. Garage kits and high-end statues.',
            },
            {
              label: 'Polystone',
              value:
                'Resin loaded with mineral filler. Very heavy, very detailed, and the most fragile of the four — a drop that would bend PVC will shatter polystone.',
            },
          ],
        },
      },
      {
        heading: 'Why it matters in practice',
        bullets: [
          'Heat. PVC is the material that bends in a hot courier van or on a sunny shelf. Resin and polystone do not bend — they are unaffected until they break.',
          'Weight. A large polystone statue can be surprisingly heavy, which is a real consideration for glass cabinet shelves.',
          'Repair. PVC can sometimes be relaxed back into shape with warmth. A snapped resin part is a glue job, and a shattered polystone one often is not repairable at all.',
          'Shipping. Brittle materials need more void fill, not less — and this is why large statues should never ship in their own figure box alone.',
          'Cleaning. All four are damaged by solvents. The material does not change the rule: no alcohol, no acetone, no glass cleaner.',
        ],
      },
      {
        heading: 'How to tell what you have',
        paras: [
          'Weight is the quickest test. Pick the figure up: PVC feels light for its size, resin and polystone feel dense and cold. Flex a non-critical part very gently — PVC gives slightly, resin does not give at all.',
          'Listings and boxes usually state it. Retail scale figures from the Japanese manufacturers are almost always described as PVC and ABS; anything described as a "statue" from a Western high-end maker is likely resin or polystone.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are anime figures made of plastic or resin?',
        answer:
          'Most mass-produced figures are PVC plastic with ABS for bases, joints and weapons. Resin and polystone are used for limited-run high-end statues — they hold finer detail and feel much heavier, but they are brittle rather than flexible.',
      },
      {
        question: 'Why did my figure’s sword bend?',
        answer:
          'Because it is PVC, which softens in sustained heat — a hot courier van or a sunny shelf is enough. Standing the figure upright in a cool room for a day sometimes lets it relax back. Warm-water straightening works but risks the paint, so treat it as a last resort.',
      },
      {
        question: 'Is resin better than PVC?',
        answer:
          'Better at detail, worse at survival. Resin holds sharper sculpting and feels more substantial, but it chips and snaps where PVC would flex, and it is much heavier. For a figure that will be handled or moved, PVC is more forgiving.',
      },
      {
        question: 'Can I clean all figure materials the same way?',
        answer:
          'Yes, and the rule is the same for all of them: a soft dry brush, and no solvents. Alcohol, acetone and glass cleaner attack the paint and the printed facial features regardless of what the body underneath is made of.',
      },
    ],
    relatedTypes: ['collectible-statues', 'prop-replicas', 'action-figures'],
    relatedGuides: [
      'how-to-clean-anime-figures',
      'shipping-large-statues-in-india',
      'how-to-stop-figures-yellowing',
    ],
  },

  {
    slug: 'action-figure-vs-statue',
    category: 'formats',
    title: 'Action Figure vs Statue: Which Should You Buy?',
    h1: 'Action Figure vs Statue',
    metaDescription:
      'Articulation versus sculpt quality — how action figures and fixed-pose statues differ in price, display, durability and long-term condition.',
    updated: '2026-09-17',
    answer:
      'An action figure is articulated, so it can be reposed and rearranged; a statue is a single fixed pose, which lets the same production budget go into sculpt and paint instead of into joints. At a similar price the statue usually looks better standing still and the action figure gives you more to do with it — so the right choice depends on whether you rearrange your display.',
    sections: [
      {
        heading: 'What each format puts your money into',
        table: {
          head: ['Action figure', 'Statue'],
          rows: [
            {
              label: 'Articulated joints, often 20 or more points',
              value: 'No articulation; one sculpted pose',
            },
            {
              label: 'Budget goes into engineering the joints',
              value: 'Budget goes into sculpt detail and paint',
            },
            {
              label: 'Interchangeable hands, faces and accessories',
              value: 'Fixed parts, frequently with effect pieces',
            },
            {
              label: 'Visible joint seams across the sculpt',
              value: 'Unbroken sculpt lines',
            },
            {
              label: 'Repose-able; suits a display you change',
              value: 'Fixed silhouette; suits a display you set once',
            },
            {
              label: 'Joints can loosen with repeated posing',
              value: 'Nothing to loosen; chipping is the failure mode',
            },
          ],
        },
      },
      {
        heading: 'The long-term difference nobody mentions at purchase',
        paras: [
          'Action figure joints wear. Repeated posing loosens them, and a loose hip or ankle eventually will not hold a dynamic stance — which is the pose you bought the figure for. Some are tightened with careful disassembly, some are not.',
          'Statues have no moving parts to fail, so their failure mode is physical: a chip, a snapped thin part, or paint wear at a contact point. Kept in a cabinet and left alone, a statue is the more durable of the two by a wide margin.',
        ],
      },
      {
        heading: 'How to choose',
        bullets: [
          'Do you enjoy handling and rearranging things? Action figure.',
          'Do you want one piece that looks as good as the format allows and then stays put? Statue.',
          'Photographing your collection? Articulation is a large advantage.',
          'Buying for a child or a shared space? Action figures tolerate handling; statues do not.',
          'Limited shelf depth? Statues with effect bases are the deepest thing in the category — check the stated dimensions.',
        ],
      },
      {
        heading: 'A note on terminology',
        paras: [
          'The words are used loosely. Sellers describe fixed-pose PVC figures as "statues", "figurines", "scale figures" and "collectible statues" more or less interchangeably, and only the high-end resin pieces are consistently called statues. What matters is whether the listing photographs show joints — if the elbows and knees have visible seams and cut lines, it is articulated whatever the title says.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is an action figure or a statue better value?',
        answer:
          'Depends what you value. At a similar price the statue puts more into sculpt detail and paint, so it looks better standing still. The action figure puts that money into articulation and accessories, so it does more. Neither is objectively better value.',
      },
      {
        question: 'Do action figure joints wear out?',
        answer:
          'They loosen with repeated posing, yes, and a loose hip or ankle may eventually stop holding a dynamic stance. Statues have nothing to loosen — their failure mode is chipping or a snapped thin part — so a statue left in a cabinet is the more durable format.',
      },
      {
        question: 'How can I tell if a figure is articulated from the listing?',
        answer:
          'Look at the photographs rather than the title, which sellers use loosely. Visible seams and cut lines at elbows, knees and shoulders mean articulation; unbroken sculpt lines across those joints mean a fixed pose.',
      },
    ],
    relatedTypes: ['action-figures', 'collectible-statues'],
    relatedGuides: [
      'anime-figure-scales-explained',
      'prize-figure-vs-scale-figure',
      'resin-vs-pvc-vs-abs-figures',
      'how-to-display-anime-figures',
    ],
  },

  {
    slug: 'funko-pop-vs-nendoroid',
    category: 'formats',
    title: 'Funko Pop vs Nendoroid: Which Is Right for You?',
    h1: 'Funko Pop vs Nendoroid',
    metaDescription:
      'Two stylised 10 cm formats with almost nothing else in common — licence breadth, articulation, price, and boxed versus loose collecting culture, compared.',
    updated: '2026-09-17',
    answer:
      'Funko Pops and Nendoroids are both stylised figures around 10 cm tall, and that is roughly where the similarity ends: a Pop is a fixed-pose vinyl figure collected largely boxed, with licences across effectively all of pop culture, while a Nendoroid is an articulated figure with interchangeable faces and parts, made by Good Smile Company mostly for anime and game properties, at two to three times the price.',
    sections: [
      {
        heading: 'Side by side',
        table: {
          head: ['Funko Pop', 'Nendoroid'],
          rows: [
            { label: 'Funko (United States)', value: 'Good Smile Company (Japan)' },
            { label: 'Around 10 cm', value: 'Around 10 cm' },
            {
              label: 'Fixed pose; head rotates on most releases',
              value: 'Articulated, with swappable faces, hands and parts',
            },
            {
              label: 'Uniform house style across every licence',
              value: 'Character-specific sculpt within a chibi style',
            },
            {
              label: 'Effectively every property — film, TV, games, sport, music, anime',
              value: 'Predominantly anime, manga and games',
            },
            {
              label: 'Entry price tier',
              value: 'Roughly two to three times a standard Pop',
            },
            {
              label: 'Collected boxed; stickers and box condition carry value',
              value: 'Collected displayed; the box is packaging',
            },
            {
              label: 'Value driven by exclusivity and vaulting',
              value: 'Value driven by whether the release is still in production',
            },
          ],
        },
      },
      {
        heading: 'They are not really competing formats',
        paras: [
          'A Pop is a collecting format. The house style is the point — every character reduced to the same silhouette, which is what makes a shelf of thirty of them read as a set, and what makes the box, the sticker and the item number matter as much as the figure.',
          'A Nendoroid is a display and handling format. You buy one character and get several presentations of them, and the box goes in a cupboard. Nobody grades a Nendoroid box.',
          'Which means the honest answer to "which is better" is that they answer different questions. Breadth and collectability against interaction and character-specific sculpting.',
        ],
      },
      {
        heading: 'Practical notes',
        bullets: [
          'Shelf space: a loose Pop needs about half the depth of a boxed one. Nendoroids need depth for the stand arm if you pose them airborne.',
          'Small parts: Nendoroid face plates and hands are easy to lose and are not sold separately. Pops have no loose parts.',
          'Licence availability: if the character is from a non-anime property, a Pop is often the only stylised figure that exists.',
          'Handling: Nendoroids are built to be handled. Pops are not fragile, but there is nothing to do with one.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are Nendoroids worth the extra cost over Funko Pops?',
        answer:
          'If you want articulation, interchangeable expressions and a character-specific sculpt, yes — you are paying for parts count and engineering. If you want breadth across many characters and properties, a Pop gives you far more figures for the same money.',
      },
      {
        question: 'Which has better licence coverage?',
        answer:
          'Funko, by a wide margin. Pops exist for film, television, games, sport, music and anime. Nendoroids are concentrated on anime, manga and game properties.',
      },
      {
        question: 'Do Nendoroid boxes matter for value like Funko boxes do?',
        answer:
          'Much less. Nendoroid value tracks whether the release is still in production rather than box condition, and the box is treated as packaging. Funko value depends heavily on box condition and the stickers printed on it.',
      },
      {
        question: 'Which is better for a desk?',
        answer:
          'Nendoroid, generally — it is built to be handled, holds a pose and can be re-expressed. A loose Pop also sits well on a desk and costs less, but there is nothing to interact with.',
      },
    ],
    relatedTypes: ['funko-pop', 'miniature-figures'],
    relatedManufacturers: ['funko', 'good-smile-company'],
    relatedGuides: [
      'what-is-a-nendoroid',
      'funko-pop-sticker-guide',
      'should-you-keep-a-funko-in-the-box',
    ],
  },
];
