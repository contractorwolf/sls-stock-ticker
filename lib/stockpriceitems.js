console.log("stockpriceitems.js loaded");

var mongoose = require('mongoose');
var qs = require('qs');// for body parsing

console.log("requires loaded");

//models
var Schema = mongoose.Schema;

var stockPriceItemSchema = require("../schemas/stockpriceitem.js");

console.log("database schema: " + stockPriceItemSchema);

var StockPriceItem = new Schema(stockPriceItemSchema);

console.log("database schema complete");

var StockPriceItemModel = mongoose.model('StockPriceItem', StockPriceItem); 

console.log("database model complete");


var db_conn = 'mongodb://[USERNAME]:[PASSWORD]@[MONGOLABSERVER]:[MONGOLABSERVERPORT]/[DBNAME]';


// CRUD: Retreive (all in this case)
module.exports.RetreiveRecords = function() {
    console.log("stockpriceitems.js - RetreiveRecords() CALLED");
    return new Promise((resolve, reject) => {
        mongoose.connect(db_conn);

/*
        _id: {type: String},
        symbol: {type: Object, required: true },
        itemRaw: {type: Object},
        lastPrice: { type: Number },
        type: { type: String},
        tags: [ { type: String } ],
        added: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
*/

        //*****CURRENTLY LIMITED TO MOST RECENT 150 RECORDS
        StockPriceItemModel.find({},'lastPrice added').sort({added: -1}).limit(150).exec(function (err, dbstockpriceitems) {
            mongoose.connection.close();
            if (err) {
                //FAILURE
                console.log(err);       
                reject(err)
            } else {
                //SUCCESS       
                console.log('dbstockpriceitems: ', dbstockpriceitems);  
                resolve(dbstockpriceitems);
            }
        });
    });
};


// CRUD: Retreive One
module.exports.RetreiveRecord = function(id) {
    console.log("stockpriceitems.js - RetreiveRecord(id) CALLED with id: ", id);

    return new Promise((resolve, reject) => {
        mongoose.connect(db_conn);
        StockPriceItemModel.findById(id, function (err, dbstockpriceitem) {
            mongoose.connection.close();
            if (err) {
                //FAILURE
                console.log(err);       
                reject(err)
            } else {
                //SUCCESS       
                console.log('dbstockpriceitems: ', dbstockpriceitem);  
                resolve(dbstockpriceitem);
            }
        });
    });
};

// CRUD: create
module.exports.CreateRecord = function(symbol, itemRaw, lastPrice, type) {
// needs to be converted to promise
    console.log("stockpriceitems.js - called: CreateRecord()");
    
    return new Promise((resolve, reject) => {

        var id = mongoose.Types.ObjectId();
        var tags = []; // empty for now

        //-------------------------------------

        /*
        _id: {type: String},
        symbol: {type: Object, required: true },
        itemRaw: {type: Object},
        lastPrice: { type: Number },
        type: { type: String},
        tags: [ { type: String } ],
        added: { type: Date, default: Date.now },
        edited: { type: Date, default: Date.now }
        */


        // _id,symbol,itemRaw,lastPrice,type
        //-------------------------------------


        var dbstockpriceitem = new StockPriceItemModel({_id: id, symbol: symbol, itemRaw: itemRaw, lastPrice: lastPrice, type: type, tags: tags});
        
        console.log("inserting dbstockpriceitem: ", dbstockpriceitem);

        mongoose.connect(db_conn);

        dbstockpriceitem.save(function(err, success) {
            // we've saved the dog into the db here
            console.log("database start close");
            mongoose.connection.close();
            console.log("database end close");

            if (err){
                console.log("save err: ", err);
                //cb(err);
                reject(err);

            }else{
                console.log("save success");
                //cb(null, id);
                resolve(id);
            }
        });
    });
};



// CRUD: update
module.exports.UpdateRecord = function(id, body) {
// needs to be converted to promise
    console.log("stockpriceitems.js - called: UpdateRecord()");
    
    return new Promise((resolve, reject) => {
        console.log("id: ", id);
        console.log("body: ", body);
        try{
            //var body = qs.parse(event.body);
            /*
            _id: {type: String},
            symbol: {type: Object, required: true },
            itemRaw: {type: Object},
            lastPrice: { type: Number },
            type: { type: String},
            tags: [ { type: String } ],
            added: { type: Date, default: Date.now },
            edited: { type: Date, default: Date.now }
            */
            mongoose.connect(db_conn);

            StockPriceItemModel.findOne({ _id: id }, function (err, dbstockpriceitem){
                if(err){
                    console.log("save err: ", err);
                    reject(err);
                }


                dbstockpriceitem.symbol = body.symbol;
                dbstockpriceitem.itemRaw = body.itemRaw;
                dbstockpriceitem.lastPrice = body.lastPrice;

                dbstockpriceitem.type = body.type;
                dbstockpriceitem.tags = body.tags;
                //dbstockpriceitem.edited = ;

                console.log("updating dbstockpriceitem: ", dbstockpriceitem);
                dbstockpriceitem.save();
                mongoose.connection.close();
                console.log("save success");
                resolve(id);
            });
        }catch(ex){
            reject(ex);
        }
    });
};
