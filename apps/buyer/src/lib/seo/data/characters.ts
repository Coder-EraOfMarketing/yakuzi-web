/**
 * The character axis — the highest-intent facet in collectibles.
 *
 * "nezuko figure" and "buy gojo statue india" are what buyers actually type;
 * nobody searches for a SKU. PharmaBag's equivalent insight was that people
 * search a brand name ("Amlokind") rather than a molecule, so it built a page
 * per brand. This is that axis for a B2C catalogue.
 *
 * Threshold is deliberately ONE product, unlike the series hubs' two. A
 * character page carrying a single figure is still the best possible answer
 * to "nezuko figure price india" — it is specific, complete and correct —
 * whereas a series page with one product genuinely is thin. At zero matches
 * the page noindexes like every other hub here.
 *
 * Every `note` is a publicly verifiable fact about the character in their
 * source work. None of them describe stock, price or availability: those come
 * from the live catalogue at render time.
 *
 * COLLISIONS are the whole reason this file carries explicit `match`
 * overrides. Word-boundary matching handles most of them for free — "gon"
 * does not match inside "dragon", "eren" does not match inside "Frieren" —
 * but several names are real English words or single letters and need help:
 *
 *  - Ace     collides with Batman Beyond's dog ("Bruce Wayne & Ace").
 *  - Light   collides with "LED Night Light".
 *  - L       is a single letter and cannot be matched by name at all.
 *  - Pain    is a common noun; `\bpain\b` at least excludes "painted".
 *
 * Each of those carries a hand-written `match` below. Adding a character
 * whose name is an ordinary English word without doing the same is how this
 * file starts mis-filing products.
 */

export interface CharacterDef {
  slug: string;
  /** Full name, used in the H1 and title. */
  name: string;
  /** The short form buyers actually type. Used in the query-shaped title. */
  short: string;
  /** Slug from `series.ts`. Drives the breadcrumb and the parent link. */
  seriesSlug: string;
  aka?: string[];
  /** One verifiable fact about the character in their source work. */
  note: string;
  /**
   * Full regex source override. When absent, the matcher is built from the
   * name and every `aka`, word-boundary wrapped.
   */
  match?: string;
  /** Product slugs the pattern catches wrongly. */
  exclude?: string[];
}

/** A character hub needs this many live matches before it may index. */
export const MIN_PRODUCTS_CHARACTER = 1;

export const CHARACTERS: CharacterDef[] = [
  // ─── Demon Slayer ────────────────────────────────────────────────
  {
    slug: 'nezuko',
    name: 'Nezuko Kamado',
    short: 'Nezuko',
    seriesSlug: 'demon-slayer',
    note: 'Tanjiro’s younger sister, turned into a demon in the opening chapter yet able to resist devouring humans.',
  },
  {
    slug: 'tanjiro',
    name: 'Tanjiro Kamado',
    short: 'Tanjiro',
    seriesSlug: 'demon-slayer',
    note: 'The protagonist of Demon Slayer, a charcoal seller who joins the Demon Slayer Corps to cure his sister.',
  },
  {
    slug: 'zenitsu',
    name: 'Zenitsu Agatsuma',
    short: 'Zenitsu',
    seriesSlug: 'demon-slayer',
    note: 'A Demon Slayer who mastered only the first form of Thunder Breathing and fights at his strongest asleep.',
  },
  {
    slug: 'inosuke',
    name: 'Inosuke Hashibira',
    short: 'Inosuke',
    seriesSlug: 'demon-slayer',
    note: 'Raised by boars and fighting in a boar-head mask with a pair of chipped nichirin blades.',
  },
  {
    slug: 'rengoku',
    name: 'Kyojuro Rengoku',
    short: 'Rengoku',
    seriesSlug: 'demon-slayer',
    note: 'The Flame Hashira, whose stand against Akaza closes the Mugen Train arc.',
  },
  {
    slug: 'akaza',
    name: 'Akaza',
    short: 'Akaza',
    seriesSlug: 'demon-slayer',
    note: 'Upper Rank Three of the Twelve Kizuki, a martial artist who refuses to consume women.',
  },
  {
    slug: 'kokushibo',
    name: 'Kokushibo',
    short: 'Kokushibo',
    seriesSlug: 'demon-slayer',
    note: 'Upper Rank One of the Twelve Kizuki and the elder twin brother of the first Breathing user.',
  },
  {
    slug: 'giyu-tomioka',
    name: 'Giyu Tomioka',
    short: 'Giyu',
    seriesSlug: 'demon-slayer',
    aka: ['Tomioka'],
    note: 'The Water Hashira, and the slayer who spares Nezuko in the first chapter.',
  },
  {
    slug: 'mitsuri-kanroji',
    name: 'Mitsuri Kanroji',
    short: 'Mitsuri',
    seriesSlug: 'demon-slayer',
    aka: ['Kanroji'],
    note: 'The Love Hashira, whose whip-like nichirin blade suits her uniquely flexible muscle structure.',
  },
  {
    slug: 'tengen-uzui',
    name: 'Tengen Uzui',
    short: 'Tengen',
    seriesSlug: 'demon-slayer',
    aka: ['Uzui'],
    note: 'The Sound Hashira and a former shinobi, central to the Entertainment District arc.',
  },
  {
    slug: 'muzan',
    name: 'Muzan Kibutsuji',
    short: 'Muzan',
    seriesSlug: 'demon-slayer',
    aka: ['Kibutsuji'],
    note: 'The progenitor of all demons and the antagonist of Demon Slayer.',
  },
  {
    slug: 'shinobu-kocho',
    name: 'Shinobu Kocho',
    short: 'Shinobu',
    seriesSlug: 'demon-slayer',
    aka: ['Kocho'],
    note: 'The Insect Hashira, who compensates for being unable to decapitate demons by using wisteria poison.',
  },

  // ─── Naruto ──────────────────────────────────────────────────────
  {
    slug: 'naruto-uzumaki',
    name: 'Naruto Uzumaki',
    short: 'Naruto',
    seriesSlug: 'naruto',
    note: 'The Nine-Tails jinchuriki who becomes Seventh Hokage of the Hidden Leaf.',
    // The series name and the character name are the same word; the series
    // hub and this hub therefore share matches by design.
    match: '\\bnaruto\\b',
  },
  {
    slug: 'sasuke',
    name: 'Sasuke Uchiha',
    short: 'Sasuke',
    seriesSlug: 'naruto',
    note: 'The last loyal survivor of the Uchiha clan and Naruto’s rival.',
  },
  {
    slug: 'kakashi',
    name: 'Kakashi Hatake',
    short: 'Kakashi',
    seriesSlug: 'naruto',
    note: 'The Copy Ninja, Team 7’s instructor and later Sixth Hokage.',
    aka: ['Hatake'],
  },
  {
    slug: 'itachi',
    name: 'Itachi Uchiha',
    short: 'Itachi',
    seriesSlug: 'naruto',
    note: 'Sasuke’s elder brother, who destroyed his own clan under orders from the Leaf’s leadership.',
  },
  {
    slug: 'gaara',
    name: 'Gaara',
    short: 'Gaara',
    seriesSlug: 'naruto',
    note: 'The One-Tail jinchuriki of the Hidden Sand, later its Fifth Kazekage.',
  },
  {
    slug: 'pain',
    name: 'Pain',
    short: 'Pain',
    seriesSlug: 'naruto',
    aka: ['Nagato'],
    // `\bpain\b` will not fire inside "painted" or "hand-painted", which is
    // the collision that matters in a collectibles catalogue.
    match: '\\bpain\\b|\\bnagato\\b|six paths of pain',
    note: 'The public face of the Akatsuki, controlling six reanimated bodies known as the Six Paths of Pain.',
  },
  {
    slug: 'madara',
    name: 'Madara Uchiha',
    short: 'Madara',
    seriesSlug: 'naruto',
    note: 'Co-founder of the Hidden Leaf alongside Hashirama Senju, and later its greatest threat.',
  },
  {
    slug: 'hashirama',
    name: 'Hashirama Senju',
    short: 'Hashirama',
    seriesSlug: 'naruto',
    aka: ['Senju'],
    note: 'The First Hokage, known as the God of Shinobi for his Wood Release.',
  },
  {
    slug: 'zabuza',
    name: 'Zabuza Momochi',
    short: 'Zabuza',
    seriesSlug: 'naruto',
    aka: ['Momochi'],
    note: 'The Demon of the Hidden Mist, wielder of the executioner’s blade Kubikiribocho.',
  },
  {
    slug: 'minato',
    name: 'Minato Namikaze',
    short: 'Minato',
    seriesSlug: 'naruto',
    aka: ['Namikaze'],
    note: 'The Fourth Hokage, called the Yellow Flash for his Flying Thunder God technique.',
  },
  {
    slug: 'obito',
    name: 'Obito Uchiha',
    short: 'Obito',
    seriesSlug: 'naruto',
    note: 'Kakashi’s teammate, presumed dead at Kannabi Bridge and later the masked man behind the Fourth Great Ninja War.',
  },

  // ─── One Piece ───────────────────────────────────────────────────
  {
    slug: 'luffy',
    name: 'Monkey D. Luffy',
    short: 'Luffy',
    seriesSlug: 'one-piece',
    aka: ['Monkey D Luffy', 'Straw Hat Luffy'],
    note: 'Captain of the Straw Hat Pirates, given a rubber body by the Gum-Gum Fruit.',
  },
  {
    slug: 'zoro',
    name: 'Roronoa Zoro',
    short: 'Zoro',
    seriesSlug: 'one-piece',
    aka: ['Roronoa'],
    note: 'The Straw Hats’ swordsman, who fights in a three-sword style and intends to become the world’s strongest.',
  },
  {
    slug: 'sanji',
    name: 'Sanji',
    short: 'Sanji',
    seriesSlug: 'one-piece',
    aka: ['Vinsmoke Sanji'],
    note: 'The Straw Hats’ cook, who fights only with his legs to protect his hands.',
  },
  {
    slug: 'ace',
    name: 'Portgas D. Ace',
    short: 'Ace',
    seriesSlug: 'one-piece',
    aka: ['Portgas D Ace', 'Fire Fist Ace'],
    // "Ace" alone collides with Batman Beyond's dog, which ships as a Funko
    // two-pack in this very catalogue. Anchor on the surname or the epithet,
    // and only accept bare "ace" alongside a One Piece signal.
    match: '\\bportgas\\b|fire fist|\\bace\\b',
    exclude: ['funko-batman-beyond-bruce-wayne-and-ace-unknown'],
    note: 'Luffy’s sworn brother and Second Division commander of the Whitebeard Pirates.',
  },
  {
    slug: 'shanks',
    name: 'Shanks',
    short: 'Shanks',
    seriesSlug: 'one-piece',
    aka: ['Red-Haired Shanks'],
    note: 'One of the Four Emperors, and the pirate who gave Luffy his straw hat.',
  },
  {
    slug: 'nami',
    name: 'Nami',
    short: 'Nami',
    seriesSlug: 'one-piece',
    note: 'The Straw Hats’ navigator and cartographer.',
  },
  {
    slug: 'law',
    name: 'Trafalgar D. Water Law',
    short: 'Trafalgar Law',
    seriesSlug: 'one-piece',
    aka: ['Trafalgar Law'],
    match: '\\btrafalgar\\b',
    note: 'Captain of the Heart Pirates and a surgeon, wielding the Op-Op Fruit.',
  },

  // ─── Dragon Ball ─────────────────────────────────────────────────
  {
    slug: 'goku',
    name: 'Son Goku',
    short: 'Goku',
    seriesSlug: 'dragon-ball',
    aka: ['Son Goku', 'Kakarot'],
    note: 'The Saiyan raised on Earth as Son Goku, whose transformations anchor every arc of the franchise.',
  },
  {
    slug: 'vegeta',
    name: 'Vegeta',
    short: 'Vegeta',
    seriesSlug: 'dragon-ball',
    note: 'Prince of the Saiyans, Goku’s rival and eventual ally.',
  },
  {
    slug: 'gohan',
    name: 'Son Gohan',
    short: 'Gohan',
    seriesSlug: 'dragon-ball',
    note: 'Goku’s elder son, the first to reach Super Saiyan 2 during the Cell Games.',
  },
  {
    slug: 'broly',
    name: 'Broly',
    short: 'Broly',
    seriesSlug: 'dragon-ball',
    note: 'The Legendary Super Saiyan, reintroduced into canon by the 2018 film Dragon Ball Super: Broly.',
  },
  {
    slug: 'shenron',
    name: 'Shenron',
    short: 'Shenron',
    seriesSlug: 'dragon-ball',
    note: 'The dragon summoned when all seven Dragon Balls are gathered.',
  },
  {
    slug: 'frieza',
    name: 'Frieza',
    short: 'Frieza',
    seriesSlug: 'dragon-ball',
    aka: ['Freeza'],
    note: 'The galactic tyrant who destroyed Planet Vegeta, and the antagonist of the Namek arc.',
  },
  {
    slug: 'trunks',
    name: 'Trunks',
    short: 'Trunks',
    seriesSlug: 'dragon-ball',
    note: 'Vegeta’s son, introduced as a sword-carrying warrior from a ruined future.',
  },

  // ─── Jujutsu Kaisen ──────────────────────────────────────────────
  {
    slug: 'gojo',
    name: 'Satoru Gojo',
    short: 'Gojo',
    seriesSlug: 'jujutsu-kaisen',
    aka: ['Satoru Gojo'],
    note: 'The strongest jujutsu sorcerer, holder of the Six Eyes and the Limitless technique.',
  },
  {
    slug: 'sukuna',
    name: 'Ryomen Sukuna',
    short: 'Sukuna',
    seriesSlug: 'jujutsu-kaisen',
    note: 'The King of Curses, sealed across twenty fingers and housed in Yuji Itadori.',
  },
  {
    slug: 'yuji-itadori',
    name: 'Yuji Itadori',
    short: 'Itadori',
    seriesSlug: 'jujutsu-kaisen',
    aka: ['Itadori'],
    note: 'The protagonist of Jujutsu Kaisen, who swallowed one of Sukuna’s fingers to save his friends.',
  },
  {
    slug: 'megumi-fushiguro',
    name: 'Megumi Fushiguro',
    short: 'Megumi',
    seriesSlug: 'jujutsu-kaisen',
    aka: ['Fushiguro'],
    note: 'A first-year at Tokyo Jujutsu High whose Ten Shadows technique summons shikigami.',
  },
  {
    slug: 'nobara-kugisaki',
    name: 'Nobara Kugisaki',
    short: 'Nobara',
    seriesSlug: 'jujutsu-kaisen',
    aka: ['Kugisaki'],
    note: 'A first-year sorcerer who fights with a hammer, nails and straw-doll technique.',
  },

  // ─── Attack on Titan ─────────────────────────────────────────────
  {
    slug: 'levi',
    name: 'Levi Ackerman',
    short: 'Levi',
    seriesSlug: 'attack-on-titan',
    aka: ['Levi Ackerman'],
    note: 'Captain of the Survey Corps’ Special Operations Squad, called humanity’s strongest soldier.',
  },
  {
    slug: 'eren',
    name: 'Eren Yeager',
    short: 'Eren',
    seriesSlug: 'attack-on-titan',
    aka: ['Eren Jaeger', 'Yeager'],
    // `\beren\b` does not fire inside "Frieren" — the boundary check fails on
    // the preceding "i". That collision is the reason boundaries are required.
    note: 'The holder of the Attack Titan and the protagonist of Attack on Titan.',
  },
  {
    slug: 'mikasa',
    name: 'Mikasa Ackerman',
    short: 'Mikasa',
    seriesSlug: 'attack-on-titan',
    note: 'Eren’s adoptive sister and one of the Survey Corps’ most capable soldiers.',
  },

  // ─── Death Note ──────────────────────────────────────────────────
  {
    slug: 'light-yagami',
    name: 'Light Yagami',
    short: 'Light Yagami',
    seriesSlug: 'death-note',
    aka: ['Kira'],
    // Bare "light" collides with "LED Night Light" and similar product copy,
    // so the surname or the alias is required.
    match: 'light yagami|\\byagami\\b|\\bkira\\b',
    note: 'The student who finds the Death Note and begins killing under the alias Kira.',
  },
  {
    slug: 'l-death-note',
    name: 'L (Ryuzaki)',
    short: 'L',
    seriesSlug: 'death-note',
    aka: ['Ryuzaki'],
    // A single letter cannot be matched by name. Anchor on the series phrase
    // or on the alias instead.
    match: 'death note\\s*[-\\u2013\\u2014:]?\\s*l\\b|\\bryuzaki\\b|\\bl \\(on chain\\)',
    note: 'The world’s greatest detective, who pursues Kira anonymously from behind a stylised letter L.',
  },
  {
    slug: 'ryuk',
    name: 'Ryuk',
    short: 'Ryuk',
    seriesSlug: 'death-note',
    note: 'The shinigami who drops the Death Note into the human world out of boredom.',
  },

  // ─── Chainsaw Man ────────────────────────────────────────────────
  {
    slug: 'denji',
    name: 'Denji',
    short: 'Denji',
    seriesSlug: 'chainsaw-man',
    note: 'The devil hunter who merges with his pet devil Pochita to become Chainsaw Man.',
  },
  {
    slug: 'makima',
    name: 'Makima',
    short: 'Makima',
    seriesSlug: 'chainsaw-man',
    note: 'The Public Safety Devil Hunter who recruits Denji, later revealed as the Control Devil.',
  },
  {
    slug: 'power',
    name: 'Power',
    short: 'Power',
    seriesSlug: 'chainsaw-man',
    // "Power" is an ordinary noun — require the Chainsaw Man context.
    match: 'chainsaw ?man\\s*[-\\u2013\\u2014:]?\\s*power\\b|\\bpower devil\\b|blood fiend',
    note: 'The Blood Fiend and one of Denji’s squadmates in Public Safety.',
  },
  {
    slug: 'angel-devil',
    name: 'Angel Devil',
    short: 'Angel Devil',
    seriesSlug: 'chainsaw-man',
    note: 'A devil hunter whose touch drains the lifespan of anyone who makes contact.',
  },

  // ─── Hunter x Hunter ─────────────────────────────────────────────
  {
    slug: 'killua',
    name: 'Killua Zoldyck',
    short: 'Killua',
    seriesSlug: 'hunter-x-hunter',
    aka: ['Zoldyck'],
    note: 'Heir to the Zoldyck family of assassins and Gon’s closest friend.',
  },
  {
    slug: 'gon',
    name: 'Gon Freecss',
    short: 'Gon',
    seriesSlug: 'hunter-x-hunter',
    aka: ['Freecss'],
    // `\bgon\b` does not fire inside "dragon" — the preceding "a" blocks it.
    note: 'The protagonist of Hunter x Hunter, searching for his father Ging.',
  },
  {
    slug: 'hisoka',
    name: 'Hisoka Morow',
    short: 'Hisoka',
    seriesSlug: 'hunter-x-hunter',
    note: 'A Hunter and magician who pursues opponents purely for the quality of the fight.',
  },
  {
    slug: 'kurapika',
    name: 'Kurapika',
    short: 'Kurapika',
    seriesSlug: 'hunter-x-hunter',
    note: 'The last of the Kurta clan, hunting the Phantom Troupe for his people’s stolen eyes.',
  },

  // ─── Bleach ──────────────────────────────────────────────────────
  {
    slug: 'ichigo',
    name: 'Ichigo Kurosaki',
    short: 'Ichigo',
    seriesSlug: 'bleach',
    aka: ['Kurosaki'],
    note: 'The substitute Soul Reaper at the centre of Bleach.',
  },
  {
    slug: 'nelliel',
    name: 'Nelliel Tu Odelschwanck',
    short: 'Nelliel',
    seriesSlug: 'bleach',
    aka: ['Nel', 'Nelliel Tu'],
    match: '\\bnelliel\\b|nelliel tu|\\bneliel\\b',
    note: 'A former Espada of Aizen’s Arrancar army, encountered in Hueco Mundo.',
  },
  {
    slug: 'byakuya',
    name: 'Byakuya Kuchiki',
    short: 'Byakuya',
    seriesSlug: 'bleach',
    aka: ['Kuchiki'],
    note: 'Captain of the Sixth Division and head of the noble Kuchiki family.',
  },

  // ─── Other anime ─────────────────────────────────────────────────
  {
    slug: 'frieren-character',
    name: 'Frieren',
    short: 'Frieren',
    seriesSlug: 'frieren',
    match: '\\bfrieren\\b',
    note: 'The elf mage of the hero’s party, whose lifespan makes the decade-long quest a brief memory.',
  },
  {
    slug: 'guts',
    name: 'Guts',
    short: 'Guts',
    seriesSlug: 'berserk',
    aka: ['Black Swordsman'],
    match: '\\bguts\\b|black swordsman|dragonslayer',
    note: 'The Black Swordsman of Berserk, carrying the oversized Dragonslayer blade.',
  },
  {
    slug: 'griffith',
    name: 'Griffith',
    short: 'Griffith',
    seriesSlug: 'berserk',
    aka: ['Femto'],
    note: 'Leader of the Band of the Hawk, reborn as the fifth member of the God Hand.',
  },
  {
    slug: 'alya',
    name: 'Alisa Mikhailovna Kujou',
    short: 'Alya',
    seriesSlug: 'spy-x-family',
    aka: ['Alya', 'Alisa Mikhailovna'],
    match: '\\balya\\b|alisa mikhailovna|\\bkujou\\b',
    note: 'The Russian-Japanese heroine of Sunsunsun’s light novel series Alya Sometimes Hides Her Feelings in Russian.',
  },
  {
    slug: 'deku',
    name: 'Izuku Midoriya',
    short: 'Deku',
    seriesSlug: 'my-hero-academia',
    aka: ['Deku', 'Midoriya'],
    note: 'The Quirkless boy who inherits One For All from All Might.',
  },
  {
    slug: 'bakugo',
    name: 'Katsuki Bakugo',
    short: 'Bakugo',
    seriesSlug: 'my-hero-academia',
    aka: ['Bakugou'],
    note: 'Deku’s explosive childhood rival at U.A. High.',
  },
  {
    slug: 'saitama',
    name: 'Saitama',
    short: 'Saitama',
    seriesSlug: 'one-punch-man',
    note: 'The hero for fun, whose training routine left him unbeatable and permanently bored.',
  },
  {
    slug: 'kaneki',
    name: 'Ken Kaneki',
    short: 'Kaneki',
    seriesSlug: 'tokyo-ghoul',
    note: 'The student turned one-eyed ghoul after an organ transplant from Rize.',
  },
  {
    slug: 'anya-forger',
    name: 'Anya Forger',
    short: 'Anya',
    seriesSlug: 'spy-x-family',
    aka: ['Anya'],
    note: 'The telepathic child adopted by Loid Forger as cover for Operation Strix.',
  },
  {
    slug: 'sung-jinwoo',
    name: 'Sung Jinwoo',
    short: 'Sung Jinwoo',
    seriesSlug: 'solo-leveling',
    aka: ['Jinwoo'],
    note: 'The E-rank hunter who gains a levelling System and becomes the Shadow Monarch.',
  },

  // ─── Games ───────────────────────────────────────────────────────
  {
    slug: 'ranni',
    name: 'Ranni the Witch',
    short: 'Ranni',
    seriesSlug: 'elden-ring',
    note: 'An Empyrean of the Lands Between whose questline leads to the Age of the Stars ending.',
  },
  {
    slug: 'the-knight',
    name: 'The Knight',
    short: 'Hollow Knight',
    seriesSlug: 'hollow-knight',
    match: 'hollow knight|pure vessel|\\bthe knight\\b',
    note: 'The silent vessel at the centre of Hollow Knight, descending into Hallownest to end the infection.',
  },
  {
    slug: 'dante',
    name: 'Dante',
    short: 'Dante',
    seriesSlug: 'devil-may-cry',
    note: 'The half-demon son of Sparda and the series’ recurring protagonist.',
  },
  {
    slug: 'jett',
    name: 'Jett',
    short: 'Jett',
    seriesSlug: 'valorant',
    match: '\\bjett\\b',
    note: 'A Korean duelist agent in Valorant, built around dashes and updrafts.',
  },
  {
    slug: 'altair',
    name: 'Altaïr Ibn-LaʼAhad',
    short: 'Altaïr',
    seriesSlug: 'assassins-creed',
    aka: ['Altair'],
    match: 'alta\\u00efr|\\baltair\\b',
    note: 'The Levantine Assassin of the first Assassin’s Creed, set during the Third Crusade.',
  },
  {
    slug: 'sephiroth',
    name: 'Sephiroth',
    short: 'Sephiroth',
    seriesSlug: 'final-fantasy',
    note: 'The One-Winged Angel of Final Fantasy VII, wielding the oversized katana Masamune.',
  },
  {
    slug: 'kratos',
    name: 'Kratos',
    short: 'Kratos',
    seriesSlug: 'god-of-war',
    note: 'The Ghost of Sparta, protagonist of the God of War series.',
  },
  {
    slug: 'eevee',
    name: 'Eevee',
    short: 'Eevee',
    seriesSlug: 'pokemon',
    aka: ['Eeveelution', 'Eeveelutions'],
    note: 'The Evolution Pokémon, whose unstable genetic code allows eight different evolved forms.',
  },
  {
    slug: 'pikachu',
    name: 'Pikachu',
    short: 'Pikachu',
    seriesSlug: 'pokemon',
    note: 'The Electric-type mascot of the Pokémon franchise.',
  },

  // ─── Comics, film and TV ─────────────────────────────────────────
  {
    slug: 'iron-man',
    name: 'Iron Man',
    short: 'Iron Man',
    seriesSlug: 'marvel',
    aka: ['Tony Stark', 'Ironman'],
    match: 'iron ?man|tony stark',
    note: 'Tony Stark’s armoured identity, introduced in Tales of Suspense #39 in 1963.',
  },
  {
    slug: 'venom',
    name: 'Venom',
    short: 'Venom',
    seriesSlug: 'marvel',
    note: 'The symbiote antagonist introduced in The Amazing Spider-Man, most often bonded to Eddie Brock.',
  },
  {
    slug: 'captain-america',
    name: 'Captain America',
    short: 'Captain America',
    seriesSlug: 'marvel',
    aka: ['Steve Rogers'],
    note: 'Steve Rogers, created by Joe Simon and Jack Kirby in 1941.',
  },
  {
    slug: 'black-panther',
    name: 'Black Panther',
    short: 'Black Panther',
    seriesSlug: 'marvel',
    aka: ['T’Challa'],
    note: 'T’Challa, king of Wakanda, the first Black superhero in mainstream American comics.',
  },
  {
    slug: 'spider-man',
    name: 'Spider-Man',
    short: 'Spider-Man',
    seriesSlug: 'marvel',
    aka: ['Spiderman', 'Peter Parker'],
    match: 'spider[- ]?man|peter parker',
    note: 'Peter Parker, created by Stan Lee and Steve Ditko in Amazing Fantasy #15.',
  },
  {
    slug: 'thor',
    name: 'Thor',
    short: 'Thor',
    seriesSlug: 'marvel',
    note: 'Marvel’s adaptation of the Norse thunder god, a founding Avenger.',
  },
  {
    slug: 'deadpool',
    name: 'Deadpool',
    short: 'Deadpool',
    seriesSlug: 'marvel',
    aka: ['Wade Wilson'],
    note: 'The Merc with a Mouth, created by Fabian Nicieza and Rob Liefeld.',
  },
  {
    slug: 'batman',
    name: 'Batman',
    short: 'Batman',
    seriesSlug: 'dc-comics',
    aka: ['Bruce Wayne', 'Dark Knight'],
    match: '\\bbatman\\b|bruce wayne|dark knight',
    note: 'Bob Kane and Bill Finger’s Gotham vigilante, first published in Detective Comics #27.',
  },
  {
    slug: 'joker',
    name: 'The Joker',
    short: 'Joker',
    seriesSlug: 'dc-comics',
    match: '\\bjoker\\b',
    note: 'Batman’s longest-running antagonist, introduced in Batman #1 in 1940.',
  },
  {
    slug: 'superman',
    name: 'Superman',
    short: 'Superman',
    seriesSlug: 'dc-comics',
    aka: ['Clark Kent'],
    note: 'Jerry Siegel and Joe Shuster’s Kryptonian, the character that defined the superhero genre.',
  },
  {
    slug: 'ghostface',
    name: 'Ghostface',
    short: 'Ghostface',
    seriesSlug: 'horror-icons',
    aka: ['Ghost Face'],
    match: 'ghost ?face',
    note: 'The masked killer identity of the Scream film series, designed by Fun World.',
  },
  {
    slug: 'godzilla-character',
    name: 'Godzilla',
    short: 'Godzilla',
    seriesSlug: 'godzilla',
    match: '\\bgodzilla\\b|\\bgojira\\b',
    note: 'Toho’s kaiju, first appearing in Ishiro Honda’s 1954 film.',
  },
  {
    slug: 'john-cena',
    name: 'John Cena',
    short: 'John Cena',
    seriesSlug: 'wwe',
    note: 'A sixteen-time world champion in WWE and one of its most produced action-figure likenesses.',
  },
  {
    slug: 'voltron',
    name: 'Voltron',
    short: 'Voltron',
    seriesSlug: 'cartoon-classics',
    note: 'The combining robot of the 1984 series Voltron: Defender of the Universe, adapted from Beast King GoLion.',
  },
  {
    slug: 'johnny-bravo',
    name: 'Johnny Bravo',
    short: 'Johnny Bravo',
    seriesSlug: 'cartoon-classics',
    note: 'Van Partible’s Cartoon Network character, first aired as part of World Premiere Toons in 1995.',
  },
  {
    slug: 'baloo',
    name: 'Baloo',
    short: 'Baloo',
    seriesSlug: 'cartoon-classics',
    note: 'The bear of Rudyard Kipling’s The Jungle Book, best known from Disney’s 1967 adaptation.',
  },
];

function escapeLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The regex source deciding character membership.
 *
 * An explicit `match` wins outright — that is the escape hatch for names that
 * are ordinary words, single letters, or shared with an unrelated product.
 * Otherwise the pattern is built from the name plus every `aka`, each escaped
 * and word-boundary wrapped.
 */
export function characterPattern(def: CharacterDef): string {
  if (def.match) return def.match;
  return [def.name, def.short, ...(def.aka ?? [])]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((n) => `\\b${escapeLiteral(n)}\\b`)
    .join('|');
}

export function characterBySlug(slug: string): CharacterDef | undefined {
  return CHARACTERS.find((c) => c.slug === slug);
}

export function charactersOfSeries(seriesSlug: string): CharacterDef[] {
  return CHARACTERS.filter((c) => c.seriesSlug === seriesSlug);
}
