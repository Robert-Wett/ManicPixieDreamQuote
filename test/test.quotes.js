var assert = require('assert'),
    quoteFactory = require('../modules/quotes.js');

suite('getRandomSet', function() {
    test('getRandomSet should return 20 entries', function() {
        assert.equal(20, quoteFactory.randomSet(20, false).length);
        assert.equal(20, quoteFactory.randomSet(20, true).length);
        assert.equal(20, quoteFactory.randomSet(20).length);
    });

    test('getQuote should return a single entry', function() {
        var quote = quoteFactory.getQuote(1);
        var compQuote = new quoteFactory.quote(1, "Test");
        assert.equal(compQuote.id, quote.id);
        assert.equal(1, quote.id);
    });
});

describe('Quote Object Manipulation', function() {
    it('Create a user', function() {
        var user = new quoteFactory.quote(1, "Test body"),
            user2 = new quoteFactory.quote(null, "Test body");

        assert.equal(1, user.id);
        assert.equal("Test body", user.body);
        assert.equal(null, user2.id);
    });
});