var quoteFactory = require('../modules/quotes.js');

/*
 * Quote routes
 */

 module.exports = function(app) {
    // Pull a random quote
    app.get('/quote', function(req, res) {
        
        res.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
        res.write(JSON.stringify(quoteFactory.randomSet(config.min, true)));
        res.end();
    });

    // Pull a specific quote
    app.get('/quote/:id', function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
        res.write(JSON.stringify(quoteFactory.getQuote(req.params.id)));
        res.end();
    });

//------ Testing, kind of - just returns the query params as a quote.
//    app.get('/userquote/:quote', function(req, res) {
//        var userInput = req.params.quote;
//        res.render('index', {quoteBody: userInput});
//    });

    // POST
    app.post('/quote/', function(req, res) {
        var quoteId = req.body.id,
            action  = req.body.action,
            cookie  = req.cookies.mpdq,
            ret;

        ret = app.handleAction(req, cookie, quoteId, action);
        // TODO: Do something with the response
        res.write(ret);
    });    
};