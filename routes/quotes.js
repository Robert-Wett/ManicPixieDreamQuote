var quoteFactory = require('../modules/quotes.js');
var redisHelper  = require('./modules/redisFunctions.js');
var resHeaders   = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*"
};

/*
 * GET home page.
 */

module.exports = {

  // app.get('/api/quote'...)
  getRandom: function(req, res) {
    res.writeHead(200, resHeaders);
    res.write(JSON.stringify(quoteFactory.randomSet( config.min, true )));
  },

  getById: function(req, res) {
    res.writeHead(200, resHeaders);
    res.write(JSON.stringify(quoteFactory.getQuote(req.params.id)));
  },

  postAction: function(req, res) {
    // JIC, default to 'NOTLOGGED' if we didn't have the cookie set for some reason.
    var userId   = 'user:' + (req.signedCookies['manicpixiedreamquote'] || 'NOTLOGGED');
    var quoteId  = req.body.id;
    var action   = req.body.action;

    app.handlePost(userId, quoteId, action);
  }
};

//----------------
// Helper Methods
//----------------
app.handlePost = function(userId, quoteId, action) {
  switch (action) {
    case 'share':
      return app.r.share(u, quoteId);
    case 'up':
      redisHelper.upvote(client, userId, quoteId);
      break;
    case 'down':
      redisHelper.downvote(client, userId, quoteId);
      break;
  }
};