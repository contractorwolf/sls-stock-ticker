module.exports = 
{
    _id: {type: String},
    symbol: {type: Object, required: true },
    itemRaw: {type: Object},
    lastPrice: { type: Number },
    type: { type: String},
    tags: [ { type: String } ],
    added: { type: Date, default: Date.now },
    edited: { type: Date, default: Date.now }
}