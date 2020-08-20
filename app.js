var express      = require("express");
var app          = express();
var bodyParser   = require("body-parser");
var mongoose     = require("mongoose");
var session      = require("express-session");
var passport     = require("passport"); 
var flash        = require("connect-flash");
mongoose.connect("mongodb://localhost/Delta3", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

require('./config/passport')(passport);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req,res,next)=>{
    res.locals.error =req.flash('error');
    next();
});



app.use('/',require('./routes/main.js'));
app.use('/users',require('./routes/users.js'));

app.listen(4000);