var quoteFactory = require('../modules/quotes.js');

/*
 * GET home page.
 */

 module.exports = function(app) {
    app.get('/', function(req, res) {
        var quote = quoteFactory.randomSet(config.min, true)[0];
        res.render('index', {quoteBody: quote.body});
    });
};