module.exports = function(app, async, config, crypto, passport, utilities) {

  var Creator = require('../../../app/models/creator');
  var Scape = require('../../../app/models/scape');
  var express = require('express');
  var mongoose = require('mongoose');
  var stripe = require('stripe')(config.payment.secKey);

  // WRITTEN FOR WooCommmerce shopping cart
  // But not used
  app.post('/auth/new', function (req, res) {
    console.log("Welcome new 3Scaper!");

    var striper = req.body;
    striper = striper.data.object;


    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    Creator.findOne({ 'email' :  striper.email }, function(err, user) {
        // if there are any errors, return the error
        if (err)
          res.status(200).send("Error");

        // check to see if theres already a user with that email
        if (user) {
            console.log("3Scaper already exists");
            res.status(200).send("3Scaper already exists");
        } else {

            // if there is no user with that email
            // create the user
            var new3Scaper            = new Creator();

            var tempPass = crypto.randomBytes(8).toString('hex');

            // set the user's local credentials
            new3Scaper.email    = striper.email;
            new3Scaper.name     = striper.email;
            new3Scaper.password = new3Scaper.generateHash(tempPass);

            // save the user
            new3Scaper.save(function(err) {
                if (err)
                    throw err;
            });

            // email
            if (config.email.smtpUser) {
              console.log("Sending welcome mailer.");
              utilities.emailer.send({
                to: new3Scaper.email,
                tempPass: tempPass,
                templateId: config.email.welcome
              });
            }

            res.sendStatus(201);
        }

    });

  });


  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      creator: req.creator,
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
        Creator.findOne({ email: req.body.email }, function(err, creator) {
          if (!creator) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }

          creator.resetPasswordToken = token;
          creator.resetPasswordExpires = Date.now() + 3600000; //1 hour

          creator.save(function(err) {
            done(err, token, creator);
          });
        });
      },
      function(token, creator, done) {

        if (config.email.smtpCreator) {
          utilities.emailer.send({
            to: creator.email,
            tokenUrl: 'http://' + req.headers.host + '/reset/' + token,
            templateId: config.email.forgot
          });

          req.flash('info', 'An email has been sent to ' + creator.email + ' with further instructions.');
          done(null, 'done');
        }

      }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/forgot');
      });
    });

  // LOGIN & LOGOUT

  // DELETING
  app.post('/cancelDestroy3Scaper', function (req, res, next) {
    Creator.findOne({'email' : req.user.email} , function(err,creator)
    {
      if(err)
      {
        console.log(err.message);
        res.redirect('/opt-out');
      }
      if(!creator)
      {
        console.log('creator not found');
        res.redirect('/opt-out');
      }
      else
      {
        creator.markedForDestruction = false;
        creator.save();

        console.log('3scaper destruction was canceled. Hooray!');
        res.sendStatus(200);
      }

    });
  });

  app.post('/delete3Scaper', function (req, res, next) {
    if (req.user.validPassword(req.body.password)) {

        Creator.findOne({'email' : req.user.email} , function(err,creator)
        {
          if(err)
          {
            console.log(err.message);
            res.sendStatus(500);
          }
          if(!creator)
          {
            console.log('creator not found');
            res.sendStatus(500);
          }
          else
          {
            creator.markedForDestruction = true;
            creator.save();

            console.log('3scaper marked for destruction. Awaiting confirmation or cancelation.');
            res.redirect('/opt-out');
          }

        });
      }
      else
      {
        req.flash('error_message', 'Incorrect password. Please try again.');
        res.redirect('/profile');

      }

  });

  app.post('/destroy3Scaper', function (req, res, next) {

      Creator.findOne({'email' : req.user.email, 'markedForDestruction' : true} , function(err,creator)
      {
        if(err)
        {
          console.log(err.message);
          res.sendStatus(500);
        }
        if(!creator)
        {
          console.log('creator not found or not marked for destruction');
          res.sendStatus(500);
        }
        else
        {
          var email = creator.email;

          Scape.find({'creator' : email}, function(err, scapes) {
            if (err) {
              console.log(err.message);
              res.sendStatus(500);
            }
            if (!scapes) {
              console.log('scapes not found for ' + email);
              res.sendStatus(500);
            } else {
              for (s in scapes) {
                console.log("Erasing scape: " + scapes[s].scapeRef);
                scapes[s].remove();
              }
              console.log("This 3Scaper\'s 3Scapes escaped.")
            }
          });

          creator.remove();

          console.log('3scaper permanently removed. :^(');
          res.sendStatus(200);
        }

      });

  });

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
    passport.authenticate('local-login', function(err, creator, info) {
      if (err) { return next(err); }
      if (!creator) {
        return res.redirect('/login');
      }
      req.logIn(creator, function(err) {
        if (err) {
          return next(err);
        }
        if (req.session.returnTo)
          return res.redirect(req.session.returnTo);
        else
          return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('login');
  });


  app.post("/new", function (req, res) {

    var scapeRef = process.pid + (+new Date()).toString(36);

    if (req.user) {
      var creator = req.user;

      console.log("Creating a new 3Scape for " + creator.email + " with ref: " + scapeRef);

      var scape = new Scape();
      scape.creator = creator.email;
      scape.scapeRef = scapeRef;
      scape.title = "Untitled 3Scape";
      scape.content = "";

      scape.save(function(err) {
        if (err) {
          console.log("error saving scape: " + err);
          res.sendStatus(500);
        }
      });


      creator.scapes.push(scape.scapeRef);

      creator.save(function(err) {
        if (err) {
          console.log("error saving creator: " + err);
          res.sendStatus(500);
        }
      });

      scapeRef = scape.scapeRef;

    }

    res.json(scapeRef);

  });

  app.post("/payment", function(req, res, next) {
    console.log("Verifying payment for: " + req.user.email);

    stripe.customers.create({
      source: req.body.stripeToken, // obtained with Stripe.js
      plan: config.payment.plan,
      email: req.user.email
    }, function(err, customer) {
      if (err || !customer) {
        console.log("Payment verification error: " + err.message);
        req.flash('signupMessage', 'There was a problem with your payment. ' + err);
        return res.render('signup');
      } else {
        console.log("authenticating...");

        if (req.isAuthenticated()) {
          req.user.verified = true;
          req.user.save();
          return res.redirect('/');
        }
      }
    });

  });

  app.get("/register", function(req, res) {
    res.render("signup");
  });

  app.post("/register", function(req, res, next) {

    passport.authenticate('local-signup', function (err, creator, info) {
      if (err) {
        console.log(err.message);
        req.flash('signupMessage', 'There was a problem logging you in. ' + err);
        return next(err);
      }

      if (!creator) {
        console.log("NO CREATOR");
        return res.render('login', {
          message: "You already have an account. Please log in."
          } ); // redirect fails in other callbacks
                                        // with 'cannot set headers after they're sent' - KMC
      }


      req.logIn(creator, function(err) {
        if (err) {
          console.log("There was a problem logging you in");
          return next(err);
        }
        // email
        if (config.email.smtpUser) {
          console.log("Sending welcome mailer.");
          utilities.emailer.send({
            to: creator.email,
            templateId: config.email.welcome
          });
        }
        return res.redirect('/');
      });
    })(req, res, next);
  });

  // RESET

  app.get('/reset/:token', function(req, res) {
    Creator.findOne({ resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() } }, function(err, creator) {
      if (!creator) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }

      res.render('reset', {
        token: creator.resetPasswordToken,
        info_message: req.flash('info'),
      	error_message: req.flash('error'),
      	success_message: req.flash('success')
      });
    });
  });

  app.post('/reset/:token', function(req, res) {

    async.waterfall([
      function(done) {

        Creator.findOne({ resetPasswordToken: req.body.token,
          resetPasswordExpires: { $gt: Date.now() } }, function(err, creator) {
          if (!creator) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }

          creator.password = creator.generateHash(req.body.password);
          creator.resetPasswordToken = undefined;
          creator.resetPasswordExpires = undefined;

          creator.save(function(err) {
            req.logIn(creator, function(err) {
              done(err, creator);
            });
          });
        });
      },
      function(creator, done) {

        if (config.email.smtpCreator) {
          utilities.emailer.send({
            to: creator.email,
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

  app.post("/save", function(req, res) {
    if (req.user) {
      console.log("saving scape: " + req.body.scapeRef);

      if (req.body.scapeRef) {

        // a scape must exist from /new in order to be saved, else error
        Scape.findOne( { scapeRef: req.body.scapeRef }, function(err, scape) {
          if (scape) {
            console.log("Found existing scape for " + scape.scapeRef + " while saving. Updating...");
            scape.content = req.body.scape;

            scape.save(function(err) {
              if (err) {
                console.log("Save scape error: " + err);
                res.sendStatus(500);
              } else {
                res.sendStatus(200);
              }
            });
          } else {
            console.log("no scape: " + err);
            res.sendStatus(500);
          }

        });
      } else {
        res.sendStatus(500);
      }

    }
  });

  //SignUp============================
  app.get('/signup', function (req, res) {
    //render the page and pass any flash data if it exists
    res.render('signup', {
      message: req.flash('signupMessage'),
      paymentKey: config.payment.pubKey
      });
  });

  //process the signup form
  app.post('/signup', function (req, res, next) {


    stripe.customers.create({
      source: req.body.stripeToken, // obtained with Stripe.js
      plan: config.payment.plan,
      email: req.body.email
    }, function(err, customer) {
      if (err || !customer) {
        req.flash('signupMessage', 'There was a problem with your payment. ' + err);
        return res.redirect('/signup');
      } else {
        passport.authenticate('local-signup', function (err, creator, info) {
          if (err) {
            req.flash('signupMessage', 'There was a problem logging you in. ' + err);
            return next(err);
          }

          if (!creator) {
            req.flash('signupMessage', 'There was a problem creating your 3Scape profile.');
            return res.redirect('/signup'); // redirect fails in other callbacks
                                            // with 'cannot set headers after they're sent' - KMC
          }


          req.logIn(creator, function(err) {
            if (err) {
              console.log("There was a problem logging you in");
              return next(err);
            }
            // email
            if (config.email.smtpUser) {
              console.log("Sending welcome mailer.");
              utilities.emailer.send({
                to: creator.email,
                templateId: config.email.welcome
              });
            }
            return res.redirect('/');
          });
        })(req, res, next);
      }
    });

  });

  app.use(express.static(__dirname));

};
