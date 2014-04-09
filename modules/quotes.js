var quotes = require('./quoteBank.js').quotes;
var _      = require('underscore');

function quoteObj(id, body) {
  this.id   = id;
  this.body = body;
}

var getRandomSet = function(quoteAmount, returnQuote) {
  var numberList   = [];
  var returnQuotes = [];
  var max          = quotes.length;
  var num;

  while (numberList.length < quoteAmount) {
    num = getRandomInt(0, max);
    if (!_.contains(numberList, num)) {
      numberList.push(num);
    }
  }

  // Return the value, not the list. This is the default. I kept the other
  // option in just in case, but it's really not used.
  if (returnQuote) {
    _.each(numberList, function(num) {
      returnQuotes.push(new quoteObj(num, quotes[num]));
    });

    return returnQuotes;
  }

    return numberList;
};

var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getSpecificQuote = function(id) {
  var max = quotes.length,
  _id;

  if (id > max || id < 0) {
    _id = getRandomInt(0, max);
    return new quoteObj(_id, quotes[_id]);
  }

  return new quoteObj(id, quotes[id]);
};


exports.randomSet = getRandomSet;
exports.getQuote  = getSpecificQuote;
exports.quote     = quoteObj;