var loadNewQuote = function() {
	var url = '/api/quote';
	$.ajax(url).success(function(data) {
		$(".quoteHolder").html(data);
	});
};
