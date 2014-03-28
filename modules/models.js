var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var quoteSchema = new Schema({
    _id: String,
    body: String,
    author: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number,
        shares: Number
    }
});