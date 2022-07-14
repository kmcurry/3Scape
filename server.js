// server.js

// set up ======================================================================
// get all the tools we need


var mongoose        = require('mongoose'),
    logger          = require('morgan'),
    cookieParser    = require('cookie-parser'),
    passport        = require('passport'),
    flash           = require('connect-flash'),
    session         = require('express-session'),
    methodOverride  = require('method-override'),
    mongoStore      = require('connect-mongo'),
    LocalStrategy   = require('passport-local').Strategy,
    bcrypt          = require('bcrypt'),
    async           = require('async'),
    crypto          = require('crypto'),
    bodyParser      = require('body-parser'),
    compression     = require('compression'),
    express         = require('express');

// configuration ===============================================================
var config = require('./configLoader')(process.env.NODE_ENV || "local") //Environment
var port = config.port;
//mongoose.connect(config.dbConnectionString); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var utilities = require('./utilities')(config);

var app      = express();



app.use(compression());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

app.use(express.static(config.publicPath)); 	// set the static files location /public/img will be /img for users

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret:"3Scapeisthebest", resave: true, saveUninitialized: true})); //session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/auth/index.js')(app, async, config, crypto, passport, utilities);
require('./app/routes.js')(app, config);



// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
