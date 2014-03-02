var express      = require('express')
,   app          = express()
,   server       = require('http').createServer(app)
,   redis        = require('redis')
,   client       = redis.createClient()
,   path         = require('path')
,   _            = require('underscore')
,   quoteFactory = require('./modules/quotes.js')
,   uuid         = require('node-uuid')
,   config       = require('config.js');


app.configure(function() {
    app.set('port', process.env.PORT || 5000);
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
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'assets')));
    // parses request cookies, populating
    // req.cookies and req.signedCookies
    // when the secret is passed, used 
    // for signing the cookies.
    app.use(express.cookieParser(config.cookieParserKey));
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
    var quote = quoteFactory.randomSet(config.min, true)[0];
    res.render('index', {quoteBody: quote.body});
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
    var quoteId = req.body.id,
        action  = req.body.action,
        cookie  = req.cookies.mpdq,
        ret;

    ret = app.handleAction(cookie, quoteId, action);
    // TODO: Do something with the response
    res.write(ret);
});


/*----------
Redis stuff
------------*/
client.on("error", function (err) {
    console.log("error event - " + client.host + ":" + client.port + " - " + err);
});

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

        client.zadd('upvoted:' + quoteId, 'user:' + userId);
    },
    downvote: function(userId, quoteId, create) {
        if (create) {
            client.hset('users', userId);
        }

        client.zadd('downvoted:' + quoteId, 'user:' + userId);
    },
    addUser: function() {
        var user = app.guid();
        client.hset('users', user);
        return user;
    }
};

//----------------
// Helper Methods
//----------------
app.handleAction = function(u, quoteId, action) {
    switch (action) {
        case 'share':
            return app.r.share(u, quoteId);
        case 'up':
            app.r.upvote(u, quoteId, 1);
            break;
        case 'down':
            app.downvote(u, quoteId, -1);
            break;
    }
};

app.share = function(u) {
    // TODO
};

app.upvote = function(u, quoteId, value) {
    var returnUser = app.r.userExists(u);

    if (returnUser) {
        // Store a voting record. The main thing is the 'voted' article,
        // which is the key. The value will be the 'user:' + guid key.
        app.r.upvote(u, quoteId, value);
    }
    else {
        var userGuid = app.r.addUser();
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