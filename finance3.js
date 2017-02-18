(function(angular) {
  'use strict';
angular.module('finance3', [])
  .factory('currencyConverter', ['$http', function($http) {
    var YAHOO_FINANCE_URL_PATTERN =
          'http://query.yahooapis.com/v1/public/yql?q=select * from ' +
          'yahoo.finance.xchange where pair in ("PAIRS")&format=json&' +
          'env=store://datatables.org/alltableswithkeys';
    var currencies = ['USD', 'EUR', 'CNY'];
    var usdToForeignRates = {};

    var convert = function(amount, inCurr, outCurr) {
      return amount * usdToForeignRates[outCurr] / usdToForeignRates[inCurr];
    };

    console.log("Here0");
    var refresh = function() {
      console.log("Here1a");
      var url = YAHOO_FINANCE_URL_PATTERN.
                 replace('PAIRS', 'USD' + currencies.join('","USD'));
      console.log("Here1b");
      return $http.get(url).then(function(response) {
        var newUsdToForeignRates = {};
        console.log("Here1c");
        angular.forEach(response.data.query.results.rate, function(rate) {
          var currency = rate.id.substring(3,6);
          console.log("Here2=" + currency);
          newUsdToForeignRates[currency] = window.parseFloat(rate.Rate);
          console.log("Here3=" + newUsdToForeignRates[currency]);
        });
        usdToForeignRates = newUsdToForeignRates;
        console.log("Here4=" + usdToForeignRates);
      });
    };

    refresh();

    return {
      currencies: currencies,
      convert: convert
    };
  }]);
})(window.angular);