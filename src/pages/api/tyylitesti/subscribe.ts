import type {APIRoute} from 'astro';
import {getSecret} from 'astro:env/server';
import {parseSubscription, subscribe} from '../../../lib/subscribe';

// Palvelimella ajettava reitti, jotta API-avain ei päädy selaimeen. Muu sivusto pysyy staattisena.
export const prerender = false;

const MAX_BODY_LENGTH = 2000;

const json = (body: object, status: number) =>
	new Response(JSON.stringify(body), {status, headers: {'Content-Type': 'application/json'}});

export const POST: APIRoute = async ({request}) => {
	let input: unknown;
	try {
		const text = await request.text();
		if (text.length > MAX_BODY_LENGTH) return json({ok: false}, 400);
		input = JSON.parse(text);
	} catch {
		return json({ok: false}, 400);
	}

	// Ihminen ei näe website-kenttää. Täytetty kenttä kertoo botista, joten tietoja ei lähetetä.
	if ((input as {website?: unknown} | null)?.website) return json({ok: true}, 202);

	const data = parseSubscription(input);
	if (!data) return json({ok: false}, 400);

	const result = await subscribe(data, {
		EMAIL_PROVIDER: getSecret('EMAIL_PROVIDER'),
		MAILERLITE_API_KEY: getSecret('MAILERLITE_API_KEY'),
		MAILERLITE_GROUP_ID: getSecret('MAILERLITE_GROUP_ID'),
		BREVO_API_KEY: getSecret('BREVO_API_KEY'),
		BREVO_LIST_ID: getSecret('BREVO_LIST_ID'),
	});
	return json({ok: result.ok}, 202);
};
