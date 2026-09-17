import type { GuideDef } from './types';

/**
 * India-specific guides.
 *
 * The least contested cluster on the site. Almost every well-written article
 * about collecting figures is written for a US or EU reader, which leaves the
 * India-specific questions — duty, why domestic prices look the way they do,
 * how a resin statue survives an Indian courier network — answered badly or
 * not at all.
 *
 * ⚠️ One standing rule for this file: customs rates, exemptions and quality
 * control orders CHANGE, and a page that states a rate as a present fact goes
 * quietly wrong the moment a budget passes. So the duty guide below explains
 * the MECHANISM, names the specific measures with the year they were
 * introduced, and sends the reader to CBIC for the current number rather than
 * freezing one into the page. Do not "helpfully" replace that with a single
 * percentage — a wrong duty figure is a claim a reader acts on with money.
 */
export const INDIA_GUIDES: GuideDef[] = [
  {
    slug: 'customs-duty-anime-figures-india',
    category: 'india',
    title: 'Customs Duty on Anime Figures Imported into India',
    h1: 'Customs Duty on Anime Figures in India',
    metaDescription:
      'How import duty on figures and collectibles is calculated in India — BCD, social welfare surcharge and IGST — plus the BIS toy rules and why the gift route is closed.',
    updated: '2026-09-17',
    answer:
      'Anime figures imported into India are generally classified as toys under Customs chapter 9503 and attract basic customs duty, a social welfare surcharge calculated on that duty, and IGST on the duty-inclusive value — assessed on the CIF value, meaning the item plus freight plus insurance, not the item alone. India raised basic customs duty on toys sharply in the 2020 Union Budget and has required BIS certification for toys since the Toys (Quality Control) Order took effect in January 2021, so rates and compliance requirements should be verified against the current CBIC tariff before you import.',
    sections: [
      {
        heading: 'How the charge is actually built up',
        paras: [
          'The common mistake is to assume duty is a percentage of what you paid for the figure. It is not. Duty is assessed on the assessable value, which is the cost of the item plus international freight plus insurance — the CIF value. Because figures are bulky and light, freight is often a large fraction of that, so the duty base can be considerably higher than the sticker price.',
        ],
        table: {
          caption: 'The components, in the order they are applied',
          head: ['Component', 'What it applies to'],
          rows: [
            {
              label: 'Assessable value (CIF)',
              value: 'Item cost + international freight + insurance.',
            },
            {
              label: 'Basic Customs Duty (BCD)',
              value:
                'A percentage of the assessable value. Toys under chapter 9503 were moved to a substantially higher rate in the February 2020 Union Budget.',
            },
            {
              label: 'Social Welfare Surcharge',
              value:
                'Calculated on the BCD amount, not on the goods value — so it scales with the duty rather than with the price.',
            },
            {
              label: 'IGST',
              value:
                'Applied to the assessable value plus the duties above, which is why the effective landed cost compounds.',
            },
            {
              label: 'Courier / customs handling',
              value:
                'Charged by the carrier for clearance, separately from anything the government levies.',
            },
          ],
        },
      },
      {
        heading: 'The gift exemption route is effectively closed',
        paras: [
          'A widely repeated piece of advice is to have an overseas seller mark a parcel as a gift under ₹5,000 to avoid duty. That has not been a reliable route for years: CBIC restricted imports of gifts through post and courier in December 2019, leaving only narrow categories such as life-saving medicines and rakhi. A figure declared as a gift is not exempt, and an under-declared parcel risks seizure and penalty rather than a saving.',
          'The related consequence is that a low declared value does not reduce duty in the way people expect either — customs can and does reassess value where a declaration looks inconsistent with the goods.',
        ],
      },
      {
        heading: 'BIS certification, which catches people out',
        paras: [
          'The Toys (Quality Control) Order came into force on 1 January 2021 and requires toys sold in India to carry BIS certification. It is aimed at commercial imports rather than an individual buying a single figure, but it is why the domestic supply of imported collectibles is narrower and more expensive than the Japanese or US catalogue: a distributor bringing in a line has a compliance cost per line, and that cost is only worth carrying on titles that will sell in volume.',
          'This is the single biggest reason a figure available in Japan is simply not available in India at any price, rather than being available at a markup.',
        ],
      },
      {
        heading: 'Importing yourself versus buying domestically',
        paras: [
          'Once you add duty, surcharge, IGST, international freight on a bulky parcel and the carrier’s clearance fee, self-importing a single figure frequently lands close to or above the domestic price — and you take on the clearance process, the exchange-rate spread, and the risk that a damaged parcel becomes an international dispute rather than a return.',
          'Buying domestically moves all of that upstream. On Yukizi the listed price is the landed price, shipping is shown before checkout, and a damaged or incorrect delivery is reported within 3 days with photographs rather than argued with a foreign seller.',
          'Self-importing does still make sense for something genuinely unavailable in India — which, given the BIS point above, is a real category.',
        ],
      },
      {
        heading: 'Verify before you rely on this',
        paras: [
          'Tariff rates, surcharges and exemption notifications change with each Union Budget and with individual notifications in between. The authoritative source is the Central Board of Indirect Taxes and Customs (CBIC) tariff and its notifications; your carrier will also quote the assessed charge before clearance. Treat the structure above as durable and the specific percentages as something to look up on the day.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much customs duty do I pay on an anime figure in India?',
        answer:
          'It depends on the current tariff for chapter 9503, and it is charged on the CIF value rather than the item price. The build-up is basic customs duty on the assessable value, a social welfare surcharge on that duty, then IGST on the duty-inclusive total, plus the carrier’s clearance fee. India raised the toy duty rate substantially in the 2020 Union Budget, so check the current CBIC tariff rather than relying on an older figure.',
      },
      {
        question: 'Can I avoid duty by asking the seller to mark it as a gift?',
        answer:
          'No. CBIC restricted gift imports through post and courier in December 2019 to a few narrow categories, so a figure marked as a gift is not exempt. Under-declaring the value risks seizure and penalty, and customs can reassess a declaration that does not match the goods.',
      },
      {
        question: 'Why are some figures simply not available in India at all?',
        answer:
          'Largely the Toys (Quality Control) Order, in force since January 2021, which requires BIS certification for toys sold in India. That creates a per-line compliance cost for a distributor, so only titles expected to sell in volume are worth bringing in. Niche releases end up unavailable rather than merely expensive.',
      },
      {
        question: 'Is it cheaper to import a figure myself or buy it in India?',
        answer:
          'For anything sold domestically, usually buying in India — duty, surcharge, IGST, bulky-parcel freight and the clearance fee together often meet or exceed the domestic price, and you also take on clearance and cross-border returns. Self-importing makes sense mainly for pieces no Indian seller carries.',
      },
    ],
    relatedGuides: [
      'why-anime-figures-cost-more-in-india',
      'where-to-buy-authentic-anime-figures-in-india',
      'shipping-large-statues-in-india',
    ],
  },

  {
    slug: 'why-anime-figures-cost-more-in-india',
    category: 'india',
    title: 'Why Anime Figures Cost More in India Than in Japan',
    h1: 'Why Anime Figures Cost More in India',
    metaDescription:
      'Import duty, IGST, volumetric freight, BIS compliance, small order volumes and multi-step distribution — the six reasons an Indian price differs from a Japanese one.',
    updated: '2026-09-17',
    answer:
      'An anime figure costs more in India than in Japan for six compounding reasons: high customs duty on toys, IGST on the duty-inclusive value, freight charged on volume rather than weight, BIS compliance cost per product line, order quantities too small to earn distributor volume pricing, and a distribution chain that usually runs through a third country because most Japanese manufacturers have no direct Indian channel.',
    sections: [
      {
        heading: 'The six components',
        table: {
          head: ['Cause', 'Effect on the Indian price'],
          rows: [
            {
              label: 'Customs duty on toys',
              value:
                'Figures are generally classified under chapter 9503, whose basic customs duty was raised sharply in the 2020 Union Budget. Applied to CIF value, not item price.',
            },
            {
              label: 'IGST on import',
              value:
                'Levied on the assessable value plus duties, so it compounds on top of the duty rather than sitting alongside it.',
            },
            {
              label: 'Volumetric freight',
              value:
                'Figures are light and bulky. Air freight bills the greater of actual and volumetric weight, so a large statue is charged as if it were far heavier than it is.',
            },
            {
              label: 'BIS compliance',
              value:
                'The Toys (Quality Control) Order has required BIS certification since January 2021. That is a fixed cost per line, spread across however many units a distributor expects to sell.',
            },
            {
              label: 'Order volume',
              value:
                'India is a small market for this category. Smaller orders mean worse per-unit pricing from the manufacturer or distributor than a US or European buyer gets.',
            },
            {
              label: 'Distribution hops',
              value:
                'Most Japanese manufacturers have no direct Indian distribution. Stock typically arrives via a regional distributor, and each additional hop adds a margin.',
            },
          ],
        },
      },
      {
        heading: 'Why the Japanese retail price is a misleading comparison',
        paras: [
          'A price seen on a Japanese storefront is pre-export: no duty, no IGST, no international freight, and frequently no domestic-to-international handling. It is the price for someone standing in the shop. Comparing it to an Indian landed price compares two different things.',
          'The fair comparison is against what the same figure would cost you to import yourself, all in. Do that arithmetic once — item, freight on volumetric weight, duty on CIF, surcharge, IGST, clearance fee, currency spread — and the domestic premium usually looks a lot smaller than it did.',
        ],
      },
      {
        heading: 'Where the cost genuinely can come down',
        bullets: [
          'Prize figures. Banpresto, Sega, Taito and FuRyu lines are inexpensive at source, so the multiplier applies to a smaller base. This is the tier where Indian pricing is most competitive.',
          'Volume titles. Long-running franchises — One Piece, Dragon Ball, Naruto, Demon Slayer — spread the BIS and distribution cost across more units.',
          'Domestic sellers holding stock. A figure already in India has had its freight and duty paid once, at wholesale volume, rather than per-parcel.',
        ],
      },
      {
        heading: 'What this means practically',
        paras: [
          'Expect the entry tier to be genuinely affordable and the high end to carry a real premium, because duty and volumetric freight both scale with the piece. If budget is the constraint, the format matters more than the character — a prize figure or a Funko of your favourite character will always land closer to the Japanese price than a 1/4 scale statue of them will.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is the same figure cheaper on a Japanese website?',
        answer:
          'Because that price is pre-export. It excludes Indian customs duty, IGST, international freight billed on volumetric weight, clearance fees and the currency spread. Add those and the gap narrows considerably — often to less than the domestic premium appears to be.',
      },
      {
        question: 'Which figures are best value in India?',
        answer:
          'Prize figures from Banpresto, Sega, Taito and FuRyu, and Funko Pops. They start cheap at source, so duty and freight multiply a smaller base. Large scale statues carry the biggest premium because both duty and volumetric freight scale with size.',
      },
      {
        question: 'Will Indian figure prices come down?',
        answer:
          'The structural costs — duty, IGST, freight on volume — are set by policy and physics rather than by retailers. What does move prices is volume: as more units of a title sell in India, fixed costs like BIS certification and distribution spread further. Popular long-running franchises already price better than niche ones for exactly that reason.',
      },
    ],
    relatedTypes: ['funko-pop', 'noodle-stopper-figures', 'collectible-statues'],
    relatedPriceBands: ['under-1000', '1000-to-2500'],
    relatedGuides: [
      'customs-duty-anime-figures-india',
      'anime-figure-prices-in-india',
      'prize-figure-vs-scale-figure',
    ],
  },

  {
    slug: 'where-to-buy-authentic-anime-figures-in-india',
    category: 'india',
    title: 'Where to Buy Authentic Anime Figures in India',
    h1: 'Where to Buy Authentic Anime Figures in India',
    metaDescription:
      'The five channels for buying figures in India — marketplaces, specialist retailers, conventions, social sellers and direct import — with the real trade-off of each.',
    updated: '2026-09-17',
    answer:
      'There are five realistic channels for buying anime figures in India: online marketplaces, specialist collectibles retailers, convention floors such as Comic Con India, individual sellers on social platforms, and importing directly yourself. They differ mainly in recourse — what happens when a figure arrives damaged, wrong or not as described — and that, rather than price, is what should decide between them.',
    sections: [
      {
        heading: 'The five channels',
        table: {
          head: ['Channel', 'Trade-off'],
          rows: [
            {
              label: 'Online marketplaces',
              value:
                'Widest selection and a defined returns process. Quality depends on how the platform vets its sellers, so check whether verification is actually required before listing.',
            },
            {
              label: 'Specialist retailers',
              value:
                'Curated range and staff who know the category. Narrower catalogue and usually higher prices than a marketplace.',
            },
            {
              label: 'Conventions',
              value:
                'Comic Con India runs editions in Delhi, Mumbai, Bengaluru and Hyderabad. You can inspect the figure in your hands, which is the best authentication available. Limited to the event date and what vendors brought.',
            },
            {
              label: 'Social sellers',
              value:
                'Instagram and WhatsApp sellers can source rarities nobody else carries. Recourse is whatever the seller chooses to offer, which in practice is often nothing.',
            },
            {
              label: 'Direct import',
              value:
                'Access to the full Japanese catalogue. You handle duty, clearance, volumetric freight and cross-border disputes — see the duty guide before assuming it is cheaper.',
            },
          ],
        },
      },
      {
        heading: 'What to check, whichever channel you use',
        bullets: [
          'Photographs of the actual item, not the manufacturer’s promotional renders. Renders are idealised and every figure differs from them.',
          'A clear, zoomable shot of the face. Facial printing is the most reliable authenticity signal there is.',
          'The box, including the copyright area, for anything sold as boxed.',
          'A stated returns window for damage, and what evidence it requires.',
          'A GST invoice. Its absence tells you something about the supply chain the figure came through.',
        ],
      },
      {
        heading: 'The question that separates the channels',
        paras: [
          'Ask what happens if it arrives broken. A resin statue crossing India through several courier handoffs will occasionally arrive with a snapped sword tip, and how that is handled is the entire difference between the channels.',
          'A platform with a written policy resolves it as a process. A social seller resolves it as a negotiation. An overseas seller resolves it as an international dispute, on their terms and in their jurisdiction.',
          'For the record on our own terms: Yukizi verifies every seller before they can list, every listing shows photographs of the actual item and its packaging, and damaged or incorrect deliveries are covered when reported within 3 days of delivery with photographs. Change-of-mind returns are not accepted — which is worth knowing before ordering a large statue rather than after, and is why the listing states the height.',
        ],
      },
      {
        heading: 'Where the grey market is genuinely useful',
        paras: [
          'Not everything worth owning is available through a compliant Indian channel, mostly because of the per-line BIS certification cost — niche releases are unavailable rather than merely expensive. Social sellers and direct import are how those pieces reach India, and for a genuinely unobtainable figure that is a reasonable trade.',
          'Make it a deliberate choice rather than a default. Pay by a method with some recourse, insist on photographs of the actual piece including the face and box, and treat a price far below everyone else’s as the warning it is.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the safest way to buy anime figures in India?',
        answer:
          'In descending order of recourse: a convention floor where you inspect the figure yourself, a platform that verifies sellers and has a written damage policy, a specialist retailer, then social sellers, then direct import. Price ordering is roughly the reverse, which is the trade-off.',
      },
      {
        question: 'Are Instagram anime figure sellers legitimate?',
        answer:
          'Some are, and they often source pieces no compliant Indian channel carries. The issue is recourse: you have whatever the seller chooses to offer. Insist on photographs of the actual item including the face and the box’s copyright area, use a payment method with some protection, and be sceptical of prices well below the market.',
      },
      {
        question: 'Does Comic Con India sell figures?',
        answer:
          'Yes — vendors sell on the floor at its Delhi, Mumbai, Bengaluru and Hyderabad editions. It is the only channel where you can inspect a figure in your hands before paying, which is the strongest authentication available to a buyer.',
      },
      {
        question: 'Should I expect a GST invoice?',
        answer:
          'Yes, from any compliant seller. Its absence does not prove a figure is fake, but it tells you the supply chain is informal, and informal chains are where recasts enter. Every order on Yukizi is invoiced.',
      },
    ],
    relatedGuides: [
      'how-to-spot-a-bootleg-anime-figure',
      'customs-duty-anime-figures-india',
      'shipping-large-statues-in-india',
    ],
  },

  {
    slug: 'shipping-large-statues-in-india',
    category: 'india',
    title: 'Shipping Large Anime Statues in India: What Breaks and Why',
    h1: 'Shipping Large Statues in India',
    metaDescription:
      'What actually breaks on a large figure in transit, how it should be packed, and exactly what to photograph on delivery so a damage claim succeeds.',
    updated: '2026-09-17',
    answer:
      'On a large figure the parts that break in transit are almost always the thin ones — sword tips, hair spikes, translucent effect parts and the peg joining the figure to its base — and they break because the figure box was used as the shipping box. Photograph the outer carton before you open it and unbox on camera: the claim you will need to make later depends on evidence you can only capture in the first five minutes.',
    sections: [
      {
        heading: 'What breaks, in order of frequency',
        bullets: [
          'Thin extremities: sword and spear tips, hair spikes, capes and coat tails moulded thin to look dynamic.',
          'Translucent effect parts. The clear PVC used for flame, aura and water effects is more brittle than the opaque body plastic.',
          'The base peg. A heavy figure on a single peg becomes a lever every time the carton is dropped on a corner.',
          'Paint contact marks, where a figure shifts inside its tray and rubs against cardboard for two thousand kilometres.',
          'Box crush, which is damage in itself if you are keeping the box.',
        ],
      },
      {
        heading: 'How it should be packed',
        paras: [
          'The single most important rule: the figure box is not the shipping box. Manufacturer packaging is designed to protect a figure from a shelf and a shop, not from a courier network with several manual handoffs. It needs to sit inside an outer carton with void fill on every face.',
        ],
        bullets: [
          'Double-boxed, with roughly 5 cm of void fill on all six sides — air pillows, foam or crumpled kraft, not loose chips that migrate.',
          'The inner figure box taped shut so the tray cannot slide out inside the outer carton.',
          'Fragile and orientation labels on the outer carton. They are not guarantees, but they change handling more often than not.',
          'No loose accessories rattling inside the tray. Detached parts in transit become scratches on the figure.',
        ],
      },
      {
        heading: 'What to do the moment it arrives',
        paras: [
          'Damage claims succeed or fail on evidence captured before you have touched anything, so do this in order:',
        ],
        bullets: [
          'Photograph the outer carton on all sides before opening it, including any crush, puncture or water staining, and including the shipping label.',
          'Record the unboxing as a single unbroken video. A video showing the carton sealed and then the damage inside is far harder to dispute than photographs taken afterwards.',
          'Photograph the inner figure box before opening that too.',
          'Photograph the damage itself, and the packaging next to it.',
          'Do not discard any packaging until the claim is closed.',
        ],
      },
      {
        heading: 'Indian-specific realities worth planning around',
        paras: [
          'Long-haul domestic routes involve multiple hubs and several manual handoffs, and the last leg is frequently a two-wheeler. That is fine for a Funko and hard on a 50 cm resin statue, which is why outer-carton void fill matters more here than the manufacturer’s tray design does.',
          'Monsoon adds water ingress to the risk list. A carton that has been wet and dried loses a lot of its crush strength, so water staining on the outer box is worth photographing even when the figure looks fine.',
          'Heat is the quiet one. A parcel can sit in a metal van in 40 °C, and sustained heat softens PVC — a figure that arrives with a slightly bent sword often was not dropped at all. Leaving it upright in a cool room for a day sometimes lets it relax back; hot water straightening is a real technique but it also risks the paint, so it is a last resort rather than a first move.',
        ],
      },
      {
        heading: 'How the Yukizi policy interacts with this',
        paras: [
          'Damaged or incorrect deliveries are covered when reported within 3 days of delivery with clear photographs of both the piece and the packaging — which is exactly why the photograph list above matters, and why it specifies the packaging and not only the figure. Change-of-mind returns are not accepted, so check the stated height on the listing against your shelf before ordering.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What should I photograph when a figure arrives?',
        answer:
          'The outer carton on all sides including the shipping label, before opening it. Then record the unboxing as one unbroken video, photograph the inner box before opening it, and photograph the damage beside the packaging. Keep all packaging until the claim is resolved.',
      },
      {
        question: 'What breaks most often on a large figure in transit?',
        answer:
          'Thin parts: sword and spear tips, hair spikes, translucent effect pieces, and the peg connecting the figure to its base. Almost always because the manufacturer’s figure box was used as the shipping box instead of being placed inside an outer carton with void fill.',
      },
      {
        question: 'My figure arrived with a bent sword — is it broken?',
        answer:
          'Often not. PVC softens in sustained heat and a parcel can sit in a hot van, so a bent part may be heat deformation rather than damage. Stand the figure upright in a cool room for a day and it may relax back. Hot-water straightening works but risks the paint, so treat it as a last resort.',
      },
      {
        question: 'How long do I have to report damage on Yukizi?',
        answer:
          'Three days from delivery, with clear photographs of the piece and the packaging. That window is why photographing the outer carton before opening it matters — it is the evidence a claim rests on.',
      },
    ],
    relatedTypes: ['collectible-statues', 'diorama-figures', 'prop-replicas'],
    relatedPriceBands: ['5000-to-10000', 'above-10000'],
    relatedGuides: [
      'how-to-pack-figures-when-moving',
      'where-to-buy-authentic-anime-figures-in-india',
      'how-to-display-anime-figures',
    ],
  },

  {
    slug: 'anime-figure-prices-in-india',
    category: 'india',
    title: 'Anime Figure Prices in India — What Each Budget Buys',
    h1: 'Anime Figure Prices in India',
    metaDescription:
      'What each price tier actually buys in India, with a live price table by format and by series generated from the current Yukizi catalogue.',
    updated: '2026-09-17',
    answer:
      'Anime figure prices in India divide cleanly by format rather than by character: small-format prize figures, keychains and single manga volumes sit at the entry end, Funko Pops and standard action figures in the middle, and large-scale resin statues and 1:1 prop replicas at the top. The tables below are generated from the live Yukizi catalogue, so the figures are current rather than remembered.',
    sections: [
      {
        heading: 'Format sets the price, not the character',
        paras: [
          'The most common mistake when budgeting for a first figure is to search by character and sort by price. That produces a confusing spread, because a 10 cm prize figure and a 50 cm resin statue of the same character can be ten times apart — and neither is mispriced.',
          'Decide the format first. It determines the price band, the size, the level of paint and sculpt detail, and whether the piece is articulated. The character then decides which piece within that band you buy.',
        ],
      },
      {
        heading: 'What each tier buys',
        table: {
          head: ['Budget', 'What is realistically available'],
          rows: [
            {
              label: 'Under ₹1,000',
              value:
                'Small-format pieces: noodle stopper and other prize figures, chibi and miniature sculpts, keychains and acrylic charms, single manga volumes.',
            },
            {
              label: '₹1,000 – ₹2,500',
              value:
                'Most of the Funko Pop catalogue, standard articulated action figures, and the smaller end of the collectible statue range.',
            },
            {
              label: '₹2,500 – ₹5,000',
              value:
                'Larger sculpts with themed bases and separate translucent effect parts, and blended rather than flat paint on faces and hair.',
            },
            {
              label: '₹5,000 – ₹10,000',
              value:
                'Display centrepieces: multi-part dioramas, layered effects, textured terrain bases, hand-finished gradients.',
            },
            {
              label: 'Above ₹10,000',
              value:
                'Large-scale statues measured in tens of centimetres, and 1:1 prop replicas intended to be worn or mounted.',
            },
          ],
        },
      },
      {
        heading: 'Why the Indian price is what it is',
        paras: [
          'Customs duty on toys, IGST applied on the duty-inclusive value, freight billed on volume rather than weight, and a per-line BIS compliance cost all sit between a Japanese release price and an Indian shelf price. The duty and freight components both scale with the size of the piece, which is why the premium over a Japanese price is smallest on prize figures and largest on big statues.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much does an anime figure cost in India?',
        answer:
          'It depends almost entirely on the format. Small-format prize figures, miniatures and keychains start under ₹1,000; Funko Pops and standard action figures mostly sit between ₹1,000 and ₹2,500; large-scale resin statues and prop replicas run well above ₹10,000. The live tables on this page show the current range for each format and series on Yukizi.',
      },
      {
        question: 'What is a reasonable budget for a first anime figure?',
        answer:
          '₹1,000 to ₹2,500 buys a well-made, correctly licensed figure of almost any popular character — a Funko Pop or a standard action figure — and is where most collections start. Below that you are buying small-format pieces, which are genuine but small.',
      },
      {
        question: 'Do figure prices on Yukizi change?',
        answer:
          'Yes. Yukizi is a marketplace, so prices are set by individual verified sellers and move with stock and discounts. The tables on this page are regenerated from the live catalogue rather than written by hand, so they reflect what is actually listed now.',
      },
    ],
    dataBlock: 'price-table',
    relatedPriceBands: [
      'under-1000',
      '1000-to-2500',
      '2500-to-5000',
      '5000-to-10000',
      'above-10000',
    ],
    relatedGuides: [
      'why-anime-figures-cost-more-in-india',
      'prize-figure-vs-scale-figure',
      'anime-figure-scales-explained',
    ],
  },
];
