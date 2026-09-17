import type { GuideDef } from './types';

/**
 * Authenticity guides.
 *
 * The highest-value cluster on the site and the one with the least margin for
 * error. A reader acts on this advice with their own money, so every signal
 * below is one that genuinely distinguishes an official piece from a recast —
 * not folklore. Where a signal is unreliable on its own it says so, because a
 * checklist that presents a weak tell as decisive is worse than no checklist.
 */
export const AUTHENTICITY_GUIDES: GuideDef[] = [
  {
    slug: 'how-to-spot-a-fake-funko-pop',
    category: 'authenticity',
    title: 'How to Spot a Fake Funko Pop',
    h1: 'How to Spot a Fake Funko Pop',
    metaDescription:
      'Nine checks that separate an official Funko Pop from a bootleg: box print, item number, eye printing, seams, the underfoot copyright line and the price itself.',
    updated: '2026-09-17',
    answer:
      'The most reliable way to spot a fake Funko Pop is the printing, not the figure: official boxes carry sharp, correctly registered colour and a legible copyright line, while bootleg boxes are printed from a scan and show fuzzy logos and soft edges. On the figure itself, check the eyes — official Pops have crisply printed, evenly spaced black ovals, and misaligned or blurred eyes is the single most common bootleg tell.',
    sections: [
      {
        heading: 'Start with the box, not the figure',
        paras: [
          'Bootleggers copy a Pop by scanning a real box and reprinting it. That process loses detail every time, so the box is where the difference shows first and clearest. Hold it under decent light and look at the small text and the logos rather than the character art — art is large and forgiving, six-point legal text is not.',
        ],
        bullets: [
          'The Funko and Pop! logos should have clean, hard edges. Fuzzy outlines, visible pixelation or a slight colour halo around the lettering all point to a reprint.',
          'Every Pop has an item number printed on the box, usually on the front lower corner and again near the barcode. The two should match each other, and the number should match the character — Funko’s own catalogue and the community price guides list them.',
          'There is a copyright and licence line, typically on the base or back of the box, naming the licensor. Garbled, missing or misspelled licensor text is decisive.',
          'The window is rigid, optically clear acetate, cut square to the aperture. Thin, wavy or slightly cloudy plastic that flexes easily is a bootleg material choice.',
        ],
      },
      {
        heading: 'Then the figure',
        bullets: [
          'Eyes: official eye printing is applied by machine and is sharp, symmetrical and consistently placed. Off-centre, oval-when-it-should-be-round, or soft-edged eyes are the most frequent giveaway.',
          'Seams: official vinyl is smoothed at the mould line. A ridge you can feel with a fingernail down the side of the head, or flashing left on the ears or hair, indicates an unfinished recast.',
          'Paint: look at where two colours meet. Official application is clean to the sculpted edge; bootlegs bleed over it.',
          'Underside: official Pops carry moulded or printed copyright and licence text on the bottom of the feet or base. A blank underside is a strong negative signal.',
          'Weight and finish: official vinyl has a slightly matte, dense feel. Bootlegs are often noticeably lighter, hollower-sounding and either too glossy or chalky.',
        ],
      },
      {
        heading: 'The signal most people ignore',
        paras: [
          'Price. A sealed convention exclusive or a Chase offered well below the going market rate is not a bargain that everyone else missed — it is the single most predictive indicator that something is wrong. Bootleggers concentrate on exactly the releases that command a premium, because that is where the margin is, and they price to move volume.',
          'This is also why Chase stickers deserve scepticism. The sticker is printed on paper and is trivially easy to fake compared to the figure, so treat a Chase sticker as a claim to be verified against the release, not as proof in itself.',
        ],
      },
      {
        heading: 'What is NOT a sign of a fake',
        paras: [
          '"Made in China" on the box means nothing. Effectively all official Funko production is Chinese or Vietnamese, as is most Japanese figure production. Judging authenticity by country of manufacture will fail in both directions: it clears bootlegs and condemns genuine pieces.',
          'Minor paint variation between two copies of the same Pop is also normal. These are mass-produced with some hand finishing, and small differences in a blush application or an eyebrow position occur within official production runs.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the single most reliable way to tell a fake Funko Pop?',
        answer:
          'The printing. Compare the small text — the item number, the barcode and the copyright line — against a known real release. Bootleg boxes are reprinted from a scan, so fine text and logo edges degrade in a way the character art does not. On the figure, misaligned or blurred eye printing is the most common single tell.',
      },
      {
        question: 'Does "Made in China" mean a Funko Pop is fake?',
        answer:
          'No. Almost all official Funko production takes place in China or Vietnam, and so does most official Japanese figure production. Country of manufacture carries no information about authenticity. Check the licensor copyright line instead — that is the thing bootlegs get wrong.',
      },
      {
        question: 'Can a Chase sticker be faked?',
        answer:
          'Yes, easily. The sticker is paper and much cheaper to counterfeit than the figure. Treat a Chase or convention sticker as a claim to verify against the specific release rather than as proof, and weigh it alongside the box printing and the price.',
      },
      {
        question: 'Are cheaper Funko Pops more likely to be fake?',
        answer:
          'The opposite, generally. Bootleggers target the releases that carry a premium — convention exclusives, Chases and retired moulds — because that is where the margin is. A standard, currently-produced Pop at a normal price is a low-risk purchase; a rare one at a suspiciously low price is not.',
      },
    ],
    relatedTypes: ['funko-pop'],
    relatedManufacturers: ['funko'],
    relatedGuides: [
      'funko-pop-sticker-guide',
      'should-you-keep-a-funko-in-the-box',
      'made-in-china-official-figures',
      'how-to-spot-a-bootleg-anime-figure',
    ],
  },

  {
    slug: 'how-to-spot-a-bootleg-anime-figure',
    category: 'authenticity',
    title: 'How to Spot a Bootleg Anime Figure',
    h1: 'How to Spot a Bootleg Anime Figure',
    metaDescription:
      'How to identify a recast anime figure: face printing, copyright lines, seam finishing, base quality and the price signal — plus what recast actually means.',
    updated: '2026-09-17',
    answer:
      'The face decides it. Official anime figures have their eyes and eyebrows applied by precision tampo printing, and that process is the hardest and most expensive part of the figure to copy — so blurred, misaligned or flat-looking facial printing is the most reliable indicator of a bootleg. After the face, check for a licensor copyright line on the box: recasts routinely omit it or garble the Japanese text around it.',
    sections: [
      {
        heading: 'Bootleg, recast, knockoff: they are not the same thing',
        paras: [
          'A recast is made from moulds taken from an original figure. Because it is a copy of a copy, it loses a small amount of detail at every stage and shrinks very slightly — which is why a recast beside an original often looks marginally softer and smaller rather than obviously wrong.',
          'A knockoff is an original sculpt made without a licence. These are frequently easier to spot because the sculpt itself is off — proportions, costume details and hair silhouettes are approximations rather than copies.',
          'Both are unlicensed, and both are what people mean by "bootleg". The checks below catch each of them.',
        ],
      },
      {
        heading: 'The figure',
        bullets: [
          'Face printing: sharp, symmetrical, correctly registered eyes with clean lash lines. Softness, doubling or a visible offset between the iris and the outline is decisive.',
          'Skin tone: official figures use blended gradients and a semi-matte finish. Bootleg skin is often flat single-tone and either too glossy or too pale.',
          'Seams: mould lines should be sanded and painted over. An unsanded ridge down an arm or through the hair is an unfinished copy.',
          'Extremities: sword tips, hair spikes and effect parts hold their shape on an original. Warping, softness or parts that will not sit straight indicates cheaper, more flexible PVC.',
          'Base: official bases are sculpted or properly finished, with the peg holes cleanly moulded. A plain black disc with rough edges and visible flashing is a common recast shortcut.',
        ],
      },
      {
        heading: 'The box',
        bullets: [
          'A copyright line naming the licensor — the mangaka, the publisher, the production committee — printed somewhere on the box. Its absence is the strongest single box-level signal.',
          'The manufacturer’s own logo, printed cleanly: Good Smile Company, Banpresto, FuRyu, Kotobukiya, MegaHouse and so on.',
          'A JAN or EAN barcode. Recast boxes often carry a barcode that scans to nothing, or no barcode at all.',
          'Legible Japanese text. Scanned-and-reprinted boxes produce characters with broken strokes, which is obvious even to a reader who does not read Japanese.',
        ],
      },
      {
        heading: 'Use the price as a filter, not an afterthought',
        paras: [
          'Scale figures from the established Japanese manufacturers have a floor set by their production cost. A 1/7 scale figure offered at a small fraction of what every other seller lists it for is not a find. Recasts are produced precisely because the originals are expensive, and they are priced to undercut.',
          'The corollary is more useful: prize figures from Banpresto, Sega, Taito and FuRyu are genuinely inexpensive because they were made for Japanese arcade distribution, not because they are fakes. A ₹900 noodle stopper is a real, licensed FuRyu product. Knowing which tier a figure belongs to is what lets you tell a cheap official figure from a cheap illegal one.',
        ],
      },
      {
        heading: 'What to do before you buy',
        bullets: [
          'Look at the listing photographs of the actual item, not the manufacturer’s promotional renders. Renders are idealised and every figure differs from them.',
          'Zoom in on the face. If no photograph shows the face clearly, ask for one.',
          'Check the box is shown, including the copyright area, for anything sold as boxed.',
          'Confirm what happens if it arrives damaged or wrong, and how long you have to report it.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the most reliable sign of a bootleg anime figure?',
        answer:
          'Facial printing. Eyes and eyebrows are applied by precision tampo printing on official figures, and it is the hardest element to reproduce, so blurred, doubled or misaligned facial features are the clearest indicator. A missing licensor copyright line on the box is the strongest box-level signal.',
      },
      {
        question: 'What is the difference between a recast and a knockoff?',
        answer:
          'A recast is moulded from an original figure, so it looks close but slightly softer and marginally smaller from detail loss in copying. A knockoff is an unlicensed original sculpt, which usually looks visibly off in proportion and costume detail. Both are unlicensed.',
      },
      {
        question: 'Is a cheap anime figure always a bootleg?',
        answer:
          'No, and this is the most common mistake. Prize figures from Banpresto, Sega, Taito and FuRyu are officially licensed and genuinely inexpensive because they were produced for Japanese arcade crane games rather than for retail. What should raise suspicion is a large SCALE figure from a retail manufacturer priced like a prize figure.',
      },
      {
        question: 'Can I tell from the photographs in a listing?',
        answer:
          'Usually, if the photographs are of the actual item rather than promotional renders. Look for a clear, zoomable shot of the face and, for boxed items, of the copyright area of the box. If neither is shown, ask before ordering.',
      },
    ],
    relatedTypes: ['collectible-statues', 'action-figures', 'noodle-stopper-figures'],
    relatedManufacturers: ['banpresto', 'good-smile-company', 'furyu'],
    relatedGuides: [
      'how-to-spot-a-fake-funko-pop',
      'prize-figure-vs-scale-figure',
      'made-in-china-official-figures',
      'where-to-buy-authentic-anime-figures-in-india',
    ],
  },

  {
    slug: 'funko-pop-sticker-guide',
    category: 'authenticity',
    title: 'Funko Pop Sticker Guide — Which Ones Actually Matter',
    h1: 'Funko Pop Stickers: Which Ones Actually Matter',
    metaDescription:
      'What every sticker on a Funko Pop box means — Chase, convention exclusives, retailer exclusives, Special Edition — and which ones affect value.',
    updated: '2026-09-17',
    answer:
      'Funko box stickers fall into three tiers of importance: Chase and convention exclusives genuinely affect value, retailer exclusives affect it modestly, and a generic "Special Edition" sticker affects it least because it is applied very broadly. Because stickers live on the box and not the figure, a Pop removed from its box loses that value entirely.',
    sections: [
      {
        heading: 'The stickers that matter most',
        table: {
          head: ['Sticker', 'What it means'],
          rows: [
            {
              label: 'Chase',
              value:
                'A variant inserted at a low ratio into the standard production run — a different paint, a glow finish or a pose change. Carries a distinct foil sticker. The most consistently value-bearing sticker.',
            },
            {
              label: 'Convention exclusive',
              value:
                'Released at a specific event — San Diego Comic-Con, New York Comic Con, Emerald City, WonderCon. Production is limited to that release, which is why these hold a premium.',
            },
            {
              label: 'Shared convention exclusive',
              value:
                'A convention release also sold through a named retail partner. Larger run than a true convention exclusive, so a smaller premium.',
            },
            {
              label: 'Retailer exclusive',
              value:
                'Tied to one chain — Hot Topic, Target, GameStop, BoxLunch and similar. Affects value modestly, and mostly for the more sought-after characters.',
            },
            {
              label: 'Funko Shop / Funko exclusive',
              value:
                'Sold directly by Funko, often in a limited window. Comparable to a retailer exclusive.',
            },
            {
              label: 'Special Edition',
              value:
                'The broadest and least informative sticker. Applied across a wide range of releases, so on its own it says little about scarcity.',
            },
          ],
        },
      },
      {
        heading: 'Vaulted is not a sticker',
        paras: [
          'A "vaulted" Pop is one whose mould Funko has retired, so no more will be produced. That status is not printed on the box — there is no vaulted sticker — and it is a property of the release rather than of your particular copy. Vaulting tends to matter more to long-term value than most stickers do, precisely because supply stops.',
        ],
      },
      {
        heading: 'Treat stickers as claims, not proof',
        paras: [
          'A sticker is paper. It is by far the cheapest part of a Pop to counterfeit, and fake Chase and convention stickers are common — often applied to a genuine standard Pop, which makes the figure itself pass inspection.',
          'So check that the sticker is consistent with a release that actually exists: the right event, the right year, the right character, the right sticker design for that year. Then check the print quality of the sticker itself against the box printing around it. A sticker that is sharper or blurrier than everything else on the box was added later.',
        ],
      },
      {
        heading: 'Why this matters when you buy online',
        paras: [
          'Because stickers are box features, they only exist in a listing if the listing photographs the box. Any Pop being sold at a premium on the strength of a sticker should show that sticker in a clear photograph of the actual item, close enough to read. On Yukizi every listing shows photographs of the piece being sold, so the sticker — where there is one — is visible before you order rather than after.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Which Funko sticker is worth the most?',
        answer:
          'Chase and true convention exclusives, generally. Both have genuinely limited production: a Chase is inserted at a low ratio into a normal run, and a convention exclusive exists only in the quantity made for that event. Retailer exclusives and "Special Edition" stickers carry much less weight.',
      },
      {
        question: 'Does a Special Edition sticker make a Funko Pop rare?',
        answer:
          'Not on its own. Special Edition is the most broadly applied sticker in the range, so it indicates a release channel rather than scarcity. Judge the specific release rather than the sticker.',
      },
      {
        question: 'What does vaulted mean?',
        answer:
          'That Funko has retired the mould and will not produce that Pop again. It is not marked on the box and applies to the whole release, not to individual copies. Because supply stops entirely, vaulting often affects long-term value more than most stickers.',
      },
      {
        question: 'Do stickers matter if I take the Pop out of the box?',
        answer:
          'No. The sticker is on the box, so a loose Pop carries none of that value. If sticker value matters to you, the box has to stay with the figure and stay in good condition.',
      },
    ],
    relatedTypes: ['funko-pop'],
    relatedManufacturers: ['funko'],
    relatedGuides: [
      'should-you-keep-a-funko-in-the-box',
      'how-to-spot-a-fake-funko-pop',
      'funko-pop-vs-nendoroid',
    ],
  },

  {
    slug: 'made-in-china-official-figures',
    category: 'authenticity',
    title: 'Does "Made in China" Mean an Anime Figure Is Fake?',
    h1: 'Does "Made in China" Mean a Figure Is Fake?',
    metaDescription:
      'No — almost all official anime figures and Funko Pops are manufactured in China or Vietnam. Here is what actually distinguishes a licensed figure from a recast.',
    updated: '2026-09-17',
    answer:
      'No. "Made in China" on an anime figure or a Funko Pop says nothing about whether it is official, because effectively all licensed figure production — Japanese and Western manufacturers alike — takes place in Chinese or Vietnamese factories. The marking that actually matters is the licensor copyright line, which recasts routinely omit or garble.',
    sections: [
      {
        heading: 'Where official figures are actually made',
        paras: [
          'Japanese manufacturers design and sculpt in Japan and manufacture abroad. Good Smile Company, Bandai Spirits, Banpresto, FuRyu, Kotobukiya and MegaHouse all use overseas production, predominantly in China and increasingly in Vietnam. Funko, an American company, does the same.',
          'This is not a secret or a corner being cut — it is simply how painted PVC figures at these price points are produced. A 1/7 scale figure involves a large amount of hand-finishing and hand-painting, and that labour determines where the factory is.',
          'Which means the country-of-origin line on the box is a manufacturing fact with no authenticity content whatsoever. Using it as a test fails in both directions: it clears recasts, which are also made in China, and it condemns genuine pieces.',
        ],
      },
      {
        heading: 'What to check instead',
        bullets: [
          'The licensor copyright line — naming the mangaka, publisher or production committee. Recasts omit or corrupt it far more often than they get it right.',
          'The manufacturer’s logo, printed cleanly and in the right place for that line.',
          'Facial printing on the figure itself: sharp, symmetrical, correctly registered.',
          'Seam finishing and paint edges.',
          'A scannable JAN or EAN barcode.',
        ],
      },
      {
        heading: 'A related misconception worth clearing up',
        paras: [
          'Figures sold outside Japan are sometimes described as "Asia exclusive" or carry packaging with additional English or Chinese text. That is a distribution arrangement, not a quality tier — manufacturers licence regional distributors and the packaging reflects the market. An Asia-release figure from a named manufacturer is the same product from the same tooling.',
          'What is genuinely worth knowing is the difference between a prize figure and a retail scale figure, because that determines price and finish far more than anything on the country-of-origin line does.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are official anime figures made in Japan?',
        answer:
          'Sculpted and designed in Japan, manufactured almost entirely elsewhere — mostly China, increasingly Vietnam. Good Smile Company, Bandai Spirits, Banpresto, FuRyu, Kotobukiya and MegaHouse all produce overseas, as does Funko. "Made in China" is therefore normal on a genuine figure.',
      },
      {
        question: 'So what marking proves a figure is licensed?',
        answer:
          'The copyright line naming the licensor — the manga author, the publisher or the production committee — together with a cleanly printed manufacturer logo and a scannable barcode. Recasts get the copyright line wrong or leave it off much more often than they reproduce it correctly.',
      },
      {
        question: 'Is an "Asia exclusive" figure lower quality?',
        answer:
          'No. That describes a regional distribution arrangement and the packaging that comes with it, not a different production standard. The figure comes from the same tooling as the Japanese release.',
      },
    ],
    relatedGuides: [
      'how-to-spot-a-bootleg-anime-figure',
      'how-to-spot-a-fake-funko-pop',
      'prize-figure-vs-scale-figure',
      'why-anime-figures-cost-more-in-india',
    ],
  },

  {
    slug: 'should-you-keep-a-funko-in-the-box',
    category: 'authenticity',
    title: 'Should You Keep a Funko Pop in the Box?',
    h1: 'Should You Keep a Funko Pop in the Box?',
    metaDescription:
      'Boxed holds resale value and stickers; loose displays better and never yellows. How to decide, and how to protect a box if you keep it.',
    updated: '2026-09-17',
    answer:
      'Keep it boxed if resale value matters to you, because box condition and the stickers printed on it are a large part of what a Pop is worth, and a loose figure forfeits both. Take it out if display matters more — loose Pops read better on a shelf, cannot have their window yellow, and take up roughly half the depth.',
    sections: [
      {
        heading: 'The case for keeping it boxed',
        bullets: [
          'Stickers live on the box. Chase, convention and retailer stickers are the main value-bearing markings on a Pop, and they leave with the box.',
          'Condition is graded on the box. Sharp corners, an uncreased window frame and an unscratched window are what separate a premium copy from an average one.',
          'The box is the best packing you will ever have for that figure, which matters if you move house or resell.',
        ],
      },
      {
        heading: 'The case for taking it out',
        bullets: [
          'Loose Pops display considerably better — no reflective window, no glare, no printed cardboard competing with the figure.',
          'Shelf depth. A boxed Pop needs roughly twice the depth of a loose one, which is the binding constraint on most display cabinets.',
          'The window is the first thing to yellow. Loose, there is nothing to yellow; boxed and in daylight, the acetate goes before the vinyl does.',
          'It is your figure. Collecting boxed is a resale strategy, not a rule.',
        ],
      },
      {
        heading: 'If you keep the box, protect it properly',
        paras: [
          'Hard plastic box protectors are inexpensive and do most of the work. The two things to check are thickness and material: around 0.35 mm is adequate for a shelf, 0.5 mm is better if boxes are handled or stacked, and the protector should be acid-free PET rather than PVC — PVC can off-gas and haze the window it is meant to be protecting.',
          'Beyond that, keep boxes out of direct sunlight, off the floor, and away from sustained heat. In an Indian summer, a shelf against a sun-facing window will yellow a window in a single season.',
        ],
      },
      {
        heading: 'A middle path most collectors end up on',
        paras: [
          'Keep the box, display the figure. Flatten and store the boxes for anything you own more than one of or paid a premium for, and display those Pops loose. You keep most of the resale option — a flattened box in good condition can be reassembled — while getting the display you actually wanted.',
          'The exception is a stickered or vaulted Pop you bought as an investment. Those are worth leaving sealed and protected, because opening one is the single largest reduction in value you can perform on it in one action.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does taking a Funko Pop out of the box reduce its value?',
        answer:
          'Yes, usually substantially. Box condition and the stickers on the box are a large part of a Pop’s market value, and a loose figure carries neither. For a standard, currently produced Pop the loss is small; for a stickered, vaulted or convention release it is significant.',
      },
      {
        question: 'What thickness of Funko box protector should I use?',
        answer:
          'Around 0.35 mm is fine for a figure that sits on a shelf undisturbed; 0.5 mm is better if boxes get handled or stacked. Choose acid-free PET rather than PVC — PVC protectors can off-gas over time and haze the window they are protecting.',
      },
      {
        question: 'Do Funko Pop boxes yellow?',
        answer:
          'The clear window does, and it goes before the vinyl figure does. UV exposure is the main cause, with heat accelerating it. Keeping boxes out of direct sunlight is the single most effective preventative measure.',
      },
      {
        question: 'Can I flatten Funko boxes and keep them?',
        answer:
          'Yes, and many collectors do exactly that — display the figure loose, store the flattened box. Keep them flat, dry, off the floor and out of humidity, and they can be reassembled later, which preserves most of the resale option.',
      },
    ],
    relatedTypes: ['funko-pop'],
    relatedGuides: [
      'funko-pop-sticker-guide',
      'how-to-stop-figures-yellowing',
      'how-to-store-figure-boxes',
      'how-to-display-anime-figures',
    ],
  },
];
