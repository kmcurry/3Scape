module.exports = function(app, async, crypto, nodemailer, passport) {

  var User = require('../../../app/models/user');
  var config = require('../../../configLoader')(process.env.NODE_ENV || "local")

  app.get('/forgot', function(req, res) {
    res.render('forgot.ejs', {
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
        var smtpTransport = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: config.smtp_user,
            pass: config.smtp_pass
          }
        });
        var mailOptions = {
          from: 'kevin@3Scape.me',
          to: user.email,
          subject: '3Scape Password Reset',
          text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account. \n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err, info) {
          if (err) {
            console.log(err);
          }
          else {
            req.flash('success', 'An email has been sent to ' + user.email + ' with further instructions.');
            done(err, 'done');
          }
        });
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
    res.render('login.ejs', { message: req.flash('loginMessage')});
  });

  // POST
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/create', //redirect to the secure profile section
    failureRedirect: '/login', //redirect to the signup page if there is an error
    failureFlash: true //allow flash messages
  }));

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // RESET

  app.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('info', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      console.log("Date now at post 1: " + Date.now());

      res.render('reset', {
        token: user.resetPasswordToken,
        message: req.flash('info')
      });
    });
  });

  app.post('/reset/:token', function(req, res) {

    async.waterfall([
      function(done) {

        User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('info', 'Password reset token is invalid or has expired.');
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
        var smtpTransport = nodemailer.createTransport({
          service: 'SendGrid',
          auth: {
            user: config.smtp_user,
            pass: config.smtp_pass
          }
        });
        var mailOptions = {
          from: 'kevin@3Scape.me',
          to: user.email,
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err, info) {
          if (err) {
            console.log(err);
          }
          else {

            req.flash('loginMessage', 'Success! Your password was changed. Please log in.')
            done(err, 'done');

          }
        });
      }
      ], function(err) {
        if (err) return next(err);
        res.redirect('/login');
      });
    });

  //SignUp============================
  app.get('/signup', function (req, res) {
    //render the page and pass any flash data if it exists
    res.render('signup.ejs', {message: req.flash('signupMessage')});
  });

  //process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/create', //redirect to the secure profile section
    failureRedirect: '/signup', //redirect to the signup page if there is an error
    failureFlash: true //allow flash messages
  }));
};
