var opts = {
    baseColor: "#FFFAFA",
    upColor: "#338E2F",
    downColor: "#E31B47",
    lastId: "",
    templateString : '<div class="item">' +
                     '  <div class="fill">' +
                     '    <div id="%s" class="container">' +
                     '      <p style="font-size: 500%;color: white;">%s</p>' +
                     '    </div>' +
                     '  </div>' +
                     '</div>'
};

// Need to override the carousel 'next' click and inject our loading logic.
var carouselGetNext = function() {

    // We only want to add a new quote if we reach the second to last added quote.
    // Keeping track of this, we can only make an ajax call if we're at the end of
    // the list.
    var lastQuote    = $(".item:nth-last-child(2)").attr("id");
    var currentQuote = $(".active").attr("id");

    // Reset the interaction buttons back to white, or whatever the base color is.
    // We do this no matter what - we need to check against redis to see if we've 
    // voted on this already, and highlight the appropriate buttons.
    $(".post-btn").css("color", opts.baseColor);

    // Only make an ajax call if we are on the second to quote
    if (lastQuote === currentQuote) {
        var url = '/api/quote';
        $.ajax(url).success(function(data) {
            var quoteId   = data[0].id;
            var quoteBody = data[0].body;
            var htmlToAppend =  '<div id="'+ quoteId +'" class="item">' +
                                '  <div class="fill">' +
                                '    <div class="container">' +
                                '      <p id="squeezeMe" class="quoteHolder">'+ quoteBody +'</p>' +
                                '    </div>' +
                                '  </div>' +
                                '</div>';
            $(".carousel-inner").append(htmlToAppend);
            $(".item").fitText(1.2, { maxFontSize: '50px' });
        });
    }
};

var carouselGetPrevious = function carouselGetPrevious() {
    $(".post-btn").css("color", opts.baseColor);
};


/*****************
**** On Load *****
******************/
$(document).ready(function() {
    // Call/Execute the 'FitText' plugin.
    $(".item").fitText(1.2, { maxFontSize: '50px' });

    // Stop the auto-loading behavior of bootstrap's carousel
    $('.carousel').carousel({ interval: false });

    /*
     * Post Buttons
     */
    $("#up").click(function() {
        //var quoteId = $(".quoteHolder").attr("id");
        var quoteId = $(".active").attr("id");
        var data = {
            id: quoteId,
            action: 'up'
        };

        $.ajax({
            type: "POST",
            url: '/api/quote/',
            data: data,
            success: function( response ) {
                $("#up > span").animate({ color: opts.upColor}, 500);
                $("#down > span").animate({ "color": opts.baseColor });
            }
        });
    });

    $("#down").click(function() {
        var quoteId = $(".active").attr("id");
        var data = {
            id: quoteId,
            action: 'down'
        };

        $.ajax({
            type: "POST",
            url: '/api/quote/',
            data: data,
            success: function( response ) {
                $("#down > span").animate({ color: opts.downColor}, 500);
                $("#up > span").animate({ "color": opts.baseColor });
            }
        });
    });

// Ignore for now
    $("share").click(function() {
        var quoteId = $(".active").attr("id");
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


/*
        ____                                  __           __
       / __ \___  ____  ________  _________ _/ /____  ____/ /
      / / / / _ \/ __ \/ ___/ _ \/ ___/ __ `/ __/ _ \/ __  / 
     / /_/ /  __/ /_/ / /  /  __/ /__/ /_/ / /_/  __/ /_/ /  
    /_____/\___/ .___/_/   \___/\___/\__,_/\__/\___/\__,_/   
              /_/                                            
 */

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

