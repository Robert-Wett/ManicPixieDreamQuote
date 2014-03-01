/*
var QBANK = {};
QBANK.quotes = {};

QBANK.loadNewQuote = function() {
    var url = '/api/quote';
    $.ajax(url).success(function(data) {
        QBANK.quotes[data.id] = data.
        $(".quoteHolder").html(data);
    });
};
*/

var loadNewQuote = function() {
    var url = '/api/quote';
    $(".quoteHolder").fadeOut(250, function() {
        $.ajax(url).success(function(data) {
            //$(".quoteHolder").html(data[body]);
            $(".quoteHolder").html(data[0].body);
            $(".quoteHolder").fadeIn(250);
        });
    });
};


$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop : function() { $body.removeClass("loading"); }
});
