var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var CommentSchema = new Schema({
    _user_id : ObjectId,
    body     : String,
    posted   : Date
});

module.exports = mongoose.model('Comment', CommentSchema);