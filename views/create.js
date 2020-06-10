// var express      = require("../express");
// var app          = express();
// var bodyParser   = require("body-parser");
// var mongoose     = require("mongoose");
// mongoose.connect("mongodb://localhost/Delta3", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
function enableEditMode()
{
    invite.document.designMode='On';
    invite.document.execCommand('fontName', false, 'Arial');
    invite.document.execCommand('fontSize', false, '1');   
}
function exccmd(cmd)
{
    invite.document.execCommand(cmd, false, null);
}
function exccmdarg(cmd,ar)
{
    invite.document.execCommand(cmd, false, ar);
}
// function sub()
// {
//     var Event=require('../models/Event');
//     var User=require("../models/User");
    
// }