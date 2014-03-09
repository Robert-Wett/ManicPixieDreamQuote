var client = createclienthere();

/*----------
redis stuff
------------*/
client.on("error", function (err) {
    console.log("error event - " + client.host + ":" + client.port + " - " + err);
});


var userexists = function(u) {
    var user = client.hget('users', u);
    return user ? true : false;
};

var uservotes = function(u) {
    // return all quotes voted on...
    var up, down;
};

/**
 * Executes all necessary actions needed to record an upvote from a user.
 * This includes adding to :SET=>
 * @param  {[Object]}   client    Redis Client
 * @param  {[String]}   userId    Unique ID assigned to a user/cookie
 * @param  {[String]}   quoteId   Unique ID assigned to a specific quote
 * @param  {Function}   cb        Callback handler to return the results of the
 *                                function call to
 * @return {[Function]}           Returns the results of the supplied callback
 *                                function after execution, and the redis.print output
 */
var quoteUpvote = function(client, userId, quoteId, cb) {
  var redisFeedback = []; // Hold all the redis.print output

  // increment the base quote hash objects score
  redisFeedback.push(
    client.hincr(quoteid, 'ups', redis.print, function( err, res ) {
      if (err) return cb(err);
    })
  );
  
  // add the user's id to the list of users who interacted with this quote
  redisFeedback.push(
    client.sadd('voted:' + quoteid, 'user:' + userid, redis.print, function( err, res ) {
      if (err) return cb(err);
    })
  );

  // add the user's id to the list of users who voted this up
  redisFeedback.push(
    client.sadd('upvoted:' + quoteid, 'user:' + userid, function( err, res ) {
      if (err) return cb(err);
    })
  );
  
  // increment the entry in the main score zset
  redisFeedback.push(
    client.zincrby('score:' + quoteid, 1, function( err, res ) {
      if (err) return cb(err);
    })
  );

  return redisFeedback;
};

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

var errorHandler = function( err ) {
  // handle this better, obviously...
  console.log(err);
};

var handler = {
  incr: function( err, res ) {
    if err return 
  }
};


var adduser = function() {
    var user = app.guid();
    client.hset('users', user);
    return user;
};

var addquote = function(body, poster) {
    var _id;
    if (!body || !poster) return;

    _id = client.hlen('quotes');

    client.hmset('quotes', {
        'id': _id + 1,
        'body': body,
        'poster': 'admin',
        'time': new date().gettime(),
        'ups': 1,
        'downs': 0
    });
};

//----------------
// helper methods
//----------------

app.guid = function() {
    return uuid.v1();
};


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