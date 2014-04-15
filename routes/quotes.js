var quoteFactory = require('../modules/quotes.js');
var redisHelper  = require('../modules/redisFunctions.js');
var db           = require('../accessMongo.js');
//var client       = redisHelper.client;
var config       = require('../config.js').config;
var resHeaders   = {
  'Content-Type': 'application/json',
  "Access-Control-Allow-Origin": "*"
};

/*
 * GET home page.
 */

module.exports = {
  /*
   * Routes to pull from Mongo
   */
   getRandomFromDb: function(req, res) {
    db.getRandomQuote(function(err, reply) {
      // todo
    });
   },
  /*
   * Routes to pull from the in-memory array
   */
  // app.get('/api/quote'...)
  getRandom: function(req, res) {
    res.writeHead(200, resHeaders);
    res.write(JSON.stringify(quoteFactory.randomSet( config.min, true )));
    res.end();
  },

  getById: function(req, res) {
    res.writeHead(200, resHeaders);
    res.write(JSON.stringify(quoteFactory.getQuote(req.params.id)));
    res.end();
  },

  postAction: function(req, res) {
    // JIC, default to 'NOTLOGGED' if we didn't have the cookie set for some reason.
    var userId   = 'user:' + (req.signedCookies['manicpixiedreamquote'] || 'NOTLOGGED');
    var quoteId  = req.body.id;
    var action   = req.body.action;

    handlePost(userId, quoteId, action);
  }
};

//----------------
// Helper Methods
//----------------
handlePost = function(userId, quoteId, action) {
  switch (action) {
    case 'share':
      // TODO
      return;
    case 'up':
      redisHelper.upvote(userId, quoteId);
      break;
    case 'down':
      redisHelper.downvote(userId, quoteId);
      break;
  }
};