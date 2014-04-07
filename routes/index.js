var quoteFactory = require('../modules/quotes.js');

/*
 * GET home page.
 */

module.exports = {

  // app.get('/'.....)
  index: function(req, res) {
    var quoteDict = {};
    var firstQuote;
    var userCookieId;
    var quoteSet;
    var i;

    if (!req.signedCookies['manicpixiedreamquote']) {
      userCookieId = uuid.v1();
      res.cookie('manicpixiedreamquote', userCookieId, { signed: true });
    }

    // Pull 2 quotes
    quoteSet = quoteFactory.randomSet(2, true);

    for (i = 0; i < quoteSet.length; i++) {
      quoteDict[quoteSet[i].id] = quoteSet[i].body;
    }

    firstQuote = quoteSet.shift();

    res.render('carousel-index', {
      activeQuoteBody: firstQuote.body,
      activeQuoteId: firstQuote.id,
      quoteSet: quoteSet
    });
  },

  deepLink: function(req, res) {
    var quote = quoteFactory.getQuote(req.params.id);
    res.render('index', {
      quoteBody: quote.body
    });
  }

};