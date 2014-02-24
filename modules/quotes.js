var q = require('./quoteBank.js')
,   _ = require('underscore');

var getRandomSet = function(quoteAmount, returnQuote) {
    var numberList = []
    ,   returnQuotes = []
    ,   max = q.quotes.length
    ,   i = 0
    ,   num;

    for (i; i <= quoteAmount; i++){
        num = getRandomInt(1, max);
        if (!_.contains(numberList, num)){
            numberList.push(num);
        }
    }

    if (returnQuote) {
        _.each(numberList, function(num) {
            returnQuotes.push(q.quotes[num]);
        });

        return returnQuotes;
    }

    return numberList;
};

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.randomSet = getRandomSet;

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
