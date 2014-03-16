var express      = require('express')
,   app          = express()
,   server       = require('http').createServer(app)
,   redis        = require('redis')
,   client       = redis.createClient()
,   path         = require('path')
,   _            = require('underscore')
,   quoteFactory = require('./modules/quotes.js')
,   uuid         = require('node-uuid')
,   redisHelper  = require('./modules/redisFunctions.js')
,   config       = require('./config.js').config;


app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(require("connect-assets")());
  app.use(express.favicon());
  app.use(express.logger('dev'));
  // parses json, x-www-form-urlencoded, and multipart/form-data
  app.use(express.bodyParser());
  // Support URL encoded bodies (re-check if I need this)
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  // parses request cookies, populating
  // req.cookies and req.signedCookies
  // when the secret is passed, used 
  // for signing the cookies.
  app.use(express.cookieParser(config.cookieParserKey));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'assets')));
});


//  _____             _            
// |  __ \           | |           
// | |__) |___  _   _| |_ ___  ___ 
// |  _  // _ \| | | | __/ _ \/ __|
// | | \ \ (_) | |_| | ||  __/\__ \
// |_|  \_\___/ \__,_|\__\___||___/
//                                 

// Default
app.get('/', function(req, res) {
  if (!req.signedCookies['manicpixiedreamquote']) {
    var userCookieId = uuid.v1();
    res.cookie('manicpixiedreamquote', userCookieId, {signed: true});
  }

  var quote = quoteFactory.randomSet(config.min, true)[0];
  res.render('test-index', {
    quoteBody: quote.body,
    quoteId: quote.id
  });
});

// Deep-Link
app.get('/quote/:id', function(req, res) {
  var quote = quoteFactory.getQuote(req.params.id);
  res.render('index', {quoteBody: quote.body});
});



//                    _____ _____ 
//              /\   |  __ \_   _|
//  ______     /  \  | |__) || |  
// |______|   / /\ \ |  ___/ | |  
//           / ____ \| |    _| |_ 
//          /_/    \_\_|   |_____|

// Pull a random quote
app.get('/api/quote', function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
  res.write(JSON.stringify(quoteFactory.randomSet(config.min, true)));
  res.end();
});

// Pull a specific quote
app.get('/api/quote/:id', function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
  res.write(JSON.stringify(quoteFactory.getQuote(req.params.id)));
  res.end();
});

// Testing, kind of - just returns the query params as a quote.
app.get('/api/userquote/:quote', function(req, res) {
  var userInput = req.params.quote;
  res.render('index', {quoteBody: userInput});
});

// POST
app.post('/api/quote/', function(req, res) {
  // JIC, default to 'NOTLOGGED' if we didn't have the cookie set for some reason.
  var userId   = 'user:' + (req.signedCookies['manicpixiedreamquote'] || 'NOTLOGGED');
  var quoteId  = req.body.id;
  var action   = req.body.action;

  app.handlePost(userId, quoteId, action);
  res.end();
});

//----------------
// Helper Methods
//----------------
app.handlePost = function(userId, quoteId, action) {
  switch (action) {
    case 'share':
      return app.r.share(u, quoteId);
    case 'up':
      redisHelper.upvote(client, userId, quoteId);
      break;
    case 'down':
      redisHelper.downvote(client, userId, quoteId);
      break;
  }
};

client.on("error", function (err) {
  console.log("error event - " + client.host + ":" + client.port + " - " + err);
});


//   _____ _             _     _ _                 
//  / ____| |           | |   (_) |                
// | (___ | |_ __ _ _ __| |_   _| |_   _   _ _ __  
//  \___ \| __/ _` | '__| __| | | __| | | | | '_ \ 
//  ____) | || (_| | |  | |_  | | |_  | |_| | |_) |
// |_____/ \__\__,_|_|   \__| |_|\__|  \__,_| .__/ 
//                                          | |    
//                                          |_|    
quoteFactory.buildDb(client);

server.listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});



// node-inspector &
// node --debug-brk app.js



/*******************************
 *********** GARBAGE ***********
/*******************************

app.r = {
  userExists: function(u) {
    var user = client.hget('users', u);
    return user ? true : false;
  },
  userVotes: function(u) {
        // Return all quotes voted on...
        var up, down;
      },
      upvote: function(userId, quoteId, create) {
        if (create) {
          client.hset('users', userId);
        }

        // Add the user's id to the list of users who interacted with this quote
        client.sadd('voted:' + quoteId, 'user:' + userId);
        // Add the user's id to the list of users who voted this up
        client.sadd('upvoted:' + quoteId, 'user:' + userId);
        // Increment the entry in the main score zset
        client.zincrby('score:', "quote:" + quoteId, 1);
      },
      downvote: function(userId, quoteId, create) {
        if (create) {
          client.hset('users', userId);
        }

        // Decrement the base quote hash objects score
        client.hincrby(quoteId, 'downs', 1);
        // Add the user's id to the list of users who interacted with this quote
        client.zadd('quote:' + quoteId, 'user:' + userId);
        // Add the user's id to the list of users who voted this down
        client.zadd('downvoted:' + quoteId, 'user:' + userId);
        // Decrement the entry in the main score zset
        client.zincrby('score:' + quoteId, -1);
      },
      addUser: function() {
        var user = app.guid();
        client.hset('users', user);
        return user;
      },
      addQuote: function(body, poster) {
        var _id;
        if (!body || !poster) return;

        _id = client.incr('quotes:count');

        client.hmset('quote:' + _id, {
          'body': body,
          'poster': 'admin',
          'time': new Date().getTime(),
          'ups': 1,
          'downs': 0
        });
      }
    };

//----------------
// Helper Methods
//----------------
app.addUser = function(httpObject, cookieVal) {
    // httpObject can be req/res
    httpObject.cookies.manicpixiedreamquote = cookieVal;
  };



  app.share = function(u) {
    // TODO
  };
// Handled now with app.r (redis handler)
app.upvote = function(req, u, quoteId, value) {
  var returnUser = app.r.userExists(u);

  if (returnUser) {
        // Store a voting record. The main thing is the 'voted' article,
        // which is the key. The value will be the 'user:' + guid key.
        app.r.upvote(u, quoteId, value);
      }
      else {
        var userGuid = app.r.addUser();
        app.addUser(userGuid);
        app.r.upvote(userGuid, quoteId, value);
      }
    };

    app.downvote = function(u) {
      var returnUser = app.r.userExists(u);

      if (returnUser) {
        // Store a voting record. The main thing is the 'voted' article,
        // which is the key. The value will be the 'user:' + guid key.
        app.r.downvote(u, quoteId, value);
      }
      else {
        var userGuid = app.r.addUser();
        app.r.downvote(userGuid, quoteId, value);
      }
    };

    app.guid = function() {
      return uuid.v1();
    };
*/
