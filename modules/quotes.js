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


var addEntriesToRedisDatabase = function(client, postedBy) {
  var poster = postedBy || "admin";
  var quoteObject;
  var quoteKey;
  var _id;

  // Container for redis console output
  var rOutput = {
    err: [],
    replies: []
  };

  function handleOutput( err, reply ) {
    if (err) {
      rOutput.err.push(err);
    } else if (reply) {
      rOutput.replies.push(reply);
    }
  }

  for ( var i = 0; i < q.quotes.length; i++ ) {
    _id         = i;
    quoteKey    = 'quote:' + _id;
    quoteObject = {
      'body'    : q.quotes[_id],
      'author'  : poster,
      'created' : new Date().getTime(),
      'score'   : 0
    };

    client.hmset(quoteKey, quoteObject, handleOutput);
    client.zadd('score:', 0.0, quoteKey, handleOutput);
    client.sadd('voted:' + _id, 'admin');
    //client.zadd('voted:', )
    //client.incr('quote:', quoteKey, handleOutput);
  }

  return rOutput;
};

exports.randomSet = getRandomSet;
exports.getQuote  = getSpecificQuote;
exports.quote     = quoteObj;
exports.buildDb   = addEntriesToRedisDatabase;