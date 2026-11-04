// Tyylitestin sisältö ja pisteytys. Tekstit ovat lopullisia: älä muokkaa ilman
// päivitettyä handoffia. Tiedostossa ei ole DOM- tai Astro-riippuvuuksia, joten
// pisteytyksen voi testata komennolla `node --test src/lib/tyylitesti.test.ts`.

export const STYLE_KEYS = ['A', 'B', 'C', 'D'] as const;
export type StyleKey = (typeof STYLE_KEYS)[number];

/** Vastaukset kysymysnumeroittain (1–5). */
export type Answers = Partial<Record<number, StyleKey>>;

export const QUESTION_COUNT = 5;

export interface QuestionOption {
	/** Vastausvalinnan koko teksti. Kuvakysymyksessä aria-label ja title. */
	label: string;
	/** Kuvakysymyksen lyhyt nimi, näkyy vain valitussa ruudussa. */
	short?: string;
	/** Kuvatiedoston nimi ilman päätettä kansiossa src/assets/tyylitesti/. */
	image?: string;
}

export interface Question {
	pre: string;
	em: string;
	post: string;
	type: 'text' | 'image';
	/** Järjestys vastaa tyylejä A, B, C ja D. */
	options: [QuestionOption, QuestionOption, QuestionOption, QuestionOption];
}

export const QUESTIONS: Question[] = [
	{
		pre: 'Millaisessa ',
		em: 'kodissa',
		post: ' sun yritys viihtyisi?',
		type: 'text',
		options: [
			{
				label: 'Kodissa, jossa persoonalliset esineet, taide ja pienet yllätykset kertoo asukkaastaan.',
			},
			{
				label: 'Luonnonläheisessä kodissa, jossa on kasveja ikkunalaudalla ja kahvi aina tulilla.',
			},
			{
				label: 'Modernissa kodissa, jossa design ja rohkeat valinnat saa näkyä.',
			},
			{
				label: 'Valoisassa kodissa, jossa on tilaa hengittää ja jokaisella esineellä paikkansa.',
			},
		],
	},
	{
		pre: 'Mikä ',
		em: 'hetki',
		post: ' tuntuu eniten sun yritykseltä?',
		type: 'text',
		options: [
			{
				label: 'Aurinkoinen kesäpäivä, jolloin kaikki tuntuu mahdolliselta.',
			},
			{
				label: 'Syksyinen ilta ja lämmin kultainen valo.',
			},
			{
				label: 'Kirkas talvipäivä ja terävät kontrastit.',
			},
			{
				label: 'Keväinen aamu ja pehmeä luonnonvalo.',
			},
		],
	},
	{
		pre: 'Mikä ',
		em: 'materiaali',
		post: ' tuntuu eniten sun yritykseltä?',
		type: 'text',
		options: [
			{
				label: 'Iloiset kuosit, värikkäät printit ja erilaiset kuviot.',
			},
			{
				label: 'Pellava, puu ja luonnolliset pinnat.',
			},
			{
				label: 'Metalli, lasi ja betoni.',
			},
			{
				label: 'Kivi, keramiikka ja sileät pinnat.',
			},
		],
	},
	{
		pre: 'Jos sun yritys olis ',
		em: 'maisema',
		post: ', mikä se olis?',
		type: 'image',
		options: [
			{
				label: 'Värikäs italialainen pikkukaupunki, jossa jokainen nurkka kätkee jotain kiinnostavaa.',
				short: 'Italialainen pikkukaupunki',
				image: 'kaupunki-italia',
			},
			{
				label: 'Metsä sateen jälkeen.',
				short: 'Metsä sateen jälkeen',
				image: 'metsa',
			},
			{
				label: 'Kaupunki iltavaloissa.',
				short: 'Kaupunki iltavaloissa',
				image: 'kaupunki-ilta',
			},
			{
				label: 'Tyyni järvimaisema aamun usvassa.',
				short: 'Järvi aamun usvassa',
				image: 'jarvi',
			},
		],
	},
	{
		pre: 'Jos sun sivut olis kirja, millainen ',
		em: 'kansi',
		post: ' siinä olis?',
		type: 'text',
		options: [
			{
				label: 'Kuvitettu kansi, jossa on hauskoja yksityiskohtia.',
			},
			{
				label: 'Kangaskansi ja kultaiset kirjaimet.',
			},
			{
				label: 'Iso, rohkea typografia ja yksi vahva väri.',
			},
			{
				label: 'Valkoinen kansi ja pieni, hillitty teksti.',
			},
		],
	},
];

/** Koodisana, jonka käyttäjä lähettää Instagramiin linkin kanssa. */
export const KEYWORDS: Record<StyleKey, string> = {
	A: 'LUOVA',
	B: 'LÄMMIN',
	C: 'ROHKEA',
	D: 'RAUHA',
};

export interface PaletteColor {
	/** Pitkissä nimissä on pehmeä tavuviiva (\u00AD), jotta nimi mahtuu pallon alle puhelimella. */
	name: string;
	hex: string;
}

export interface WorldResult {
	world: string;
	/** Kappale osiossa "Näin sun ihanneasiakas sen kokee". */
	experience: string;
	/** Esimerkkivärit, näkyvät vain väripalloina. */
	palette: [PaletteColor, PaletteColor, PaletteColor, PaletteColor, PaletteColor];
	shapes: string;
	images: string;
}

export const RESULTS: Record<StyleKey, WorldResult> = {
	A: {
		world: 'Leikkisä ja luova',
		experience:
			'Sun asiakas viihtyy sun sivuilla ja löytää koko ajan jotain uutta. Persoonalliset yksityiskohdat herättää uteliaisuuden, ja tutustumisesta tulee elämys.',
		palette: [
			{name: 'taivas', hex: '#99B7F5'},
			{name: 'metsä', hex: '#267F53'},
			{name: 'appelsiini', hex: '#F5793B'},
			{name: 'karkki', hex: '#F296BD'},
			{name: 'aurinko', hex: '#FCCA59'},
		],
		shapes: 'vapaat ja yllättävät, kuten aallot, kiemurat ja epäsymmetria',
		images: 'ilmeitä, liikettä, värejä ja hauskoja yksityiskohtia',
	},
	B: {
		world: 'Maanläheinen ja ajaton',
		experience:
			'Sun asiakkaalle tulee heti tervetullut olo. Lämmin tunnelma tekee lähestymisestä helppoa, ja suhun on mutkatonta tutustua.',
		palette: [
			{name: 'voikreemi', hex: '#EDE2D0'},
			{name: 'vehnä', hex: '#E9D2A9'},
			{name: 'aprikoosi', hex: '#BB6A57'},
			{name: 'mokka', hex: '#A57865'},
			{name: 'kaakao', hex: '#7B5747'},
		],
		shapes: 'pehmeät ja pyöreät',
		images: 'luonnonvalo, aidot hetket, sä työssä ja sun käsien jälki',
	},
	C: {
		world: 'Moderni ja rohkea',
		experience:
			'Sun asiakas tuntee heti, että sulla on jotain sanottavaa. Vahva ilme pysäyttää ja jää mieleen.',
		palette: [
			{name: 'musta', hex: '#030303'},
			{name: 'yön\u00ADsininen', hex: '#131936'},
			{name: 'viinin\u00ADpunainen', hex: '#390007'},
			{name: 'luun\u00ADvalkoinen', hex: '#D6D1C0'},
			{name: 'grafiitti', hex: '#515159'},
		],
		shapes: 'selkeät ja suorat, terävät kulmat ja isot elementit',
		images: 'tiukat rajaukset, lähikuvat ja yhtenäinen vahva tyyli',
	},
	D: {
		world: 'Rauhallinen ja minimalistinen',
		experience:
			'Sun asiakas saa hengähtää ja keskittyä olennaiseen. Selkeä ja tasapainoinen ilme tekee tutustumisesta helppoa ja miellyttävää.',
		palette: [
			{name: 'helmi', hex: '#F6F2EF'},
			{name: 'satama', hex: '#B0C0CC'},
			{name: 'keskiyö', hex: '#363E4F'},
			{name: 'usva', hex: '#D9DFE3'},
			{name: 'meren\u00ADvihreä', hex: '#8EA39D'},
		],
		shapes: 'yksinkertaiset, ohuet viivat ja paljon tilaa',
		images: 'vähän mutta harkittuja, valoisia ja samaa sävyä',
	},
};

/**
 * Jokainen vastaus on yksi piste omalle tyylilleen, ja eniten pisteitä saanut
 * voittaa. Tasatilanteessa ratkaisee kysymyksen 4 (maisema) vastaus, jos se on
 * tasoissa olevien joukossa, sitten kysymykset 5, 3, 2 ja 1.
 */
export function scoreAnswers(answers: Answers): StyleKey {
	const counts: Record<StyleKey, number> = {A: 0, B: 0, C: 0, D: 0};
	for (let question = 1; question <= QUESTION_COUNT; question++) {
		const answer = answers[question];
		if (answer) counts[answer]++;
	}

	const max = Math.max(...Object.values(counts));
	const tied = STYLE_KEYS.filter((key) => counts[key] === max);
	if (tied.length === 1) return tied[0];

	for (const question of [4, 5, 3, 2, 1]) {
		const answer = answers[question];
		if (answer && tied.includes(answer)) return answer;
	}
	return tied[0] ?? 'D';
}
