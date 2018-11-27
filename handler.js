'use strict';
// required external libraries
var yahooFinance = require('yahoo-finance');

// local libraries
var routehelper = require('./routes/routehelpers');
var stockpriceitems = require('./lib/stockpriceitems');

console.log('requires loaded');

var ticker = 'TREE';//stock price to display


//wanted to use the name of the stock for the url param, make that change here
module.exports.tree = (event, context, callback) => {
    console.log('tree called');

    var view = 'index.html';

    stockpriceitems.RetreiveRecords()
    .then((allRecords)=>{
        console.log('allRecords: ', allRecords);

        var diff1 =  "unknown";
        var diff8 = "unknown";
        var diff24 = "unknown";
        var lastPrice = allRecords[0].lastPrice;

        if(allRecords.length>6){
            diff1 =  lastPrice - allRecords[6].lastPrice// 6 * every 10 minutes = 1 hour
        }
        if(allRecords.length>48){
            diff8 = lastPrice - allRecords[48].lastPrice// 6 * every 10 minutes  = 1 hour * 8 (hours)
        }
        if(allRecords.length>6){
            diff24 = lastPrice - allRecords[144].lastPrice// 6 * every 10 minutes = 1 hour * 24 (hours)
        }
        
        diff1 = diff1.toFixed(2);
        diff8 = diff8.toFixed(2);
        diff24 = diff24.toFixed(2);

        if(diff1==0){
            diff1 = "Even";
        }
        if(diff8==0){
            diff8 = "Even";
        }
        if(diff24==0){
            diff24 = "Even";
        }

        if(diff1>0){
            diff1 = "+" + diff1;
        }
        if(diff8>0){
            diff8 = "+" +  diff8;
        }
        if(diff24>0){
            diff24 = "+" + diff24;
        }

        //formulate response data
        var model = {
            price: allRecords[0].lastPrice,
            allRecords: allRecords,
            title: 'TREE stock price',
            diff1: diff1,// 6 * every 10 minutes = 1 hour
            diff8: diff8,// 6 * every 10 minutes  = 1 hour * 8 (hours)
            diff24: diff24// 6 * every 10 minutes = 1 hour * 24 (hours)
        };

        //this is where the page is built   
        return(routehelper.LoadTemplatePromise(model, view));
    })
    .then((page)=>{
        console.log('page built: ', page);
        var response = { statusCode: 200,
        headers: { "Content-Type" : "text/html" },
        body: page };
        console.log('response: ', response);
        callback(null, response); 
    })
    .catch((error) => {
        console.log('error: ', JSON.stringify(error));
        var response = { statusCode: 500,
            headers: { "Content-Type" : "text/html" },
            body: error };
        console.log('response: ', response);
        callback(null, response); 
    });
};


module.exports.schedule = (event, context, callback) => {
    //can be called directly via http (to get the latest price)
    //or through the cron schedule to save the price on a regular interval
    console.log('schedule called');

    yahooFinance.quote({symbol: ticker, modules: ['price']}, function (error, data) {
        console.log('yahooFinance.quote() called');
        
        var price = 0;
        if(error){
            console.log('error: ',error);
            price = error;
            callback(null, JSON.stringify(error)); 

        }else{
            console.log('data: ', data);
            price = data.price.regularMarketPrice.toFixed(2);//data;//[0].l;//first record, l=last price

            //insert into db
            stockpriceitems.CreateRecord(ticker, data, price, 'schedule')
            .then((result)=>{
                console.log('insert result: ', result);
                //this is where the page is built   

                callback(null, result); 
            })
            .catch((err) => {
                console.log('error: ', JSON.stringify(err));
                callback(null, JSON.stringify(err)); 
            });
        }
    });
};
