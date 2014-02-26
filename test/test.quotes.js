var assert = require('assert'),
    quoteFactory = require('../modules/quotes.js');

suite('getRandomSet', function() {
    test('getRandomSet should return 20 entries', function() {
        assert.equal(20, quoteFactory.randomSet(20, false).length);
    });

    test('getRandomSet should return a single entry', function() {
        var quote = quoteFactory.getQuote(1);
        var compQuote = new quoteFactory.quote(1, "Test");
        assert.equal(compQuote.id, quote.id);
        assert.equal(1, quote.id);
    });
});