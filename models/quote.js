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
<<<<<<< HEAD
        body : String,
        date : Date
=======
        body  : string,
        date  : date
>>>>>>> 5b7e2d15c62b4a3e4d113cafe9f45c747cd3f100
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