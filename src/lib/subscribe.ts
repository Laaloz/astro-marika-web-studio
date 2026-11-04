// Valmis paikka sähköpostityökalulle. Tämä on ainoa kohta, jota pitää muuttaa, kun työkalu kytketään
// tai vaihtuu. Kutsuja on API-reitti src/pages/api/tyylitesti/subscribe.ts.
//
// Valinta tehdään ympäristömuuttujalla EMAIL_PROVIDER (none, mailerlite tai brevo), ks. .env.example.
// Lomakkeen vastaukset tallentaa ja niistä ilmoittaa Netlify Forms (src/pages/tyylitesti.astro).
// Tästä koodista ei lähetetä sähköpostia: työkaluun viedään vain yhteystieto myöhempää käyttöä varten.

import {KEYWORDS, STYLE_KEYS, WORLD_IDS, isValidEmail} from './tyylitesti.ts';

export interface Subscription {
	email: string;
	companyName: string;
	/** Maailman tunniste: leikkisa, maanlaheinen, moderni tai rauhallinen. */
	world: string;
	/** Koodisana, esim. LÄMMIN. */
	keyword: string;
	/** ISO 8601 -aikaleima. */
	timestamp: string;
}

export interface EmailEnv {
	EMAIL_PROVIDER?: string;
	MAILERLITE_API_KEY?: string;
	MAILERLITE_GROUP_ID?: string;
	BREVO_API_KEY?: string;
	BREVO_LIST_ID?: string;
}

export interface SubscribeResult {
	ok: boolean;
	provider: 'console' | 'mailerlite' | 'brevo';
}

const REQUEST_TIMEOUT_MS = 8000;
const MAX_TEXT_LENGTH = 200;

/** Tarkistaa selaimesta tulleet tiedot. Koodisana johdetaan maailmasta, sitä ei oteta selaimelta. */
export function parseSubscription(input: unknown): Subscription | null {
	if (typeof input !== 'object' || input === null) return null;
	const {email, companyName, world, timestamp} = input as Record<string, unknown>;
	if (typeof email !== 'string' || typeof companyName !== 'string' || typeof world !== 'string') return null;

	const cleanEmail = email.trim();
	const cleanCompany = companyName.trim();
	const key = STYLE_KEYS.find((styleKey) => WORLD_IDS[styleKey] === world);
	if (!key || !isValidEmail(cleanEmail) || cleanEmail.length > MAX_TEXT_LENGTH) return null;
	if (!cleanCompany || cleanCompany.length > MAX_TEXT_LENGTH) return null;

	const time = typeof timestamp === 'string' ? new Date(timestamp) : null;
	return {
		email: cleanEmail,
		companyName: cleanCompany,
		world,
		keyword: KEYWORDS[key],
		timestamp: time && !Number.isNaN(time.getTime()) ? time.toISOString() : new Date().toISOString(),
	};
}

/** MailerLite: kentät world ja keyword pitää luoda ensin työkalussa. */
async function sendToMailerLite(data: Subscription, env: EmailEnv): Promise<boolean> {
	const groupId = env.MAILERLITE_GROUP_ID;
	const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			email: data.email,
			fields: {company: data.companyName, world: data.world, keyword: data.keyword},
			...(groupId ? {groups: [groupId]} : {}),
			subscribed_at: data.timestamp.slice(0, 19).replace('T', ' '),
		}),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	if (!response.ok) console.error(`[tyylitesti] MailerLite palautti virheen ${response.status}`);
	return response.ok;
}

/** Brevo: attribuutit COMPANY, WORLD ja KEYWORD pitää luoda ensin työkalussa. */
async function sendToBrevo(data: Subscription, env: EmailEnv): Promise<boolean> {
	const listId = Number(env.BREVO_LIST_ID);
	const response = await fetch('https://api.brevo.com/v3/contacts', {
		method: 'POST',
		headers: {
			'api-key': env.BREVO_API_KEY ?? '',
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			email: data.email,
			attributes: {COMPANY: data.companyName, WORLD: data.world, KEYWORD: data.keyword},
			...(Number.isInteger(listId) && listId > 0 ? {listIds: [listId]} : {}),
			updateEnabled: true,
		}),
		signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
	});
	if (!response.ok) console.error(`[tyylitesti] Brevo palautti virheen ${response.status}`);
	return response.ok;
}

/** Ei koskaan heitä virhettä: testin käyttäjä saa tuloksensa, vaikka lähetys epäonnistuisi. */
export async function subscribe(data: Subscription, env: EmailEnv): Promise<SubscribeResult> {
	const provider = env.EMAIL_PROVIDER?.trim().toLowerCase();

	try {
		if (provider === 'mailerlite' && env.MAILERLITE_API_KEY) {
			return {ok: await sendToMailerLite(data, env), provider: 'mailerlite'};
		}
		if (provider === 'brevo' && env.BREVO_API_KEY) {
			return {ok: await sendToBrevo(data, env), provider: 'brevo'};
		}
	} catch (error) {
		// Virheviestiin ei tule sähköpostiosoitetta eikä API-avainta.
		console.error(`[tyylitesti] Lähetys työkaluun ${provider} epäonnistui: ${(error as Error).name}`);
		return {ok: false, provider: provider as 'mailerlite' | 'brevo'};
	}

	// Ei sähköpostiosoitetta tai yrityksen nimeä lokiin: tuotannossa loki päätyy Netlifyyn.
	console.log(`[tyylitesti] Sähköpostityökalua ei ole kytketty, ohitetaan (${data.world}, ${data.keyword})`);
	return {ok: true, provider: 'console'};
}
