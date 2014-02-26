var assert = require('assert'),
    quoteFactory = require('../modules/quotes.js');

suite('getRandomSet', function() {
    test('getRandomSet should return 20 entries', function() {
        assert.equal(20, quoteFactory.randomSet(20).length);
    });

    test('getRandomSet should return a single entry', function() {
        assert.equal(1, quoteFactory.getQuote(1).length);
    });
});