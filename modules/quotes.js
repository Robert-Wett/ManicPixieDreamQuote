var q = require('./quoteBank.js'),
    _ = require('underscore');

var quoteObj = function(id, body) {
    this.id = id;
    this.body = body;
}

var getRandomSet = function(quoteAmount, returnQuote) {
    var numberList = [],
        returnQuotes = [],
        max = q.quotes.length,
        i = 0,
        num;

    for (i; i <= quoteAmount; i++) {
        num = getRandomInt(1, max);
        if (!_.contains(numberList, num)) {
            numberList.push(num);
        }
    }

    if (returnQuote) {
        _.each(numberList, function(num) {
            //returnQuotes.push(q.quotes[num]);
            //returnQuotes[num] = q.quotes[num];
            returnQuotes.push(new quoteObj(num, q.quotes[num]));
        });

        return returnQuotes;
    }

    return numberList;
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getSpecificQuote = function(id) {
    var max = q.quotes.length,
        _id;

    if (id > max || id < 0) {
        var _id = getRandomInt(0, max);
        return new quoteObj(_id, q.quotes[_id]);
        /*
        return {
            "id": _id,
            "quote": q.quotes[_id]
        };
        */
    }

    return new quoteObj(id, q.quotes[id]);

    /*
    return {
        "id": id,
        "quote": q.quotes[id]
    };
    */
};

exports.randomSet = getRandomSet;
exports.getQuote = getSpecificQuote;
/*
var testNumList = getRandomSet(20);
var testQuoteList = getRandomSet(20, true);
var html = "";
_.each(testNumList, function(num) {
    html += num + "\n";
});
$("#test").html(html);
// 
html = "";
_.each(testQuoteList, function(quote) {
    html += quote + "\n";
});
$("#test2").html(html);
*/