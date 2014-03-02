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

// Base route
app.get('/', function(req, res) {
    var quote = quoteFactory.randomSet(config.min, true)[0];
    res.render('index', {quoteBody: quote.body});
});

// Deep-Link to a quote
app.get('/quote/:id', function(req, res) {
    var quote = quoteFactory.getQuote(req.params.id);
    res.render('index', {quoteBody: quote.body});
});

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

app.get('/api/userquote/:quote', function(req, res) {
    var userInput = req.params.quote;
    res.render('index', {quoteBody: userInput});
});

app.post('/api/quote/', function(req, res) {
    var quoteId = req.body.id,
        action  = req.body.action,
        cookie  = req.cookies.mpdq,
        ret;

    ret = app.handleAction(cookie, quoteId, action);
/*
    if (cookie) {
        // INCOMING PSEUDOCODE
        var user = client.hget("users", cookie);
        app.handleAction(user, quoteId, action);
    }
    else {
        // New user - create a cookie with the key of 'mdpg', which is short for
        // 'ManixPixieDreamQuote', and set the value to a random guid that we can
        // track in our redis stores
        var userGuid = app.guid();

        // Set the cookie first
        res.cookie('mpdq', userGuid, { maxAge: month });

        // Add user's guid to our user table. We keep track of this to prevent
        // multiple votes. Note we are only keeping these for a month, so it's more
        // for users who keep coming back. I don't want to make people sign in.
        client.hset("users", userGuid);
    }

    switch (action) {
        case 'share':
            ret = app.share();
            break;
        case 'up':
            app.upvote();
            break;
        case 'down':
            app.downvote();
            break;
    }
*/
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
    }
};

//----------------
// Helper Methods
//----------------
app.handleAction = function(u, quoteId, action) {
    switch (action) {
        case 'share':
            return app.share(u, quoteId);
        case 'up':
            app.upvote(u, quoteId, 1);
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
    var returnUser = app.r.userExists();

    if (returnUser) {
        // Store a voting record. The main thing is the 'voted' article,
        // which is the key. The value will be the 'user:' + guid key.
        client.zadd('upvoted:' + quoteId, 'user:' + u);
    }
    else {
        var userGuid = app.guid();
        client.hset('users', userGuid);
        client.zadd('upvoted:' + quoteId, 'user:' + userGuid);
    }
};

app.downvote = function(u) {
    var returnUser = app.r.userExists();

    if (history) {
        // Store a voting record. The main thing is the 'voted' article,
        // which is the key. The value will be the 'user:' + guid key.
        client.zadd('downvoted:' + quoteId, 'user:' + u);
    }
    else {
        var userGuid = app.guid();
        client.hset('users', userGuid);
        client.zadd('downvoted:' + quoteId, 'user:' + userGuid);
    }
};

app.guid = function() {
    return uuid.v1();
};


// Start it up
quoteFactory.buildDb(client);

server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});