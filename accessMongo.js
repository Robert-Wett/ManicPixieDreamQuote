var quoteFactory = require('./modules/quotes.js');
var quotes       = require('./modules/quoteBank.js').quotes;
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var _            = require('underscore');
var Quote        = require('./models/quote.js');

var cb = {

  consoleLog: function( err, reply ) {
    if (err) console.log(err);
    else if (reply) console.log(reply);
  },

  mongoOpen: function() {
    console.log('Mongo connection established!');
  },

  noConnectionEstablished: function() {
    console.log('Mongo connection not established!');
  }

};


var helpers = {

  getRandomInt: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  maxQuotes: 281

};


module.exports = {

  getConnection: function( mongoUri, callback ) {
    callback = callback || cb.mongoOpen;
    mongoose.connect(mongoUri, cb.consoleLog);
    mongoose.connection.on('open', callback);
  },

  // If we are dealing with a completely empty DB,
  // then this method will re-populate it.
  initDb: function( callback ) {
    if (mongoose.connection.readyState !== 1) {
      return callback('Mongo client not connected', null);
    }

    _.each(quotes, function( quote, idx ) {
      var _quote = new Quote({
        _id: idx + 1,
        body: quote,
        hidden: false,
        user : {
          first_name: 'Rob',
          last_name : 'Wett'
        },
        comments : [],
        meta: {}
      });
      _quote.save(cb.consoleLog);
    });

    // `null` callback to signal no errors.
    callback(null, 'Successfully added entries.');
  },

  // Assume `q` as a qualified json object in the form of the
  // `Quote` document.
  getRandomQuote: function( callback ) {
    callback   = callback || cb.consoleLog;

    var quoteId = helpers.getRandomInt(1, helpers.maxQuotes);

    Quote
    .find({ '_id': quoteId })
    .exec(function( err, quote ) {
      callback(null, quote);
    });
  },

  // Assume `q` as a qualified json object in the form of the
  // `Quote` document.
  addQuote: function( q, callback ) {
    var _quote = new Quote(q);
    callback   = callback || cb.consoleLog;
    _quote.save(callback);
  },

  // Assume `c` as a qualified json object in the form of the
  // `Comment` document.
  addComment: function( c, callback ) {
    var _comment = new Comment(c);
    callback     = callback || cb.consoleLog;
    _comment.save(callback);
  },

  // Assume `u` as a qualified json object in the form of the
  // `User` document.
  addUser: function( u, callback ) {
    var _user = new User(u);
    callback  = callback || cb.consoleLog;
    _user.save(cb.consoleLog);
  }

};