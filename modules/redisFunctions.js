var redis  = require('redis');
var client = redis.createClient();
var quotes = require('./quoteBank.js').quotes;
/*----------
redis stuff
------------*/

function redisCallback(error, reply) {
  if (error) console.log('REDIS ERR: ' + error);
}

var qUpvote = function(userId, quoteId) {
  // Add the user to the list of users who have voted this quote up.
  // If the user is already in the list, do nothing and return.
  client.sismember('ups:', 'user:' + userId, function( err, reply ) {
    if (reply) return;
    else {
      client.sadd('ups:', 'user:' + userId, redisCallback);
      client.sadd('active:', 'quote:' + quoteId, redisCallback);
    }
  });

  console.log('Upvoting ' + quoteId);
  // Remove the user from the downvoted list
  client.srem('downs:', 'user:' + userId, redisCallback);
  // Add one to the hash object
  client.hincrby('quote:' + quoteId, 'score', 1, redisCallback);
  // Add one to the master sorted set scoring table
  client.zincrby('score:', 1, 'quote:' + quoteId, redisCallback);
};

var qDownvote = function(userId, quoteId) {
  // Add the user to the list of users who have voted this quote down.
  // If the user is already in the list, do nothing and return.
  client.sismember('downs:', 'user:' + userId, function( err, reply ) {
    if (reply) return;
    else {
      client.sadd('downs:', 'user:' + userId, redisCallback);
      client.sadd('active:', 'quote:' + quoteId, redisCallback);
    }
  });

  console.log('Downvoting ' + 'quote:' + quoteId);
  // Remove the user from the upvoted list
  client.srem('ups:', 'user:' + userId, redisCallback);
  // Decrement one to the hash object
  client.hincrby('quote:' + quoteId, 'score', -1, redisCallback);
  // Decrement one from the master sorted set scoring table
  client.zincrby('score:', -1, 'quote:' + quoteId, redisCallback);
};

var qCreate = function(userId, body) {
  client.incr('quote:', function( err, quoteId ) {
    if (err) return;

    var quoteData = {
      'body'    : body,
      'author'  : 'user:' + userId,
      'created' : new Date().getTime(),
      'votes'   : 0
    };

    client.hmset('quote:' + quoteId, quoteData, function( err, res ) {});
  });
};

var uCreate = function(userId) {
  client.sadd('users', 'user:' + userId, redisCallback);
};

var qShown = function( quoteId ) {
  client.zincrby('quote:served', 1, 'quote:' + quoteId, function(e, r){});
};

var addEntriesToRedisDatabase = function(postedBy) {
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

  for ( var i = 0; i < quotes.length; i++ ) {
    _id         = i;
    quoteKey    = 'quote:' + _id;
    quoteObject = {
      'body'    : quotes[_id],
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



exports.upvote       = qUpvote;
exports.downvote     = qDownvote;
exports.create       = qCreate;
exports.showed       = qShown;
exports.client       = client;
exports.buildRedisDb = addEntriesToRedisDatabase;