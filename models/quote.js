var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuoteSchema = new Schema({
    _id   : String,
    body  : String,
    author: String,
    hidden: Boolean,
    comments: [{
        body  : String,
        author: String,
        date  : Date
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