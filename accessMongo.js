var quoteFactory = require('./modules/quotes.js');
<<<<<<< HEAD
var quotes       = require('./modules/quoteBank.js').quotes;
var mongoose     = require('mongoose');
=======
var mongoose     = require('mongoose');
var quotes       = require('./quoteBank.js').quotes;
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
var Schema       = mongoose.Schema;
var _            = require('underscore');
var Quote        = require('./models/quote.js');

var cb = {

  consoleLog: function( err, reply ) {
    if (err) console.log(err);
<<<<<<< HEAD
    else if (reply) console.log(reply);
  },

  mongoOpen: function() {
    console.log('Mongo connection established!');
  },

  noConnectionEstablished: function() {
    console.log('Mongo connection not established!');
=======
    else console.log(reply);
  },

  mongoOpen: function() {
    'Mongo connection established!';
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
  }

};

module.exports = {

<<<<<<< HEAD
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
=======
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
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
  },

  // Assume `q` as a qualified json object in the form of the
  // `Quote` document.
<<<<<<< HEAD
  addQuote: function( q, callback ) {
    var _quote = new Quote(q);
    callback   = callback || cb.consoleLog;
    _quote.save(callback);
=======
  addQuote: function( q ) {
    var _quote = new Quote(q);
    _quote.save(cb.consoleLog);
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
  },

  // Assume `c` as a qualified json object in the form of the
  // `Comment` document.
<<<<<<< HEAD
  addComment: function( c, callback ) {
    var _comment = new Comment(c);
    callback     = callback || cb.consoleLog;
    _comment.save(callback);
=======
  addComment: function( c ) {
    var _comment = new Comment(c);
    _comment.save(cb.consoleLog);
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
  },

  // Assume `u` as a qualified json object in the form of the
  // `User` document.
<<<<<<< HEAD
  addUser: function( u, callback ) {
    var _user = new User(u);
    callback  = callback || cb.consoleLog;
=======
  addUser: function( u ) {
    var _user = new User(u);
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
    _user.save(cb.consoleLog);
  }

};