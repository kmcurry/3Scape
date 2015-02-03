// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var methodOverride = require('method-override');
var mongoStore = require('connect-mongodb');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');


// configuration ===============================================================
var config = require('./configLoader')(process.env.NODE_ENV || "local") //Environment
var port = process.env.PORT || 8080;
mongoose.connect(config.dbConnectionString); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

var utilities = require('./utilities')(config);

// set up our express application
app.use(logger('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
//app.use(methodOverride()); // simulate DELETE and PUT

app.use(express.static(config.publicPath)); 	// set the static files location /public/img will be /img for users

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret:"3Scapeisthebest"})); //session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes/auth/index.js')(app, async, crypto, passport, utilities);
require('./app/routes.js')(app);




// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
