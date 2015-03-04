module.exports = function(app, async, crypto, passport, utilities) {

  var User = require('../../../app/models/user');
  var config = require('../../../configLoader')(process.env.NODE_ENV || "local");
  var express = require('express');
  var bodyParser = require('body-parser');

  //var app = express();
  app.use(bodyParser());

  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      user: req.user,
      info_message: req.flash('info'),
      error_message: req.flash('error'),
      success_message: req.flash('success')
    });
  });

  app.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; //1 hour

          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {

        if (config.email.smtpUser) {
          utilities.emailer.send({
            to: user.email,
            tokenUrl: 'http://' + req.headers.host + '/reset/' + token,
            templateId: config.email.forgot
          });

          req.flash('info', 'An email has been sent to ' + user.email + ' with further instructions.');
          done(null, 'done');
        }

      }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
      });
    });

  // LOGIN & LOGOUT

  // GET
  app.get('/login', function (req, res) {
    //render the page and pass in any flash data if it exists
    res.render('login', {
    message: req.flash('loginMessage'),
    info_message: req.flash('info'),
    error_message: req.flash('error'),
    success_message: req.flash('success')});
  });

  app.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        if (req.session.returnTo)
          return res.redirect(req.session.returnTo);
        else
          return res.render('index');
      });
    })(req, res, next);
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('login');
  });

  // RESET

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      console.log("Date now at post 1: " + Date.now());

      res.render('reset', {
        token: user.resetPasswordToken,
        info_message: req.flash('info'),
      	error_message: req.flash('error'),
      	success_message: req.flash('success')
      });
    });
  });

  app.post('/reset/:token', function(req, res) {

    async.waterfall([
      function(done) {

        User.findOne({ resetPasswordToken: req.body.token,
          resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          user.password = user.generateHash(req.body.password);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
      },
      function(user, done) {

        if (config.email.smtpUser) {
          utilities.emailer.send({
            to: user.email,
            templateId: config.email.reset
          });

          req.flash('success', 'Success! Your password was changed. Please log in.');
          done(null, 'done');
        }

      }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/login');
      });
    });

  //SignUp============================
  app.get('/signup', function (req, res) {
    //render the page and pass any flash data if it exists
    res.render('signup', {message: req.flash('signupMessage')});
  });

  //process the signup form
  app.post('/signup', function (req, res, next) {
    var stripe = require('stripe')('sk_test_gilKHGlFzeRA0lFhoXdY8oIk');

    stripe.customers.create({
      source: req.body.stripeToken, // obtained with Stripe.js
      plan: "Subscriber-Annual-15",
      email: req.body.email
    }, function(err, customer) {
      console.log("Stripe customer error: " + err);
    });

    passport.authenticate('local-signup', function (err, user, info) {
      if (err) {
        console.log(err);
        return next(err);
      }

      if (!user) {
        console.log("!user failure");
        return res.redirect('/signup');
      }


      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        // email
        if (config.email.smtpUser) {
          utilities.emailer.send({
            to: user.email,
            templateId: config.email.welcome
          });
        }
        return res.redirect('/');
      });
    })(req, res, next);

  });
  app.use(express.static(__dirname));
  app.listen(process.env.PORT || 3000);
};
