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

/** Maailman tunniste lomakkeen tiedoissa. */
export const WORLD_IDS: Record<StyleKey, string> = {
	A: 'leikkisa',
	B: 'maanlaheinen',
	C: 'moderni',
	D: 'rauhallinen',
};

export function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/.test(email.trim());
}

export interface PaletteColor {
	/** Pitkissä nimissä on pehmeä tavuviiva (\u00AD), jotta nimi mahtuu värilaattaan puhelimella. */
	name: string;
	hex: string;
	/** Näkyy värin nimen perässä: "Helmi – pehmeä ja vaalea pohjasävy". */
	description: string;
}

export interface WorldResult {
	world: string;
	/** Rivi maailman nimen alla. */
	tagline: string;
	/** Osio "Millaisen mielikuvan välität?". */
	impression: string;
	/** Esimerkkivärit, näkyvät vain värilaattoina. */
	palette: [PaletteColor, PaletteColor, PaletteColor, PaletteColor, PaletteColor];
	/** Kappale väripaletin alla. */
	paletteNote: string;
	typography: string;
	shapes: string;
	images: string;
}

export const RESULTS: Record<StyleKey, WorldResult> = {
	A: {
		world: 'Leikkisä ja luova',
		tagline: 'persoonallisuus, luovuus ja rohkeus tehdä omalla tavalla.',
		impression:
			'Sun sivuista välittyy persoonallisuus ja luovuus. Ne kertovat, että yritykselläsi on oma tapansa tehdä asioita, eikä kaiken tarvitse näyttää samalta kuin muilla. Uskallat kokeilla, leikitellä ja tuoda omaa luonnettasi esiin.',
		palette: [
			{name: 'Taivas', hex: '#99B7F5', description: 'raikas sininen'},
			{name: 'Metsä', hex: '#267F53', description: 'luonnonläheinen vihreä'},
			{name: 'Appel\u00ADsiini', hex: '#F5793B', description: 'energinen oranssi'},
			{name: 'Karkki', hex: '#F296BD', description: 'pehmeä pinkki'},
			{name: 'Aurinko', hex: '#FCCA59', description: 'lämmin keltainen'},
		],
		paletteNote:
			'Näillä väreillä voit tuoda ilmeeseen energiaa, iloa ja persoonallisuutta. Kokeile rohkeasti värien yhdistämistä, mutta anna kokonaisuudelle myös selkeä rakenne.',
		typography:
			'Suosi persoonallisia, pyöreitä ja hieman yllätyksellisiä fontteja. Otsikoissa voit leikitellä erilaisilla kirjaintyyleillä ja tekstikokoilla. Leipätekstissä kannattaa kuitenkin säilyttää selkeys ja helppolukuisuus.',
		shapes:
			'Vapaat ja yllättävät muodot, kuten aallot, kaarevat linjat ja epäsymmetriset sommittelut sopivat tähän tyyliin. Kokeile myös pieniä graafisia yksityiskohtia ja leikkisiä elementtejä.',
		images:
			'Ilmeitä, liikettä, värejä ja hauskoja yksityiskohtia. Kuvissa saa näkyä elämää, persoonallisuutta ja aitoja tilanteita. Älä pelkää poiketa perinteisestä kuvamaailmasta.',
	},
	B: {
		world: 'Maanläheinen ja ajaton',
		tagline: 'lämpö, aitous ja huolellisuus.',
		impression:
			'Sun sivuista välittyy lämpö ja aitous. Ne kertovat, että yrityksesi on helposti lähestyttävä ja että tekemisessäsi arvostetaan laatua ja huolellisuutta. Ilmeessä saa näkyä inhimillisyys ja pienet yksityiskohdat.',
		palette: [
			{name: 'Voi\u00ADkreemi', hex: '#EDE2D0', description: 'lämmin ja pehmeä vaalea sävy'},
			{name: 'Vehnä', hex: '#E9D2A9', description: 'luonnollinen hiekan sävy'},
			{name: 'Apri\u00ADkoosi', hex: '#BB6A57', description: 'lämmin persikkainen sävy'},
			{name: 'Mokka', hex: '#A57865', description: 'pehmeä ruskea'},
			{name: 'Kaakao', hex: '#7B5747', description: 'syvä tummanruskea'},
		],
		paletteNote:
			'Näillä väreillä voit rakentaa lämpimän ja luonnollisen kokonaisuuden. Yhdistä vaaleita sävyjä maanläheisiin ruskeisiin ja käytä lämpimämpiä sävyjä tuomaan ilmeeseen elävyyttä.',
		typography:
			'Suosi pehmeitä, klassisia ja helposti lähestyttäviä fontteja. Otsikoissa voi olla hieman persoonallista ja perinteistä kirjaintyyliä, joka tuo ilmeeseen lämpöä. Leipätekstin kannattaa olla selkeää ja vaivatonta lukea.',
		shapes:
			'Pehmeät ja pyöreät muodot, luonnolliset linjat ja maltilliset yksityiskohdat sopivat tähän tyyliin. Voit kokeilla myös kevyitä tekstuureja ja käsintehdyn tuntua tuovia elementtejä.',
		images:
			'Luonnonvalo, aidot hetket, materiaalien pinnat ja käsillä tekeminen. Suosi kuvia, joissa näkyy luonnollisuutta ja lämpöä. Kuvien ei tarvitse olla liian viimeisteltyjä – pieni rosoisuus voi tehdä niistä entistä kiinnostavampia.',
	},
	C: {
		world: 'Moderni ja rohkea',
		tagline: 'itsevarmuus, vahvuus ja vaikuttavuus.',
		impression:
			'Sun sivuista välittyy itsevarmuus ja vahva oma näkemys. Ne kertovat, että tiedät mitä teet etkä pelkää erottua joukosta. Uskallat ottaa tilaa ja näyttää yrityksesi persoonan sellaisena kuin se on.',
		palette: [
			{name: 'Hiili', hex: '#242424', description: 'voimakas ja ajaton pohjasävy'},
			{name: 'Yön\u00ADsininen', hex: '#131936', description: 'syvä ja tyylikäs sininen'},
			{name: 'Viinin\u00ADpunainen', hex: '#390007', description: 'intensiivinen tehosteväri'},
			{name: 'Luun\u00ADvalkoinen', hex: '#D6D1C0', description: 'pehmeä vaalea vastapaino'},
			{name: 'Grafiitti', hex: '#515159', description: 'tumma ja hillitty harmaa'},
		],
		paletteNote:
			'Näillä väreillä voit rakentaa vahvan ja näyttävän kokonaisuuden. Kokeile tummien ja vaaleiden sävyjen kontrastia ja käytä tehostevärejä harkitusti.',
		typography:
			'Suosi näyttäviä otsikkofontteja, joissa on persoonallisuutta ja vahvaa ilmaisua. Otsikoissa voit käyttää suuria kirjaimia ja rohkeita tekstikokoja. Yhdistä niihin selkeä ja moderni leipäteksti, joka pitää kokonaisuuden helposti luettavana.',
		shapes:
			'Selkeät ja suorat linjat, terävät kulmat ja isot elementit sopivat tähän tyyliin. Kokeile rohkeita sommitteluja, suuria otsikoita ja vahvoja kontrasteja. Yksittäinen näyttävä elementti voi tehdä paljon.',
		images:
			'Tiukat rajaukset, lähikuvat, voimakkaat kontrastit ja yhtenäinen kuvallinen tyyli. Valitse kuvia, joissa on vahva tunnelma ja selkeä visuaalinen ilmaisu. Kuvien ei tarvitse olla perinteisiä tai ennalta arvattavia.',
	},
	D: {
		world: 'Rauhallinen ja minimalistinen',
		tagline: 'levollisuus, selkeys ja harkittu yksinkertaisuus.',
		impression:
			'Sun sivuista välittyy rauhallisuus ja varmuus. Ne kertovat, että uskot yksinkertaisuuden voimaan ja arvostat selkeyttä. Sun ei tarvitse huutaa tullaksesi huomatuksi harkitut yksityiskohdat ja selkeä kokonaisuus tekevät vaikutuksen.',
		palette: [
			{name: 'Helmi', hex: '#F6F2EF', description: 'pehmeä ja vaalea pohjasävy'},
			{name: 'Satama', hex: '#B0C0CC', description: 'hillitty sininen'},
			{name: 'Keskiyö', hex: '#363E4F', description: 'syvä tummansininen'},
			{name: 'Usva', hex: '#D9DFE3', description: 'viileä vaaleanharmaa'},
			{name: 'Meren\u00ADvihreä', hex: '#8EA39D', description: 'rauhallinen vihertävä sävy'},
		],
		paletteNote:
			'Näillä väreillä voit luoda sivuille harmonisen ja levollisen tunnelman. Käytä vaaleita sävyjä pohjana ja tummempia värejä harkittuina tehosteina.',
		typography:
			'Suosi selkeitä, kevyitä ja helposti luettavia fontteja. Otsikoissa voit käyttää hieman persoonallisempaa ja eleganttia kirjaintyyliä, kun taas leipätekstissä kannattaa suosia yksinkertaista ja selkeää fonttia.',
		shapes:
			'Yksinkertaiset linjat, ohuet rajaukset ja harkitut yksityiskohdat sopivat tähän tyyliin. Jätä elementtien ympärille reilusti tyhjää tilaa. Kaikkea ei tarvitse täyttää.',
		images:
			'Vähän mutta harkittuja kuvia. Suosi luonnonvaloa, rauhallisia sävyjä, selkeitä sommitteluja ja aitoja yksityiskohtia. Kuvien ei tarvitse olla näyttäviä, vaan niiden tehtävä on tukea kokonaisuuden tunnelmaa.',
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
