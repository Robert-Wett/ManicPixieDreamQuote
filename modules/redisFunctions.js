/*----------
redis stuff
------------*/

var qUpvote = function(client, userId, quoteId) {
  quoteId = 'quote:' + quoteId;
  client.hincrby(quoteId, 1, 'score', function(err, res){});
  client.zincrby('score:', 1, quoteId, function(err, res){});
};

var qDownvote = function(client, userId, quoteId) {
  quoteId = 'quote:' + quoteId;
  client.hincrby(quoteId, -1, 'score', function(err, res){});
  client.zincrby('score:', -1, quoteId, function(err, res){});
};

var qCreate = function(client, userId, body) {
  client.incr('quote:', function( err, quoteId ) {
    if (err) return;

    var quoteData = {
      'body'    : body,
      'author'  : 'admin',
      'created' : new Date().getTime(),
      'votes'   : 0
    };

    client.hmset('quote:' + quoteId, quoteData, function( err, res ) {
      // do something....
    });
  });
};

var qShown = function( client, quoteId ) {
  client.zincrby('quote:served', 1, 'quote:' + quoteId, function(e, r){});
};


exports.upvote   = qUpvote;
exports.downvote = qDownvote;
exports.create   = qCreate;
exports.showed   = qShown;


/**
 * Executes all necessary actions needed to record an Downvote from a user.
 * This includes adding to :SET=>
 * @param  {[Object]}   client    Redis Client
 * @param  {[String]}   userId    Unique ID assigned to a user/cookie
 * @param  {[String]}   quoteId   Unique ID assigned to a specific quote
 * @param  {Function}   cb        Callback handler to return the results of the
 *                                function call to
 * @return {[Function]}           Returns the results of the supplied callback
 *                                function after execution
 */

/*
var quoteDownvote = function(client, userId, quoteId, cb) {
  // increment the base quote hash objects score
  client.hincr(quoteid, 'downs', function( err, res ) {
    if (err) return cb(err);
  });

  // add the user's id to the list of users who interacted with this quote
  client.sadd('voted:' + quoteid, 'user:' + userid, function( err, res ) {
    if (err) return cb(err);
  });

  // add the user's id to the list of users who voted this up
  client.sadd('downvoted:' + quoteid, 'user:' + userid, function( err, res ) {
    if (err) return cb(err);
  });

  // increment the entry in the main score zset
  client.zincrby('score:' + quoteid, -1, function( err, res ) {
    if (err) return cb(err);
  });
};
*/


/*
    LISTS/STRUCTURES TO KEEP

    Voted: SET
      - MEM=> user:id
      - KEY=> timestamp

    upvoted:<ID> 
    *SET*
      - MEM=> quote:id

    downvoted:<ID> 
    *SET*
      - KEY=> user:id
    
    Recent: ZSET
      - MEM=> quote:id
      - KEY=> timestamp
*/