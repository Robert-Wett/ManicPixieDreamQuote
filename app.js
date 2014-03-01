var express      = require('express')
,   app          = express()
,   server       = require('http').createServer(app)
,   path         = require('path')
,   _            = require('underscore')
,   quoteFactory = require('./modules/quotes.js');

var opts = {
    min: 1,
    max: 25
};

app.configure(function() {
    app.set('port', process.env.PORT || 5000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(require("connect-assets")());
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'assets')));
});

// Base route
app.get('/', function(req, res) {
    var quote = quoteFactory.randomSet(opts.min, true)[0];
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
    res.write(JSON.stringify(quoteFactory.randomSet(opts.min, true)));
    res.end();
});

// Pull a specific quote
app.get('/api/quote/:id', function(req, res) {
    res.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
    res.write(JSON.stringify(quoteFactory.getQuote(req.params.id)));
    res.end();
});

// Start it up
server.listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});