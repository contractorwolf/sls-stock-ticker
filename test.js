'use strict';
// required external libraries
var yahooFinance = require('yahoo-finance');

console.log('requires loaded');

yahooFinance.quote({
    symbol: 'TREE',
    modules: [ 'price'] // see the docs for the full list
  }, function (err, quotes) {
    console.log(quotes.price.regularMarketPrice)
  });


/*
stockFetcher.getPrice("TREE", function(err, price){
  console.log(price)
});
googleStocks(['NASDAQ:TREE'], function(error, data) {
    var price = 0;
    if(error){
        console.log('error: ',error);
        price = error;
    }else{
        console.log('data: ', JSON.stringify(data));
        price = data[0].l;//first record, l=last price
    }

    console.log('price: ', price);
});
*/