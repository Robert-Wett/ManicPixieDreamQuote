var q = require('./quoteBank.js')
,   _ = require('underscore');

function quoteObj(id, body) {
  this.id   = id;
  this.body = body;
}

var getRandomSet = function(quoteAmount, returnQuote) {
  var numberList   = [];
  var returnQuotes = [];
  var max          = q.quotes.length;
  var num;

  while (numberList.length < quoteAmount) {
    num = getRandomInt(0, max);
    if (!_.contains(numberList, num)) {
      numberList.push(num);
    }
  }

    // Return the value, not the list. This is the default. I kept the other
    // option in just in case, but it's really not used.
    if (returnQuote) {
      _.each(numberList, function(num) {
        returnQuotes.push(new quoteObj(num, q.quotes[num]));
      });

      return returnQuotes;
    }

    return numberList;
  };

  var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getSpecificQuote = function(id) {
    var max = q.quotes.length,
    _id;

    if (id > max || id < 0) {
      _id = getRandomInt(0, max);
      return new quoteObj(_id, q.quotes[_id]);
    }

    return new quoteObj(id, q.quotes[id]);
  };

// Add quotes to the redis DB
var addUsers = function(users) {
  _.each(users, function(user, idx) {
    client.incr('usercount');
  });
};
var addEntriesToRedisDatabase = function(client, postedBy) {
  var poster = postedBy || "admin";

  for ( var i = 0; i < q.quotes.length; i++ ) {
    client.hmset('quote:' + i, {
      'body': q.quotes[i],
      'poster': poster,
      'created': new Date().getTime(),
      'ups': 0,
      'downs': 0
    });

    client.zadd('upvotes:' + i, 0);
    client.zadd('downvotes:' + i, 0);
    client.zadd('score:', 'quote:' + i)
  }


};

exports.randomSet = getRandomSet;
exports.getQuote = getSpecificQuote;
exports.quote = quoteObj;
exports.buildDb = addEntriesToRedisDatabase;