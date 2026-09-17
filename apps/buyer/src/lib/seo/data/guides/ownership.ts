import type { GuideDef } from './types';

/**
 * Care, display and storage guides.
 *
 * Written for Indian conditions specifically, because that is where the
 * generic advice fails: heat above 40 °C, monsoon humidity, and direct sun
 * through uncoated glass are the three things that actually damage a
 * collection here, and none of them feature in guides written for temperate
 * climates.
 *
 * ⚠️ One hard rule in this cluster: the "retrobright" hydrogen-peroxide
 * technique circulates widely as a yellowing fix and must NOT be recommended
 * for painted figures. It is for bare retro ABS computer plastic; on a painted
 * and tampo-printed figure it attacks the decoration. Telling a reader to try
 * it would destroy the object they asked how to save.
 */
export const OWNERSHIP_GUIDES: GuideDef[] = [
  {
    slug: 'how-to-clean-anime-figures',
    category: 'ownership',
    title: 'How to Clean Anime Figures Without Damaging the Paint',
    h1: 'How to Clean Anime Figures Safely',
    metaDescription:
      'A soft dry brush, never a cloth, and no solvents — the safe method for dusting figures, plus the cleaners that strip printed faces and should never touch one.',
    updated: '2026-09-17',
    answer:
      'Clean anime figures with a soft, dry brush rather than a cloth: a cloth snags on small sculpted parts and drags across printed facial features, while a brush lifts dust out of recesses without pressure. Never use alcohol, acetone, glass cleaner or wet wipes — all of them attack the tampo-printed eyes and eyebrows, which is the part of a figure that cannot be repaired.',
    sections: [
      {
        heading: 'The method',
        bullets: [
          'Weekly, or whenever dust is visible: a soft dry brush. A clean makeup brush or a soft artist’s brush is ideal — natural bristle, no hard edges.',
          'Work from the top down so dislodged dust falls off rather than onto cleaned areas.',
          'For deep recesses — between hair strands, inside effect parts — a puff of canned air from at least 20 cm, at low pressure, held upright so no propellant sprays out as liquid.',
          'For a smooth, undecorated surface such as a plain base, a dry microfibre cloth is fine.',
          'For genuinely stubborn grime: a cotton bud barely dampened with plain water, used on the body only, never the face, and dried immediately.',
        ],
      },
      {
        heading: 'What must never touch a figure',
        table: {
          head: ['Avoid', 'Why'],
          rows: [
            {
              label: 'Isopropyl alcohol / rubbing alcohol',
              value:
                'Dissolves tampo printing. It will take the eyes off, and often in a single pass.',
            },
            {
              label: 'Acetone / nail polish remover',
              value: 'Attacks both the paint and the plastic underneath.',
            },
            {
              label: 'Glass or surface cleaner',
              value:
                'Contains ammonia and surfactants that haze clear parts and lift printed detail.',
            },
            {
              label: 'Baby wipes and wet wipes',
              value:
                'The surfactants are the problem, not the water. They lift printed facial features while looking gentle.',
            },
            {
              label: 'Submerging or rinsing under a tap',
              value:
                'Water enters seams and peg holes, and metal pegs and screws inside some figures will rust.',
            },
            {
              label: 'A dry cloth on a detailed sculpt',
              value:
                'Snags on small parts — fingers, hair spikes, effect pieces — and snaps them.',
            },
          ],
        },
      },
      {
        heading: 'Sticky or tacky surfaces',
        paras: [
          'A figure that feels tacky rather than dusty is usually experiencing plasticiser migration — the softener in the PVC rising to the surface, accelerated by heat. It is not dirt, so cleaning does not fix it.',
          'What helps is removing the cause: get the figure out of heat and out of direct sun, and give it air rather than a sealed case. A very light dusting with cornflour is sometimes suggested to absorb the surface tack, but it collects in recesses and looks worse on a detailed sculpt, so it is a last resort on a plain surface only.',
        ],
      },
      {
        heading: 'Prevention beats cleaning',
        bullets: [
          'A closed cabinet reduces dusting to a few times a year rather than weekly.',
          'Keep figures away from the kitchen. Airborne cooking grease binds dust into a film that a dry brush will not lift.',
          'In an Indian city, a closed cabinet also keeps out road dust, which is abrasive — brushing it off a figure is what causes fine scratches on glossy surfaces.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I use alcohol to clean an anime figure?',
        answer:
          'No. Isopropyl alcohol dissolves the tampo printing that forms the eyes and eyebrows, often in a single wipe, and that detail cannot be restored. Use a soft dry brush; if something needs moisture, plain water on a cotton bud, on the body only, dried immediately.',
      },
      {
        question: 'What is the safest way to dust a figure?',
        answer:
          'A soft, dry brush — a clean makeup or artist’s brush — worked from the top down. It lifts dust out of recesses without pressure. A cloth is worse than it looks: it snags on small sculpted parts and drags across printed facial features.',
      },
      {
        question: 'Can I wash a figure with soap and water?',
        answer:
          'Not advisable. Submerging lets water into seams and peg holes, some figures have internal metal parts that rust, and soap surfactants lift printed detail. A barely damp cotton bud with plain water, on the body only, is as wet as it should get.',
      },
      {
        question: 'Why does my figure feel sticky?',
        answer:
          'Plasticiser migration — the softener in the PVC rising to the surface, driven by heat. It is not dirt and cleaning will not fix it. Move the figure out of heat and direct sun and give it airflow rather than sealing it up.',
      },
    ],
    relatedGuides: [
      'how-to-stop-figures-yellowing',
      'how-to-display-anime-figures',
      'resin-vs-pvc-vs-abs-figures',
    ],
  },

  {
    slug: 'how-to-stop-figures-yellowing',
    category: 'ownership',
    title: 'How to Stop Anime Figures and Funko Boxes Yellowing',
    h1: 'How to Stop Figures Yellowing',
    metaDescription:
      'Why white PVC and clear Funko windows yellow, the three causes, what actually prevents it in Indian conditions — and why the retrobright fix must never be used on figures.',
    updated: '2026-09-17',
    answer:
      'Figures yellow from ultraviolet light, heat and the plasticiser in PVC migrating over time, and white or pale sculpts show it first while a Funko box’s clear window usually goes before the figure inside it does. Prevention is the whole game: keep figures out of direct sunlight, use LED rather than halogen lighting, and keep them below sustained high temperatures — yellowing is effectively irreversible on a painted figure.',
    sections: [
      {
        heading: 'The three causes',
        table: {
          head: ['Cause', 'What it does'],
          rows: [
            {
              label: 'Ultraviolet light',
              value:
                'The main driver. Sunlight through an uncoated window will visibly yellow a white sculpt or a box window in a single Indian summer.',
            },
            {
              label: 'Heat',
              value:
                'Accelerates everything else. A shelf on a sun-facing wall, or above a device that runs warm, ages a figure faster than the same figure across the room.',
            },
            {
              label: 'Plasticiser migration',
              value:
                'The softener in PVC moves to the surface over years, causing both tackiness and a yellow cast. Slowed by lower temperatures; not stoppable.',
            },
          ],
        },
      },
      {
        heading: 'What actually prevents it',
        bullets: [
          'No direct sunlight, ever. This single change does more than everything else combined. A figure two metres from a bright window and out of the sun beam is fine; one on the sill is not.',
          'UV-filtering film on the window of the room, or a cabinet with UV-filtering glass. Film is cheap and works on the whole collection at once.',
          'LED lighting only, and mounted with an air gap. Halogen and incandescent bulbs put out heat as well as light, and a warm spot inside a closed cabinet is the worst of both causes.',
          'Keep ambient temperature down where practical. In a room that regularly exceeds 35–40 °C, an interior wall away from the window matters more than any accessory.',
          'For boxes: acid-free PET protectors, not PVC. A PVC protector can off-gas and haze the very window it is protecting.',
        ],
      },
      {
        heading: 'Why you cannot fix it afterwards',
        paras: [
          'Yellowing on a painted figure is not surface dirt — it is a change in the plastic and, for boxes, in the acetate. Nothing you wipe on will reverse it.',
          'The technique people find when they search for a fix is "retrobright": hydrogen peroxide plus UV exposure, used to whiten yellowed retro computer cases. It works on bare ABS. It must NOT be used on an anime figure or a Funko: the peroxide and the UV attack the paint and the tampo-printed face, so the likely outcome is a figure that is whiter and also ruined.',
          'The same applies to bleach, and to abrasive polishes — those remove the yellowed layer along with the paint on top of it.',
        ],
      },
      {
        heading: 'What to do with an already-yellowed piece',
        paras: [
          'Accept it and stop the progression, which is genuinely worth doing because yellowing compounds. Move the piece out of light and heat and it will stay roughly as it is rather than continuing to darken.',
          'For a boxed Funko where only the window has yellowed, the figure inside is usually unaffected — the acetate took the UV. If display matters more than resale, taking it out solves the visual problem entirely.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do white anime figures turn yellow?',
        answer:
          'Ultraviolet light and heat, plus plasticiser in the PVC migrating to the surface over years. White and pale sculpts show the colour change first because there is no pigment to mask it. Direct sunlight is by far the largest single factor.',
      },
      {
        question: 'Can yellowing be reversed?',
        answer:
          'Not on a painted figure. It is a change in the plastic rather than surface dirt. The retrobright hydrogen-peroxide method that works on bare retro ABS will attack the paint and the printed face — it should never be used on a figure or a Funko.',
      },
      {
        question: 'Do Funko Pop boxes yellow before the figure?',
        answer:
          'Usually yes. The clear acetate window takes the UV first, so the box discolours while the vinyl inside is still fine. If you only care about display, removing the figure solves it; if you care about resale, the box condition is part of the value.',
      },
      {
        question: 'Does cabinet lighting cause yellowing?',
        answer:
          'Halogen and incandescent lighting can, because they add heat inside an enclosed cabinet. LED strips run cool and are the safe choice — mount them with an air gap rather than flush against a shelf a figure stands on.',
      },
    ],
    relatedTypes: ['funko-pop', 'collectible-statues'],
    relatedGuides: [
      'how-to-display-anime-figures',
      'how-to-clean-anime-figures',
      'should-you-keep-a-funko-in-the-box',
      'how-to-store-figure-boxes',
    ],
  },

  {
    slug: 'how-to-display-anime-figures',
    category: 'ownership',
    title: 'How to Display Anime Figures: Cabinets, Lighting and Layout',
    h1: 'How to Display Anime Figures',
    metaDescription:
      'Choosing a display cabinet, why depth matters more than width, LED lighting that will not yellow your collection, and laying out a shelf that reads well.',
    updated: '2026-09-17',
    answer:
      'The two decisions that matter most in displaying figures are enclosure and depth: a closed cabinet cuts dusting from weekly to a few times a year, and shelf depth — not width — is what runs out first, because scale figures on effect bases are much deeper than they look. Light with LED strips only, since halogen and incandescent bulbs add heat inside an enclosed case and heat accelerates yellowing.',
    sections: [
      {
        heading: 'Open shelf or closed cabinet',
        paras: [
          'A closed cabinet is the single biggest quality-of-life improvement for a collection of any size. Dust is the recurring maintenance cost of displaying figures, and in an Indian city the dust is both heavier and more abrasive than in a temperate one — brushing road dust off a glossy sculpt is what produces fine scratches over years.',
          'Open shelving looks better in a room and is cheaper. It is a reasonable choice for a small collection you enjoy handling, and a poor one for thirty pieces you want to leave alone.',
        ],
      },
      {
        heading: 'Depth is the constraint',
        bullets: [
          'Allow roughly 15–20 per cent over a figure’s stated dimensions. Effect bases add both height and depth, and listings state the height as displayed.',
          'A boxed Funko needs about twice the depth of a loose one — this is usually what decides whether a collection is displayed boxed.',
          'Measure your deepest planned piece before buying a cabinet. Shelf height can often be adjusted; depth cannot.',
          'The community standards are the IKEA Detolf (a tall narrow glass tower, deep enough for most scale figures) and the Milsbo (wider, shallower). Both are popular because they are glass on multiple sides, which is what makes figures visible rather than stored.',
        ],
      },
      {
        heading: 'Lighting',
        bullets: [
          'LED strips only. Halogen and incandescent bulbs put heat into an enclosed cabinet, and heat is a direct cause of yellowing and tackiness.',
          'Mount strips with an air gap rather than flush against a shelf a figure stands on.',
          'Neutral white, around 4000 K, renders paint most accurately. Very warm light yellows whites visually; very cool light flattens skin tones.',
          'Light from the front and slightly above. Lighting from directly overhead casts shadows into faces, which is exactly the detail you paid for.',
        ],
      },
      {
        heading: 'Laying out a shelf',
        bullets: [
          'Tier the depth with risers so the back row is visible. A flat row means everything behind the front is hidden.',
          'Group by scale rather than by series. Mixed heights read as clutter; consistent heights read as a collection.',
          'Keep prize figures and retail scale figures on separate shelves — the finish difference is visible side by side and flatters neither.',
          'Leave space. A shelf at eighty per cent capacity looks considerably better than one at a hundred.',
          'Put the fragile and expensive pieces on a shelf that is not at elbow height, and not on the shelf you open most often.',
        ],
      },
      {
        heading: 'Indian-specific considerations',
        bullets: [
          'Monsoon humidity encourages mould on cardboard, so stored boxes should not live inside the display cabinet with the figures.',
          'A glass cabinet against an exterior sun-facing wall gets hot even without direct sun on it. An interior wall is the better position.',
          'If the room has a ceiling fan running most of the day, an open shelf collects dust faster than the same shelf would elsewhere — another argument for glass.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the best cabinet for displaying anime figures?',
        answer:
          'The IKEA Detolf and Milsbo are the community standards — both are glass on multiple sides, which is what makes a collection visible rather than stored. The Detolf is tall and narrow with enough depth for most scale figures; the Milsbo is wider and shallower. Measure your deepest planned piece first, because depth cannot be adjusted later.',
      },
      {
        question: 'What lighting should I use for a figure cabinet?',
        answer:
          'LED strips, around 4000 K neutral white, mounted with an air gap and lighting from the front and slightly above. Avoid halogen and incandescent — they add heat inside an enclosed cabinet, and heat accelerates yellowing and surface tackiness.',
      },
      {
        question: 'How much shelf space does a figure need?',
        answer:
          'Roughly 15–20 per cent more than the stated dimensions, because effect bases add depth as well as height. Depth is what runs out first. A boxed Funko needs about double the depth of a loose one.',
      },
      {
        question: 'Should I display figures boxed or loose?',
        answer:
          'Loose displays better and halves the depth required. Boxed preserves resale value, especially for stickered or vaulted Funko Pops. Many collectors settle on displaying loose and storing the flattened boxes separately.',
      },
    ],
    relatedTypes: ['collectible-statues', 'funko-pop', 'led-figures'],
    relatedGuides: [
      'how-to-stop-figures-yellowing',
      'how-to-clean-anime-figures',
      'how-to-store-figure-boxes',
      'anime-figure-scales-explained',
    ],
  },

  {
    slug: 'how-to-store-figure-boxes',
    category: 'ownership',
    title: 'How to Store Figure and Funko Boxes',
    h1: 'How to Store Figure Boxes',
    metaDescription:
      'Flatten or keep assembled, how to beat monsoon humidity, why boxes should not be stored touching the figure, and what box condition is worth on resale.',
    updated: '2026-09-17',
    answer:
      'Store figure boxes flattened, dry, off the floor and out of direct contact with the figures themselves — cardboard is mildly acidic and moulded trays can imprint paint over time. In Indian conditions humidity is the real threat rather than dust, so a sealed container with silica gel beats an open shelf, and anything stored at floor level is at risk during monsoon.',
    sections: [
      {
        heading: 'Flatten or keep assembled?',
        paras: [
          'Flatten, for almost everyone. An assembled box takes several times the volume and gains nothing, and a carefully flattened box in good condition can be reassembled when you need it. Open the glued seams gently rather than tearing them, and keep the inner tray flat alongside it.',
          'The exception is a sealed Funko you are holding as an investment. Opening it is the single largest reduction in value you can perform in one action, so those stay assembled, sealed and in a protector.',
        ],
      },
      {
        heading: 'Where to store them',
        bullets: [
          'Off the floor. Monsoon water ingress and floor-level humidity are the two things that ruin stored cardboard.',
          'In a sealed plastic box or bag rather than open on a shelf, with a few silica gel sachets. Refresh or replace the sachets each year.',
          'Flat, not on edge. Boxes stored upright bow, and a bowed box will not sit square when reassembled.',
          'Away from sunlight, which yellows a Funko window in storage exactly as it does on display.',
          'Not inside the display cabinet with the figures — see below.',
        ],
      },
      {
        heading: 'Why boxes should not touch the figure',
        paras: [
          'Two reasons. Cardboard and the printing on it are mildly acidic, and prolonged direct contact with painted PVC can mark it. And moulded plastic trays press against the figure at a few specific points; under sustained heat those points can imprint or dull the paint.',
          'This is why a figure that has sat in its tray in a hot cupboard for three years sometimes comes out with a faint mark across a thigh or a shoulder. If you are storing a figure long term rather than displaying it, wrap it in acid-free tissue and store it beside its tray rather than inside it.',
        ],
      },
      {
        heading: 'What box condition is actually worth',
        table: {
          head: ['Format', 'How much the box matters'],
          rows: [
            {
              label: 'Funko Pop',
              value:
                'A great deal. Corner sharpness, window clarity and creasing are graded, and stickers only exist on the box.',
            },
            {
              label: 'Retail scale figure',
              value:
                'Moderately. Buyers expect the box, and a damaged one reduces the price, but grading is far less exacting than for Pops.',
            },
            {
              label: 'Prize figure',
              value:
                'Little. The packaging is light and nobody grades it; the figure is what is being bought.',
            },
            {
              label: 'Nendoroid / figma',
              value:
                'Little for value, but keep the tray — it holds the small parts, and those are not sold separately.',
            },
          ],
        },
      },
    ],
    faqs: [
      {
        question: 'Should I flatten figure boxes or keep them assembled?',
        answer:
          'Flatten them — the volume saving is large and a carefully flattened box can be reassembled later. Open the glued seams gently rather than tearing. The exception is a sealed Funko held as an investment, which should stay sealed and protected.',
      },
      {
        question: 'How do I stop stored boxes getting damaged in monsoon?',
        answer:
          'Keep them off the floor, flat, and in a sealed plastic container or bag with silica gel sachets that you replace annually. Floor-level humidity and water ingress are what actually ruin stored cardboard in Indian conditions — not dust.',
      },
      {
        question: 'Can I store a figure inside its original box long term?',
        answer:
          'Better not to. Cardboard is mildly acidic and moulded trays press on a few specific points, so under sustained heat they can mark or dull paint. For long-term storage, wrap the figure in acid-free tissue and keep it beside the tray rather than inside it.',
      },
      {
        question: 'Does keeping the box increase resale value?',
        answer:
          'Substantially for Funko Pops, where box condition is graded and the stickers live on the box. Moderately for retail scale figures. Barely for prize figures. For Nendoroids the box adds little value but the tray is worth keeping because it holds parts that are not sold separately.',
      },
    ],
    relatedTypes: ['funko-pop'],
    relatedGuides: [
      'should-you-keep-a-funko-in-the-box',
      'how-to-stop-figures-yellowing',
      'how-to-pack-figures-when-moving',
    ],
  },

  {
    slug: 'how-to-pack-figures-when-moving',
    category: 'ownership',
    title: 'How to Pack Anime Figures When Moving House',
    h1: 'How to Pack Figures When Moving',
    metaDescription:
      'Pack a figure collection for a move: why the original box is your best material, what to wrap in and what not to, and the parts that break in transit.',
    updated: '2026-09-17',
    answer:
      'The original figure box with its moulded tray is the best packing material you will ever have for that figure, so use it if you kept it — but place it inside a larger outer carton with void fill rather than shipping or carrying it alone. Wrap unboxed figures in acid-free tissue rather than newspaper, whose ink transfers, and avoid bubble wrap directly against painted surfaces, which can imprint in heat.',
    sections: [
      {
        heading: 'If you kept the boxes',
        bullets: [
          'Reassemble the box, seat the figure in its tray, and tape the box closed so the tray cannot slide out.',
          'Put boxed figures inside an outer carton with roughly 5 cm of void fill on every face. The figure box protects against a shelf; the outer carton protects against a move.',
          'Do not stack heavy cartons on figure cartons. Mark them and load them last.',
        ],
      },
      {
        heading: 'If you did not keep the boxes',
        bullets: [
          'Detach anything designed to come off — swords, capes, effect parts, alternate hands — and bag them individually, labelled per figure. Parts loose in a carton become scratches.',
          'Wrap each figure in acid-free tissue paper first. Newspaper ink transfers onto paint, and it is not removable without a solvent you should not be using.',
          'Then bubble wrap over the tissue, never directly against the figure. Sustained pressure plus heat can press the bubble pattern into painted PVC.',
          'Individually wrapped figures go in a carton in a single layer if possible, with void fill between them, not nested against each other.',
          'Keep the carton upright and mark which way is up. A figure lying on its side for two days bears its own weight on one arm.',
        ],
      },
      {
        heading: 'What breaks, and why it breaks',
        paras: [
          'Almost all transit damage happens to thin parts: sword and spear tips, hair spikes, translucent effect pieces and the peg joining a figure to its base. They break because the figure was carried loose or in a box with room to move, so the part acted as a lever every time the carton was set down hard.',
          'The second failure mode is heat rather than impact. PVC softens in sustained high temperature, and a carton in a closed vehicle in an Indian summer gets very hot — which is why a figure sometimes arrives bent rather than broken. Standing it upright in a cool room for a day often lets it relax back.',
        ],
      },
      {
        heading: 'On arrival',
        bullets: [
          'Unpack figures before furniture if the cartons have been in a hot vehicle — heat damage worsens the longer they stay compressed.',
          'Stand everything upright and leave it a day before judging bent parts.',
          'Keep the packing materials until you have checked every piece.',
          'Reattach detached parts only once the figure is at room temperature. Forcing a cold, stiff peg is how bases crack.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What should I wrap an unboxed figure in?',
        answer:
          'Acid-free tissue paper against the figure, then bubble wrap over the tissue. Never newspaper — the ink transfers onto paint — and never bubble wrap directly against a painted surface, because sustained pressure plus heat can press the bubble pattern into the PVC.',
      },
      {
        question: 'Is the original box good enough to move a figure in?',
        answer:
          'It is the best material you have for that specific figure, but not on its own. Tape it shut so the tray cannot slide out and place it inside a larger outer carton with about 5 cm of void fill on every side. The figure box is designed for a shelf, not for a move.',
      },
      {
        question: 'My figure arrived from a move with a bent sword. Is it ruined?',
        answer:
          'Probably not. PVC softens in sustained heat and cartons get hot in transit, so bending is often heat deformation rather than damage. Stand the figure upright in a cool room for a day and it may relax back on its own.',
      },
      {
        question: 'Should I remove accessories before packing?',
        answer:
          'Yes, anything designed to detach — swords, capes, effect parts, alternate hands. Bag them individually and label them by figure. Loose parts moving inside a carton are a common cause of scratches, and thin accessories break far more easily attached than bagged.',
      },
    ],
    relatedGuides: [
      'shipping-large-statues-in-india',
      'how-to-store-figure-boxes',
      'how-to-clean-anime-figures',
      'resin-vs-pvc-vs-abs-figures',
    ],
  },
];
