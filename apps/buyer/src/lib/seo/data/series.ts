/**
 * The series axis — anime, manga, game and comic franchises.
 *
 * This is Yukizi's equivalent of PharmaBag's `/generics/[molecule]` axis: the
 * page for the *thing the product is about*, rather than for the product. It
 * is the highest-volume commercial axis in this market, because almost nobody
 * searches "collectible statue" — they search "demon slayer figure".
 *
 * Scope decision, recorded so it is not quietly widened later:
 * series pages are crossed with PRODUCT TYPE and with nothing else. Series x
 * character x type x city would be tens of thousands of pages differing by one
 * noun, which is scaled content abuse under Google's spam policy and risks the
 * whole domain rather than just the thin pages. Series x type keeps real
 * commercial intent ("demon slayer action figures") on pages that can carry
 * genuinely distinct content: a different product set, a different price band,
 * and a different set of characters in stock.
 *
 * Every `note` below is a publicly verifiable fact about the work (author,
 * studio, publisher, medium). Nothing here describes Yukizi's stock — that is
 * derived at render time from the live catalogue in `content.ts`, so a hub can
 * never claim to sell something it does not have.
 *
 * A series with fewer than MIN_PRODUCTS_SERIES live matches renders noindex,
 * so listing a franchise Yukizi does not stock yet is free: the page exists,
 * stays out of the index, and lights up on the first revalidation after a
 * seller lists something matching.
 */

export type SeriesKind = 'anime' | 'game' | 'comic';

export interface SeriesDef {
  slug: string;
  /** Canonical display name, used in titles and headings. */
  name: string;
  kind: SeriesKind;
  /**
   * Alternate names real buyers type. Folded into the matcher AND into the
   * page's opening sentence, because "Kimetsu no Yaiba" and "Demon Slayer"
   * are the same demand and should not need two pages.
   */
  aka?: string[];
  /** One verifiable fact about the work itself. Never about Yukizi's stock. */
  note: string;
  /**
   * Extra regex alternatives (source, case-insensitive, word-boundary
   * wrapped by `seriesPattern`). Use for spellings the name alone misses.
   */
  extraMatch?: string[];
  /** Product slugs the pattern catches wrongly — phrase collisions. */
  exclude?: string[];
}

/** A series hub needs this many live matches before it is allowed to index. */
export const MIN_PRODUCTS_SERIES = 2;

export const SERIES: SeriesDef[] = [
  {
    slug: 'demon-slayer',
    name: 'Demon Slayer',
    kind: 'anime',
    aka: ['Kimetsu no Yaiba'],
    note: 'Koyoharu Gotouge’s manga about Tanjiro Kamado’s hunt for the demon who destroyed his family, adapted into anime by studio ufotable.',
    extraMatch: ['kimetsu'],
  },
  {
    slug: 'naruto',
    name: 'Naruto',
    kind: 'anime',
    aka: ['Naruto Shippuden', 'Boruto'],
    note: 'Masashi Kishimoto’s ninja epic, serialised in Weekly Shonen Jump and continued in Naruto Shippuden and Boruto.',
    extraMatch: ['akatsuki', 'shippuden', 'konoha'],
  },
  {
    slug: 'one-piece',
    name: 'One Piece',
    kind: 'anime',
    note: 'Eiichiro Oda’s pirate adventure, the best-selling manga series in history and still running in Weekly Shonen Jump.',
    extraMatch: ['straw hat', 'grand line'],
    // A Batman Funko whose copy contains the phrase "one piece" is the exact
    // collision this list exists for.
    exclude: [],
  },
  {
    slug: 'dragon-ball',
    name: 'Dragon Ball',
    kind: 'anime',
    aka: ['Dragon Ball Z', 'Dragon Ball Super'],
    note: 'Akira Toriyama’s martial-arts and science-fiction series, continued through Dragon Ball Z and Dragon Ball Super.',
    extraMatch: ['super saiyan', 'saiyan', 'namek'],
  },
  {
    slug: 'jujutsu-kaisen',
    name: 'Jujutsu Kaisen',
    kind: 'anime',
    aka: ['JJK'],
    note: 'Gege Akutami’s dark fantasy about sorcerers who exorcise curses, animated by MAPPA.',
    extraMatch: ['jujutsu'],
  },
  {
    slug: 'attack-on-titan',
    name: 'Attack on Titan',
    kind: 'anime',
    aka: ['Shingeki no Kyojin'],
    note: 'Hajime Isayama’s manga about humanity walled in against man-eating Titans.',
    extraMatch: ['shingeki', 'survey corps'],
  },
  {
    slug: 'death-note',
    name: 'Death Note',
    kind: 'anime',
    note: 'Tsugumi Ohba and Takeshi Obata’s thriller about a student who finds a notebook that kills whoever is named in it.',
    extraMatch: ['shinigami'],
  },
  {
    slug: 'chainsaw-man',
    name: 'Chainsaw Man',
    kind: 'anime',
    note: 'Tatsuki Fujimoto’s manga about a devil hunter fused with his chainsaw devil, animated by MAPPA.',
    extraMatch: ['chainsawman'],
  },
  {
    slug: 'hunter-x-hunter',
    name: 'Hunter x Hunter',
    kind: 'anime',
    aka: ['HxH'],
    note: 'Yoshihiro Togashi’s shonen series following Gon Freecss and Killua Zoldyck through the Hunter Exam and beyond.',
    extraMatch: ['hunter\\s*[x\\u00d7]\\s*hunter', 'zoldyck'],
  },
  {
    slug: 'bleach',
    name: 'Bleach',
    kind: 'anime',
    note: 'Tite Kubo’s series about Ichigo Kurosaki and the Soul Reapers, including the Thousand-Year Blood War arc.',
    extraMatch: ['soul reaper', 'espada', 'arrancar'],
  },
  {
    slug: 'frieren',
    name: 'Frieren',
    kind: 'anime',
    aka: ['Frieren: Beyond Journey’s End', 'Sousou no Frieren'],
    note: 'Kanehito Yamada and Tsukasa Abe’s fantasy about an elf mage outliving the party she once adventured with.',
    extraMatch: ['sousou'],
  },
  {
    slug: 'berserk',
    name: 'Berserk',
    kind: 'anime',
    note: 'Kentaro Miura’s dark fantasy manga following the mercenary Guts, continued after Miura’s death by Studio Gaga.',
  },
  {
    slug: 'my-hero-academia',
    name: 'My Hero Academia',
    kind: 'anime',
    aka: ['Boku no Hero Academia', 'MHA'],
    note: 'Kohei Horikoshi’s manga set in a world where most people are born with superpowers called Quirks.',
    extraMatch: ['boku no hero', '\\bmha\\b'],
  },
  {
    slug: 'tokyo-ghoul',
    name: 'Tokyo Ghoul',
    kind: 'anime',
    note: 'Sui Ishida’s horror manga about a student turned half-ghoul in a Tokyo where ghouls feed on humans.',
  },
  {
    slug: 'one-punch-man',
    name: 'One Punch Man',
    kind: 'anime',
    note: 'ONE’s webcomic, redrawn by Yusuke Murata, about a hero who ends every fight in a single blow.',
    extraMatch: ['saitama'],
  },
  {
    slug: 'spy-x-family',
    name: 'Spy x Family',
    kind: 'anime',
    note: 'Tatsuya Endo’s comedy about a spy, an assassin and a telepath posing as an ordinary family.',
    extraMatch: ['spy\\s*[x\\u00d7]\\s*family', 'forger'],
  },
  {
    slug: 'solo-leveling',
    name: 'Solo Leveling',
    kind: 'anime',
    note: 'Chugong’s Korean web novel and its manhwa adaptation, following Sung Jinwoo from weakest hunter to shadow monarch.',
    extraMatch: ['jinwoo', 'sung jin'],
  },
  {
    slug: 'jojos-bizarre-adventure',
    name: 'JoJo’s Bizarre Adventure',
    kind: 'anime',
    aka: ['JoJo'],
    note: 'Hirohiko Araki’s generational saga, the series that introduced Stands to shonen manga.',
    extraMatch: ['jojo', 'jotaro', 'dio brando'],
  },
  {
    slug: 'fullmetal-alchemist',
    name: 'Fullmetal Alchemist',
    kind: 'anime',
    aka: ['FMA', 'Brotherhood'],
    note: 'Hiromu Arakawa’s manga about the Elric brothers and the law of equivalent exchange.',
    extraMatch: ['fullmetal', 'elric'],
  },
  {
    slug: 'blue-lock',
    name: 'Blue Lock',
    kind: 'anime',
    note: 'Muneyuki Kaneshiro and Yusuke Nomura’s football manga built around a programme to forge one egotist striker.',
    extraMatch: ['isagi'],
  },
  {
    slug: 'haikyuu',
    name: 'Haikyuu!!',
    kind: 'anime',
    note: 'Haruichi Furudate’s volleyball manga following Karasuno High’s climb back to national contention.',
    extraMatch: ['haikyu', 'karasuno', 'hinata shoyo'],
  },
  {
    slug: 'tokyo-revengers',
    name: 'Tokyo Revengers',
    kind: 'anime',
    note: 'Ken Wakui’s manga about a man who travels back in time to save his girlfriend from a delinquent gang’s future.',
    extraMatch: ['takemichi', 'toman'],
  },
  {
    slug: 'black-clover',
    name: 'Black Clover',
    kind: 'anime',
    note: 'Yuki Tabata’s manga about a magicless boy in a kingdom where magic decides everything.',
    extraMatch: ['asta\\b'],
  },
  {
    slug: 'dandadan',
    name: 'Dandadan',
    kind: 'anime',
    note: 'Yukinobu Tatsu’s manga mixing yokai and aliens, animated by Science SARU.',
    extraMatch: ['dan da dan'],
  },
  {
    slug: 'oshi-no-ko',
    name: 'Oshi no Ko',
    kind: 'anime',
    note: 'Aka Akasaka and Mengo Yokoyari’s manga about the entertainment industry, reincarnation and idol culture.',
    extraMatch: ['oshi'],
  },
  {
    slug: 'pokemon',
    name: 'Pokémon',
    kind: 'game',
    aka: ['Pokemon'],
    note: 'Game Freak and Nintendo’s creature-collecting franchise, the highest-grossing media franchise in the world.',
    extraMatch: ['pokemon', 'pok\\u00e9mon', 'eevee', 'eeveelution', 'pikachu'],
  },
  {
    slug: 'elden-ring',
    name: 'Elden Ring',
    kind: 'game',
    note: 'FromSoftware’s open-world action RPG, written with George R. R. Martin.',
    extraMatch: ['tarnished'],
  },
  {
    slug: 'hollow-knight',
    name: 'Hollow Knight',
    kind: 'game',
    note: 'Team Cherry’s hand-drawn Metroidvania set in the fallen insect kingdom of Hallownest.',
    extraMatch: ['hallownest', 'pure vessel'],
  },
  {
    slug: 'devil-may-cry',
    name: 'Devil May Cry',
    kind: 'game',
    aka: ['DMC'],
    note: 'Capcom’s stylish action series following the demon hunter Dante.',
  },
  {
    slug: 'valorant',
    name: 'Valorant',
    kind: 'game',
    note: 'Riot Games’ tactical hero shooter, built around agents with distinct abilities.',
    extraMatch: ['\\bjett\\b', 'radiant'],
  },
  {
    slug: 'assassins-creed',
    name: 'Assassin’s Creed',
    kind: 'game',
    aka: ['Assassins Creed'],
    note: 'Ubisoft’s historical action series that began with Altaïr Ibn-LaʼAhad in the Third Crusade.',
    extraMatch: ['assassin', 'altair', 'alta\\u00efr', 'animus'],
  },
  {
    slug: 'final-fantasy',
    name: 'Final Fantasy',
    kind: 'game',
    aka: ['FF7', 'Final Fantasy VII'],
    note: 'Square Enix’s long-running RPG series; Final Fantasy VII and its remakes are the most widely collected entries.',
    extraMatch: ['sephiroth', 'masamune', 'cloud strife', 'midgar'],
  },
  {
    slug: 'god-of-war',
    name: 'God of War',
    kind: 'game',
    note: 'Santa Monica Studio’s action series, rebooted in 2018 around Kratos and Norse mythology.',
    extraMatch: ['kratos'],
  },
  {
    slug: 'the-witcher',
    name: 'The Witcher',
    kind: 'game',
    note: 'CD Projekt Red’s RPG series adapted from Andrzej Sapkowski’s novels about the monster hunter Geralt of Rivia.',
    extraMatch: ['geralt', 'rivia'],
  },
  {
    slug: 'marvel',
    name: 'Marvel',
    kind: 'comic',
    aka: ['MCU', 'Avengers'],
    note: 'Marvel Comics and the Marvel Cinematic Universe, home to the Avengers, Spider-Man and the X-Men.',
    extraMatch: ['avengers', 'iron man', 'spider[- ]man', 'captain america', '\\bvenom\\b', 'black panther', 'thanos', '\\bthor\\b', 'deadpool', 'wolverine'],
  },
  {
    slug: 'dc-comics',
    name: 'DC Comics',
    kind: 'comic',
    aka: ['DC'],
    note: 'DC Comics, publisher of Batman, Superman and the Justice League since 1934.',
    extraMatch: ['batman', 'superman', 'justice league', 'joker\\b', 'harley quinn', 'bruce wayne', 'gotham'],
  },
  {
    slug: 'star-wars',
    name: 'Star Wars',
    kind: 'comic',
    note: 'Lucasfilm’s space opera franchise, now part of Disney.',
    extraMatch: ['mandalorian', 'darth', 'jedi', 'sith'],
  },
  {
    slug: 'harry-potter',
    name: 'Harry Potter',
    kind: 'comic',
    note: 'The Wizarding World franchise adapted from J. K. Rowling’s novels.',
    extraMatch: ['hogwarts', 'wizarding world'],
  },
  {
    slug: 'godzilla',
    name: 'Godzilla',
    kind: 'comic',
    aka: ['Gojira'],
    note: 'Toho’s kaiju franchise, running since the 1954 original film.',
    extraMatch: ['gojira', 'kaiju'],
  },
  {
    slug: 'horror-icons',
    name: 'Horror Icons',
    kind: 'comic',
    note: 'The slasher and supernatural horror characters collected across the Scream, Halloween, Friday the 13th and Nightmare on Elm Street franchises.',
    extraMatch: ['ghost ?face', 'michael myers', 'freddy krueger', 'jason voorhees', 'pennywise', 'chucky'],
  },
  {
    slug: 'wwe',
    name: 'WWE',
    kind: 'comic',
    note: 'World Wrestling Entertainment, whose roster is one of the most widely produced licences in vinyl collectibles.',
    extraMatch: ['john cena', 'wrestlemania', 'the rock\\b'],
  },
  {
    slug: 'cartoon-classics',
    name: 'Cartoon Classics',
    kind: 'comic',
    note: 'The Hanna-Barbera, Cartoon Network and classic Disney animation properties that anchor the retro end of vinyl collecting.',
    extraMatch: ['johnny bravo', 'jungle book', 'baloo', 'scooby', 'looney tunes', 'powerpuff', 'dexter’s laboratory', 'voltron'],
  },
];

/** Escapes a literal for safe inclusion in a regex source. */
function escapeLiteral(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * The case-insensitive regex source that decides series membership.
 *
 * Built from the name, every `aka`, and every `extraMatch` alternative.
 * Literal names are escaped and word-boundary wrapped; `extraMatch` entries
 * are treated as regex source so they can carry their own anchors (that is
 * why `\\bjett\\b` and `hunter\\s*[x]\\s*hunter` above are written as they are).
 *
 * Substring matching is banned throughout — "eren" inside "Frieren" and "gon"
 * inside "dragon" are real bugs, not hypotheticals.
 */
export function seriesPattern(def: SeriesDef): string {
  const literals = [def.name, ...(def.aka ?? [])].map(
    (n) => `\\b${escapeLiteral(n)}\\b`,
  );
  return [...literals, ...(def.extraMatch ?? [])].join('|');
}

export function seriesBySlug(slug: string): SeriesDef | undefined {
  return SERIES.find((s) => s.slug === slug);
}

export const SERIES_BY_KIND: Record<SeriesKind, SeriesDef[]> = {
  anime: SERIES.filter((s) => s.kind === 'anime'),
  game: SERIES.filter((s) => s.kind === 'game'),
  comic: SERIES.filter((s) => s.kind === 'comic'),
};

/** Human label for a kind, used in headings and breadcrumbs. */
export const KIND_LABEL: Record<SeriesKind, string> = {
  anime: 'Anime & Manga',
  game: 'Video Games',
  comic: 'Comics, Film & TV',
};
