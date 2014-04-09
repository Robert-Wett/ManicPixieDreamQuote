var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var QuoteSchema = new Schema({
    _id    : Number,
    body   : String,
    hidden : Boolean,
    user   : [{
        first_name : String,
        last_name  : String
    }],
    comments : [{
        body : String,
        date : Date
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