// Aja: node --test src/lib/subscribe.test.ts
import assert from 'node:assert/strict';
import {afterEach, test} from 'node:test';
import {parseSubscription, subscribe} from './subscribe.ts';
import type {Subscription} from './subscribe.ts';

const valid = {
	email: ' testi@example.com ',
	companyName: ' Paja Oy ',
	world: 'maanlaheinen',
	keyword: 'VÄÄRÄ',
	timestamp: '2026-11-04T10:00:00.000Z',
};

const data: Subscription = {
	email: 'testi@example.com',
	companyName: 'Paja Oy',
	world: 'maanlaheinen',
	keyword: 'LÄMMIN',
	timestamp: '2026-11-04T10:00:00.000Z',
};

const realFetch = globalThis.fetch;
afterEach(() => {
	globalThis.fetch = realFetch;
});

test('hyväksyy kelvolliset tiedot, siistii ne ja johtaa koodisanan maailmasta', () => {
	assert.deepEqual(parseSubscription(valid), data);
});

test('hylkää virheelliset tiedot', () => {
	assert.equal(parseSubscription(null), null);
	assert.equal(parseSubscription({...valid, email: 'ei-osoite'}), null);
	assert.equal(parseSubscription({...valid, companyName: '   '}), null);
	assert.equal(parseSubscription({...valid, world: 'tuntematon'}), null);
	assert.equal(parseSubscription({...valid, companyName: 'x'.repeat(201)}), null);
});

test('virheellinen aikaleima korvataan palvelimen ajalla', () => {
	const parsed = parseSubscription({...valid, timestamp: 'eilen'});
	assert.ok(parsed && !Number.isNaN(new Date(parsed.timestamp).getTime()));
});

test('ilman työkalua tiedot menevät konsoliin eikä verkkoa käytetä', async () => {
	globalThis.fetch = () => {
		throw new Error('fetchiä ei saa kutsua');
	};
	assert.deepEqual(await subscribe(data, {}), {ok: true, provider: 'console'});
	assert.deepEqual(await subscribe(data, {EMAIL_PROVIDER: 'none'}), {ok: true, provider: 'console'});
	assert.deepEqual(await subscribe(data, {EMAIL_PROVIDER: 'brevo'}), {ok: true, provider: 'console'});
});

test('MailerLite saa tiedot ja avaimen otsakkeessa', async () => {
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = async (input, options) => {
		url = String(input);
		init = options ?? {};
		return new Response('{}', {status: 201});
	};
	const result = await subscribe(data, {
		EMAIL_PROVIDER: 'mailerlite',
		MAILERLITE_API_KEY: 'avain',
		MAILERLITE_GROUP_ID: '123',
	});
	assert.deepEqual(result, {ok: true, provider: 'mailerlite'});
	assert.equal(url, 'https://connect.mailerlite.com/api/subscribers');
	assert.equal((init.headers as Record<string, string>).Authorization, 'Bearer avain');
	const body = JSON.parse(String(init.body));
	assert.deepEqual(body.fields, {company: 'Paja Oy', world: 'maanlaheinen', keyword: 'LÄMMIN'});
	assert.deepEqual(body.groups, ['123']);
});

test('Brevo saa tiedot ja listan numerona', async () => {
	let init: RequestInit = {};
	globalThis.fetch = async (_input, options) => {
		init = options ?? {};
		return new Response('{}', {status: 201});
	};
	const result = await subscribe(data, {EMAIL_PROVIDER: 'brevo', BREVO_API_KEY: 'avain', BREVO_LIST_ID: '7'});
	assert.deepEqual(result, {ok: true, provider: 'brevo'});
	const body = JSON.parse(String(init.body));
	assert.deepEqual(body.attributes, {COMPANY: 'Paja Oy', WORLD: 'maanlaheinen', KEYWORD: 'LÄMMIN'});
	assert.deepEqual(body.listIds, [7]);
});

test('työkalun virhe tai verkkovirhe ei kaada mitään', async () => {
	globalThis.fetch = async () => new Response('{}', {status: 500});
	const failed = await subscribe(data, {EMAIL_PROVIDER: 'brevo', BREVO_API_KEY: 'avain'});
	assert.deepEqual(failed, {ok: false, provider: 'brevo'});

	globalThis.fetch = async () => {
		throw new TypeError('verkko poikki');
	};
	const crashed = await subscribe(data, {EMAIL_PROVIDER: 'mailerlite', MAILERLITE_API_KEY: 'avain'});
	assert.deepEqual(crashed, {ok: false, provider: 'mailerlite'});
});
