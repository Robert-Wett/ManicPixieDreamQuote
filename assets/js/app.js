var opts = {
    baseColor: "#FFFAFA"
}

var loadNewQuote = function() {
    $(".post-btn").css("color", opts.baseColor);
    var url = '/api/quote';
    $(".quoteHolder").fadeOut(250, function() {
        $.ajax(url).success(function(data) {
            $(".quoteHolder").html(data[0].body);
            $(".quoteHolder").fadeIn(250);
        });
    });
};


/*
$body = $("body");

// Not even sure if this is loading.
 * If we care that much, maybe add some test cases that have a 
 * while(true){} loop and check for the class existence.
$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
    ajaxStop : function() { $body.removeClass("loading"); }
});
 */


$(document).ready(function() {


    // Call/Execute the 'FitText' plugin.
    $("#squeezeMe").fitText(1.2, { maxFontSize: '50px' });

    $("#squeezeMe").click(function nextQuote() {
        loadNewQuote();
    });

    $('#squeezeMe').swipe({
        swipeUp: function mobileUp(event, direction, distance, duration) {

        }
    });

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
                $("#up > span").animate({ color: '#338e2f'}, 500);
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
                $("#down > span").animate({ color: '#338e2f'}, 500);
                // Do nothing... or... something.
                // Maybe set to red to show it was registered.
            }
        });
    });

    $("share").click(function() {
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
});

var postUp = function postUp() {

};

var postDown = function postDown() {

};

var postShare = function postShare() {

};
