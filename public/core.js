var quoteHolder = angular.module('quotesHolder', []);

function mainController($scope, $http) {
    $scope.currentQuote  = null;
    $scope.previousQuote = null;
    $scope.quoteBank = {};

    $scope.getQuote = function() {
        $http.get('/api/quote')
        .success(function(data) {
           // Initialization
            if (!$scope.currentQuote) {
                $scope.currentQuote = data.body;
            }
            else {
                $scope.previousQuote = $scope.currentQuote;
                $scope.currentQuote  = data.body;
            }
            $scope.quoteBank[data.id] = data.body;
         })
         .error(function(err){
            console.log('Error: ' + err);
         });
    };

    // API - JSON
    $scope.getQuoteById = function(id) {
        $http.get('/api/quote/' + id)
        .success(function(data) {
            $scope.currentQuote  = data;
        })
        .error(function(err) {
            console.log(err);
        });
    };

    $scope.setQuote = function(quote) {
         if (!$scope.currentQuote) {
            $scope.currentQuote = quote.body;
        }
        else {
            $scope.previousQuote = $scope.currentQuote;
            $scope.currentQuote  = quote.body;
        }
        $scope.quoteBank[quote.id] = quote.body;
    };
}

