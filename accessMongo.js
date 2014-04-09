var quoteFactory = require('./modules/quotes.js');
var mongoose     = require('mongoose');
var quotes       = require('./quoteBank.js').quotes;
var Schema       = mongoose.Schema;
var _            = require('underscore');
var Quote        = require('./models/quote.js');

var cb = {

  consoleLog: function( err, reply ) {
    if (err) console.log(err);
    else console.log(reply);
  },

  mongoOpen: function() {
    'Mongo connection established!';
  }

};

module.exports = {

  getConnection: function( mongoUri ) {
    mongoose.connect(mongoUri, cb.consoleLog);
    mongoose.connection.on('open', cb.mongoOpen);
  },

  initDb: function( client, callback ) {
    _.each(quotes, function(quote) {
      var _quote = new Quote({
        //TODO
      });
      _quote.save(cb.consoleLog);
    });
  },

  // Assume `q` as a qualified json object in the form of the
  // `Quote` document.
  addQuote: function( q ) {
    var _quote = new Quote(q);
    _quote.save(cb.consoleLog);
  },

  // Assume `c` as a qualified json object in the form of the
  // `Comment` document.
  addComment: function( c ) {
    var _comment = new Comment(c);
    _comment.save(cb.consoleLog);
  },

  // Assume `u` as a qualified json object in the form of the
  // `User` document.
  addUser: function( u ) {
    var _user = new User(u);
    _user.save(cb.consoleLog);
  }

};