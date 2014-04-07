var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
    _id        : ObjectId,
    last_name  : { type: String, required : true },
    first_name : { type: String, required : true },
    email      : { type: String, required : true },
    token      : { type: String, required : false }
});

module.exports = mongoose.model('User', UserSchema);