var mongoose = require( 'mongoose' );

var Eventschema = new mongoose.Schema({
    id: Number,
    name: String,
    date: String, //dd-mm-yyyy
    invite: String,
    accepts: Number,
    organiser: String,
    noofguest: Number,
    maxguest: Number
});

var Event = mongoose.model("event",Eventschema);    

module.exports = Event;