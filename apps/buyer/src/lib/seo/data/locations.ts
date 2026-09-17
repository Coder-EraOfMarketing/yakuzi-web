/**
 * The location axis — Indian states and cities.
 *
 * PharmaBag generates 114 of these and they are the single best-performing
 * page family on that site. The mechanism does NOT transfer for free, and the
 * difference matters enough to write down, because getting it wrong is how a
 * domain earns a scaled-content-abuse penalty rather than traffic.
 *
 * On PharmaBag a city page is backed by real local data: suppliers are
 * physically located in cities, so "wholesale medicine suppliers in Pune" has
 * a genuinely different answer from the same query for Chennai. Yukizi is a
 * pan-India online marketplace with no city-level inventory — the honest
 * answer to "anime figures in Pune" is the same catalogue as everywhere else.
 *
 * So the gate here is stricter than PharmaBag's, not looser:
 *
 *   A place page may enter the index ONLY if it carries hand-written `note`
 *   copy specific to that place. No note, no index — the page still exists and
 *   still passes link equity, but it stays out of search results.
 *
 * That is deliberate friction. It caps the family at what somebody actually
 * wrote, which is exactly the property that separates a location page from a
 * doorway page. Adding a city below without a note is not an oversight the
 * system will paper over; it is the system refusing to publish filler.
 *
 * Every note states something verifiable about the place — its state, its
 * region, its role as a commercial centre. None of them claim a Yukizi
 * presence, a local warehouse, a local delivery time or a local price,
 * because none of those exist.
 */

export interface City {
  name: string;
  slug: string;
  /**
   * Hand-written, place-specific, verifiable. Its PRESENCE is what makes the
   * page indexable — see the module comment. Leave it off rather than write
   * filler.
   */
  note?: string;
  /** Alternate spelling buyers still use. Folded into the page copy. */
  aka?: string;
}

export interface State {
  name: string;
  slug: string;
  aka?: string;
  note?: string;
  cities: City[];
}

export const STATES: State[] = [
  {
    name: 'Maharashtra',
    slug: 'maharashtra',
    note: 'India’s most urbanised large state and its commercial centre, with the country’s deepest concentration of English-language pop-culture retail.',
    cities: [
      {
        name: 'Mumbai',
        slug: 'mumbai',
        aka: 'Bombay',
        note: 'India’s financial capital and the home of Comic Con India’s longest-running Mumbai edition, which made the city one of the first mainstream markets for imported anime merchandise in the country.',
      },
      {
        name: 'Pune',
        slug: 'pune',
        note: 'A university and IT city whose large student and young-professional population gives it one of the highest per-capita anime viewerships in western India.',
      },
      {
        name: 'Nagpur',
        slug: 'nagpur',
        note: 'The geographic centre of India and the main distribution gateway for Vidarbha and the central states.',
      },
      {
        name: 'Thane',
        slug: 'thane',
        note: 'Part of the Mumbai Metropolitan Region and the registered base of Yukizi’s own operations.',
      },
      { name: 'Nashik', slug: 'nashik' },
      { name: 'Navi Mumbai', slug: 'navi-mumbai' },
      { name: 'Aurangabad', slug: 'aurangabad' },
      { name: 'Kolhapur', slug: 'kolhapur' },
    ],
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    aka: 'NCR',
    note: 'The National Capital Territory and, with the surrounding NCR cities, the largest single retail market in northern India.',
    cities: [
      {
        name: 'New Delhi',
        slug: 'new-delhi',
        note: 'Host city of Comic Con India’s flagship Delhi edition, and the northern hub for imported collectibles and licensed merchandise.',
      },
      {
        name: 'Noida',
        slug: 'noida',
        note: 'A planned NCR city with a dense concentration of IT and media employers, and one of the busiest e-commerce delivery clusters in north India.',
      },
      {
        name: 'Gurugram',
        slug: 'gurugram',
        aka: 'Gurgaon',
        note: 'The NCR’s corporate centre, with the highest disposable-income concentration in northern India.',
      },
      { name: 'Ghaziabad', slug: 'ghaziabad' },
      { name: 'Faridabad', slug: 'faridabad' },
    ],
  },
  {
    name: 'Karnataka',
    slug: 'karnataka',
    note: 'Home to India’s largest technology workforce, and to the country’s most active anime convention and screening circuit outside the NCR.',
    cities: [
      {
        name: 'Bengaluru',
        slug: 'bengaluru',
        aka: 'Bangalore',
        note: 'India’s technology capital, with the country’s largest population of anime and gaming fans in their twenties and thirties, and a long-running Comic Con Bengaluru edition.',
      },
      {
        name: 'Mysuru',
        slug: 'mysuru',
        aka: 'Mysore',
        note: 'A heritage city south-west of Bengaluru with a growing student population and an expanding IT corridor.',
      },
      { name: 'Mangaluru', slug: 'mangaluru', aka: 'Mangalore' },
      { name: 'Hubballi', slug: 'hubballi', aka: 'Hubli' },
    ],
  },
  {
    name: 'Tamil Nadu',
    slug: 'tamil-nadu',
    note: 'South India’s largest manufacturing state, with a strong domestic comics and animation tradition of its own.',
    cities: [
      {
        name: 'Chennai',
        slug: 'chennai',
        aka: 'Madras',
        note: 'The principal port and commercial hub of south India, and the home of a long-established English-language comics retail scene.',
      },
      {
        name: 'Coimbatore',
        slug: 'coimbatore',
        note: 'Tamil Nadu’s second city and the industrial centre of the state’s western belt, with a large engineering-college population.',
      },
      { name: 'Madurai', slug: 'madurai' },
      { name: 'Tiruchirappalli', slug: 'tiruchirappalli', aka: 'Trichy' },
    ],
  },
  {
    name: 'Telangana',
    slug: 'telangana',
    note: 'A young state built around Hyderabad, one of India’s fastest-growing technology and media markets.',
    cities: [
      {
        name: 'Hyderabad',
        slug: 'hyderabad',
        note: 'A major technology and film-production centre, and one of the four cities where Comic Con India has run a regular edition.',
      },
      { name: 'Warangal', slug: 'warangal' },
      { name: 'Secunderabad', slug: 'secunderabad' },
    ],
  },
  {
    name: 'West Bengal',
    slug: 'west-bengal',
    note: 'Eastern India’s commercial and cultural centre, with one of the country’s oldest comics-reading publics.',
    cities: [
      {
        name: 'Kolkata',
        slug: 'kolkata',
        aka: 'Calcutta',
        note: 'The commercial capital of eastern India, with a book and comics retail culture centred on College Street, the largest second-hand book market in the country.',
      },
      { name: 'Howrah', slug: 'howrah' },
      { name: 'Siliguri', slug: 'siliguri' },
      { name: 'Durgapur', slug: 'durgapur' },
    ],
  },
  {
    name: 'Gujarat',
    slug: 'gujarat',
    note: 'One of India’s most industrialised states, with high e-commerce penetration across its western urban belt.',
    cities: [
      {
        name: 'Ahmedabad',
        slug: 'ahmedabad',
        note: 'Gujarat’s largest city and a major commercial centre, with a dense network of shopping districts along the Sabarmati riverfront.',
      },
      {
        name: 'Surat',
        slug: 'surat',
        note: 'A textile and diamond-trading city with one of the highest per-capita incomes in Gujarat.',
      },
      { name: 'Vadodara', slug: 'vadodara', aka: 'Baroda' },
      { name: 'Rajkot', slug: 'rajkot' },
    ],
  },
  {
    name: 'Uttar Pradesh',
    slug: 'uttar-pradesh',
    aka: 'UP',
    note: 'India’s most populous state, with a rapidly growing base of online shoppers across its tier-two cities.',
    cities: [
      {
        name: 'Lucknow',
        slug: 'lucknow',
        note: 'The state capital of Uttar Pradesh and the commercial centre of the Awadh region.',
      },
      {
        name: 'Kanpur',
        slug: 'kanpur',
        note: 'An industrial city on the Ganges and historically one of north India’s largest manufacturing centres.',
      },
      { name: 'Varanasi', slug: 'varanasi' },
      { name: 'Agra', slug: 'agra' },
      { name: 'Prayagraj', slug: 'prayagraj' },
      { name: 'Meerut', slug: 'meerut' },
    ],
  },
  {
    name: 'Rajasthan',
    slug: 'rajasthan',
    note: 'India’s largest state by area, with commerce concentrated in Jaipur and the eastern corridor toward the NCR.',
    cities: [
      {
        name: 'Jaipur',
        slug: 'jaipur',
        note: 'Rajasthan’s capital and the largest retail market in the state, well connected to the NCR by road and rail.',
      },
      { name: 'Jodhpur', slug: 'jodhpur' },
      { name: 'Udaipur', slug: 'udaipur' },
      { name: 'Kota', slug: 'kota' },
    ],
  },
  {
    name: 'Kerala',
    slug: 'kerala',
    note: 'India’s most literate state, with unusually high per-capita spending on books, media and imported goods.',
    cities: [
      {
        name: 'Kochi',
        slug: 'kochi',
        aka: 'Cochin',
        note: 'Kerala’s commercial capital and principal port, and the state’s main hub for imported consumer goods.',
      },
      {
        name: 'Thiruvananthapuram',
        slug: 'thiruvananthapuram',
        aka: 'Trivandrum',
        note: 'Kerala’s capital and the location of its Technopark IT campus.',
      },
      { name: 'Kozhikode', slug: 'kozhikode', aka: 'Calicut' },
      { name: 'Thrissur', slug: 'thrissur' },
    ],
  },
  {
    name: 'Punjab',
    slug: 'punjab',
    note: 'A prosperous agricultural and small-industry state in India’s north-west.',
    cities: [
      {
        name: 'Ludhiana',
        slug: 'ludhiana',
        note: 'Punjab’s largest city and its main industrial and retail centre.',
      },
      { name: 'Amritsar', slug: 'amritsar' },
      { name: 'Jalandhar', slug: 'jalandhar' },
    ],
  },
  {
    name: 'Haryana',
    slug: 'haryana',
    note: 'Wrapped around the western and northern NCR, sharing much of Delhi’s retail catchment.',
    cities: [
      { name: 'Panipat', slug: 'panipat' },
      { name: 'Karnal', slug: 'karnal' },
      { name: 'Hisar', slug: 'hisar' },
    ],
  },
  {
    name: 'Madhya Pradesh',
    slug: 'madhya-pradesh',
    aka: 'MP',
    note: 'India’s second-largest state by area, with commerce concentrated in Indore and Bhopal.',
    cities: [
      {
        name: 'Indore',
        slug: 'indore',
        note: 'Madhya Pradesh’s commercial capital and the largest wholesale and retail market in central India.',
      },
      {
        name: 'Bhopal',
        slug: 'bhopal',
        note: 'The state capital of Madhya Pradesh and a growing education and services centre.',
      },
      { name: 'Jabalpur', slug: 'jabalpur' },
      { name: 'Gwalior', slug: 'gwalior' },
    ],
  },
  {
    name: 'Andhra Pradesh',
    slug: 'andhra-pradesh',
    note: 'A coastal southern state whose commerce runs along the Visakhapatnam–Vijayawada corridor.',
    cities: [
      {
        name: 'Visakhapatnam',
        slug: 'visakhapatnam',
        aka: 'Vizag',
        note: 'Andhra Pradesh’s largest city and the principal port on India’s eastern seaboard.',
      },
      { name: 'Vijayawada', slug: 'vijayawada' },
      { name: 'Guntur', slug: 'guntur' },
    ],
  },
  {
    name: 'Bihar',
    slug: 'bihar',
    note: 'One of India’s most populous states, with fast-growing online retail penetration.',
    cities: [
      {
        name: 'Patna',
        slug: 'patna',
        note: 'Bihar’s capital and the commercial centre of the middle Ganges plain.',
      },
      { name: 'Gaya', slug: 'gaya' },
      { name: 'Bhagalpur', slug: 'bhagalpur' },
    ],
  },
  {
    name: 'Odisha',
    slug: 'odisha',
    note: 'An eastern coastal state with commerce centred on Bhubaneswar and Cuttack.',
    cities: [
      {
        name: 'Bhubaneswar',
        slug: 'bhubaneswar',
        note: 'Odisha’s capital and a planned city with a large concentration of engineering and technology institutes.',
      },
      { name: 'Cuttack', slug: 'cuttack' },
      { name: 'Rourkela', slug: 'rourkela' },
    ],
  },
  {
    name: 'Assam',
    slug: 'assam',
    note: 'The largest economy in north-east India and the gateway state for the region.',
    cities: [
      {
        name: 'Guwahati',
        slug: 'guwahati',
        note: 'The largest city in north-east India and the distribution gateway for all eight north-eastern states.',
      },
      { name: 'Dibrugarh', slug: 'dibrugarh' },
      { name: 'Silchar', slug: 'silchar' },
    ],
  },
  {
    name: 'Jharkhand',
    slug: 'jharkhand',
    note: 'A mineral-rich eastern state with industrial centres at Jamshedpur and Ranchi.',
    cities: [
      { name: 'Ranchi', slug: 'ranchi' },
      { name: 'Jamshedpur', slug: 'jamshedpur' },
      { name: 'Dhanbad', slug: 'dhanbad' },
    ],
  },
  {
    name: 'Chhattisgarh',
    slug: 'chhattisgarh',
    cities: [
      { name: 'Raipur', slug: 'raipur' },
      { name: 'Bhilai', slug: 'bhilai' },
    ],
  },
  {
    name: 'Uttarakhand',
    slug: 'uttarakhand',
    cities: [
      { name: 'Dehradun', slug: 'dehradun' },
      { name: 'Haridwar', slug: 'haridwar' },
    ],
  },
  {
    name: 'Himachal Pradesh',
    slug: 'himachal-pradesh',
    cities: [
      { name: 'Shimla', slug: 'shimla' },
      { name: 'Dharamshala', slug: 'dharamshala' },
    ],
  },
  {
    name: 'Goa',
    slug: 'goa',
    note: 'India’s smallest state by area and among its highest by per-capita income.',
    cities: [
      { name: 'Panaji', slug: 'panaji' },
      { name: 'Margao', slug: 'margao' },
    ],
  },
  {
    name: 'Chandigarh',
    slug: 'chandigarh',
    note: 'A union territory and planned city serving as the shared capital of Punjab and Haryana.',
    cities: [
      {
        name: 'Chandigarh',
        slug: 'chandigarh',
        note: 'A planned union-territory city and the shared capital of Punjab and Haryana, with one of the highest per-capita incomes in northern India.',
      },
    ],
  },
  {
    name: 'Jammu and Kashmir',
    slug: 'jammu-and-kashmir',
    cities: [
      { name: 'Srinagar', slug: 'srinagar' },
      { name: 'Jammu', slug: 'jammu' },
    ],
  },
  {
    name: 'Puducherry',
    slug: 'puducherry',
    cities: [{ name: 'Puducherry', slug: 'puducherry', aka: 'Pondicherry' }],
  },
  {
    name: 'Tripura',
    slug: 'tripura',
    cities: [{ name: 'Agartala', slug: 'agartala' }],
  },
  {
    name: 'Manipur',
    slug: 'manipur',
    cities: [{ name: 'Imphal', slug: 'imphal' }],
  },
  {
    name: 'Meghalaya',
    slug: 'meghalaya',
    cities: [{ name: 'Shillong', slug: 'shillong' }],
  },
];

export interface CityRef extends City {
  stateName: string;
  stateSlug: string;
}

export const ALL_CITIES: CityRef[] = STATES.flatMap((s) =>
  s.cities.map((c) => ({ ...c, stateName: s.name, stateSlug: s.slug })),
);

export function stateBySlug(slug: string): State | undefined {
  return STATES.find((s) => s.slug === slug);
}

export function cityBySlug(stateSlug: string, citySlug: string): CityRef | undefined {
  return ALL_CITIES.find((c) => c.stateSlug === stateSlug && c.slug === citySlug);
}

/**
 * The index gate described at the top of this file.
 *
 * A place with no hand-written note has nothing to say that its 40 siblings
 * do not say identically, which is the definition of a doorway page. It still
 * renders and still links onward; it just does not ask to be ranked.
 */
export function placeIsIndexable(place: { note?: string }): boolean {
  return !!place.note && place.note.trim().length > 0;
}

/** Cities big enough to link from the sitewide hub. Notes required. */
export const TIER_1_CITY_SLUGS = [
  'mumbai',
  'new-delhi',
  'bengaluru',
  'hyderabad',
  'chennai',
  'kolkata',
  'pune',
  'ahmedabad',
  'jaipur',
  'lucknow',
  'kochi',
  'chandigarh',
];

export const TIER_1_CITIES: CityRef[] = ALL_CITIES.filter((c) =>
  TIER_1_CITY_SLUGS.includes(c.slug),
);
