var opts = {
    baseColor: "#FFFAFA",
    templateString :
    '<div class="item">' +
    '  <div class="fill">' +
    '    <div id="%s" class="container">' +
    '      <p style="font-size: 500%;color: white;">%s</p>' +
    '    </div>' +
    '  </div>' +
    '</div>'
};

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

    // http://stackoverflow.com/a/2625240/369706
    $("#squeezeMe").mouseup(function() {
        clearTimeout(pressTimer);
        // Clear timeout
        return false;
    }).mousedown(function() {
        // Set timeout
        pressTimer = window.setTimeout( function () {
            alert("LONGPRESS");
        }, 750);
        return false;
    });

    $('#squeezeMe').swipe({
        swipeLeft:  function mobileLeft(event, direction, distance, duration) {
            if (typeof(loadNewQuote) !== 'undefined') {
                loadPrevQuote();
            }
        },
        swipeRight: function mobileRight(event, direction, distance, duration) {
            loadNewQuote();
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

// oh buffer_ieee754.readIEEE754(buffer, offset, isBE, mLen, nBytes);
// Need to override the carousel 'next' click and inject our loading logic.

var carouselNextClick = function() {
    var loadNext = function() {
        $(".post-btn").css("color", opts.baseColor);
        var url = '/api/quote';
        $ajax(url).success(function(data) {
            var quote   = data[0].body;
            var quoteId = data[0].id;
            var htmlToAppend = sprintf(opts.templateString, [quoteId, quote]);
            $(".carousel-inner").append(htmlToAppend);
        });
    };
};

// IDEA!!!!
// Call the above method on mouse-over - that way, mouse-click will just act as normal!