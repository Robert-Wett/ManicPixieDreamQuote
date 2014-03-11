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


// Post Button Definitions
$("#up").click(function() {
    var quoteId = $(".quoteHolder").attr("id");
    var data = {
        id: quoteId,
        action: 'up'
    };

    $.ajax({
        type: "POST",
        url: '/api/quote/',
        data: data,
        success: function( response ) {
            // Do nothing... or... something.
            // Maybe set to green to show it was registered.
        }
    });
});

$("#down").click(function() {
    var quoteId = $(".quoteHolder").attr("id");
    var data = {
        id: quoteId,
        action: 'down'
    };

    $.ajax({
        type: "POST",
        url: '/api/quote/',
        data: data,
        success: function( response ) {
            // Do nothing... or... something.
            // Maybe set to red to show it was registered.
        }
    });
});

$("#share").click(function() {
    var quoteId = $(".quoteHolder").attr("id");
    var data = {
        id: quoteId,
        action: 'share'
    };

    $.ajax({
        type: "POST",
        url: '/api/quote/',
        data: data,
        success: function( response ) {
            // Do nothing... or... something.
            // Maybe set to blue to show it was registered.
        }
    });
});
