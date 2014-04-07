var main   = require('./routes/index');
var quotes = require('./routes/quotes');


module.exports = function(app) {

    app.get('/', main.index);

    app.get('/quote/:id', main.deepLink);

    app.get('/api/quote', quotes.getRandom);

    app.get('/api/quote/:id', quotes.getById);

    app.post('/api/quote', quotes.postAction);
};