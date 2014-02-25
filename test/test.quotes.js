var assert = require('assert')
,	getRandomSet = require('../modules/quotes').getRandomSet
,	getSpecificQuote = require('../modules/quotes').getSpecificQuote;

suite('getRandomSet', function() {
	test('getRandomSet should return 20 entries', function() {
		assertEqual(20, getRandomSet(20).length);
	});

	test('getRandomSet should return a single entry', function() {
		assertEqual(1, getRandomSet(1, true).length);
	});
});