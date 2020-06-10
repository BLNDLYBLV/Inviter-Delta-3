var mongoose = require( 'mongoose' );

var UserSchema = mongoose.Schema({

    username: String,
    password: String,
    email: String,
    notification: [String],
    notifmsg: [String],
    events_signed: [String],
    events_created: [String]
});

var User = mongoose.model('user',UserSchema);

module.exports= User;