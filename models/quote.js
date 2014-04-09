var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var QuoteSchema = new Schema({
    _quote   : ObjectId,
    body     : String,
    _user_id : ObjectId,
    hidden   : Boolean,
    comments : [{
        body  : string,
        date  : date
    }],
    date: {
        type   : Date,
        default: Date.now
    },
    meta: {
        favs  : Number,
        votes : Number,
        shares: Number
    }
});

module.exports = mongoose.model('Quote', QuoteSchema);