// Aja: node --test src/lib/tyylitesti.test.ts
import assert from 'node:assert/strict';
import {test} from 'node:test';
import {KEYWORDS, RESULTS, STYLE_KEYS, scoreAnswers} from './tyylitesti.ts';
import type {Answers, StyleKey} from './tyylitesti.ts';

const answers = (...keys: StyleKey[]): Answers =>
	Object.fromEntries(keys.map((key, index) => [index + 1, key]));

test('sama vastaus joka kysymykseen antaa kyseisen tyylin', () => {
	for (const key of STYLE_KEYS) {
		assert.equal(scoreAnswers(answers(key, key, key, key, key)), key);
	}
});

test('eniten pisteitä saanut voittaa, vaikka kysymyksen 4 vastaus olisi muu', () => {
	assert.equal(scoreAnswers(answers('A', 'A', 'A', 'B', 'C')), 'A');
});

test('tasatilanteessa kysymys 4 ratkaisee, jos se on tasoissa olevien joukossa', () => {
	assert.equal(scoreAnswers(answers('A', 'A', 'B', 'B', 'C')), 'B');
});

test('jos kysymys 4 ei ole tasoissa, ratkaisee kysymys 5', () => {
	assert.equal(scoreAnswers(answers('A', 'B', 'A', 'D', 'B')), 'B');
});

test('jos kysymykset 4 ja 5 eivät ole tasoissa, ratkaisee kysymys 3', () => {
	// A ja B 2 pistettä, C ja D 1 piste.
	assert.equal(scoreAnswers(answers('A', 'A', 'B', 'C', 'D')), 'A');
	assert.equal(scoreAnswers(answers('B', 'A', 'A', 'C', 'D')), 'A');
});

test('jokaisella maailmalla on oma sisältö oikeassa rakenteessa', () => {
	const worlds = STYLE_KEYS.map((key) => RESULTS[key].world);
	assert.deepEqual(worlds, [
		'Leikkisä ja luova',
		'Maanläheinen ja ajaton',
		'Moderni ja rohkea',
		'Rauhallinen ja minimalistinen',
	]);
	for (const key of STYLE_KEYS) {
		assert.equal(RESULTS[key].palette.length, 5);
	}
});

test('kaikilla tyyleillä on oma avainsana', () => {
	assert.deepEqual(
		STYLE_KEYS.map((key) => KEYWORDS[key]),
		['LUOVA', 'LÄMMIN', 'ROHKEA', 'RAUHA'],
	);
});
