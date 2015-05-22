// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/creator');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

          // find a user whose email is the same as the forms email
          // we are checking to see if the user trying to login already exists
          User.findOne({ 'email' :  email }, function(err, user) {
            console.log("Did we find a 3Scaper?");
              // if there are any errors, return the error
              if (err) {
                console.log(err.message);
                return done(err);
              }

              // check to see if theres already a user with that email
              if (user) {
                console.log('That email is already taken.');
                  return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
              } else {

                console.log("Creating and saving new 3Scaper");

                  // if there is no user with that email
                  // create the user
                  var newUser            = new User();

                  // set the user's local credentials
                  newUser.email     = email;
                  newUser.joined    = new Date();
                  newUser.name      = email;
                  newUser.password  = newUser.generateHash(password);
                  newUser.verified  = false;



                  // save the user
                  newUser.save(function(err) {
                      if (err) console.log(err.message);    // TODO
                      else console.log(newUser.email);
                      return done(null, newUser);
                  });
              }

          });

        });

    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('error', 'No Creator found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('error', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, user);
        });

    }));

    //Deleting an account locally
    passport.use('local-delete', new LocalStrategy({ usernameField : 'email', passwordField : 'password'},
    function(req,email,password,done){
              console.log('before user findone');
        User.findOne({'email' : email }, function(err,user){
            // if there are any errors, return the error before anything else

            if(err){
              console.log(err.message);
              return done(err);
}
              //if no user is found, return error message
            if(!user)
            {
              console.log('no useer found');
              return done(null,false,req.flash('error', 'Account not found.'));
            }
            else{
            return User.findOne({'email' : email} , function(err,user){
              console.log('removing user with email');
              user.remove();
            }
            });
        })
    }))
};
