/*----------
redis stuff
------------*/

function redisCallback(error, reply) {
  if (error) console.log('REDIS ERR: ' + error);
}

var qUpvote = function(client, userId, quoteId) {
  // Add the user to the list of users who have voted this quote up.
  // If the user is already in the list, do nothing and return.
  client.sismember('ups:', 'user:' + userId, function( err, reply ) {
    if (reply === 1) return;
  });

  console.log('Upvoting ' + quoteId);
  // Remove the user from the downvoted list
  client.srem('downs:', 'user:' + userId, redisCallback);
  // Add one to the hash object
  client.hincrby('quote:' + quoteId, 'score', 1, redisCallback);
  // Add one to the master sorted set scoring table
  client.zincrby('score:', 1, 'quote:' + quoteId, redisCallback);
};

var qDownvote = function(client, userId, quoteId) {
  // Add the user to the list of users who have voted this quote down.
  // If the user is already in the list, do nothing and return.
  client.sismember('downs:', 'user:' + userId, function( err, reply ) {
    if (reply === 1) return;
  });

  console.log('Downvoting ' + 'quote:' + quoteId);
  // Remove the user from the upvoted list
  client.srem('ups:', 'user:' + userId, redisCallback);
  // Decrement one to the hash object
  client.hincrby('quote:' + quoteId, 'score', -1, redisCallback);
  // Decrement one from the master sorted set scoring table
  client.zincrby('score:', -1, 'quote:' + quoteId, redisCallback);
};

var qCreate = function(client, userId, body) {
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

var uCreate = function(client, userId) {
  client.sadd('users', 'user:' + userId, redisCallback);
};

var qShown = function( client, quoteId ) {
  client.zincrby('quote:served', 1, 'quote:' + quoteId, function(e, r){});
};


exports.upvote   = qUpvote;
exports.downvote = qDownvote;
exports.create   = qCreate;
exports.showed   = qShown;