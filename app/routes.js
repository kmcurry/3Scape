
module.exports = function(app, passport, async, crypto, nodemailer) {
//HOME PAGE(with login links) ======

    app.get('/create',isLoggedIn, function (req, res) {
        res.render('create',{
            user: req.user
        });
    });

    app.get('/logout', function (req, res) {
    	req.logout();
    	res.redirect('/');
    });

    app.get('/forgot', function(req, res) {
    	res.render('forgot.ejs', {
    		user: req.user
    	});
    });

    app.post('/forgot', function(req, res, next) {
      console.log("posting forgot");
      //console.log(req.body.email)
    	async.waterfall([
    		function(done) {
    			crypto.randomBytes(20, function(err, buf) {
    				var token = buf.toString('hex');
    				done(err, token);
    			});
    		},
    		function(token, done) {
          var User = require('../app/models/user');
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
    					user: '3Scape',
    					pass: 'V>j$PzPq4[f/t'      // CHANGE TO CONFIG
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
    					       req.flash('info', 'An email has been sent to ' + user.email + ' with further instructions.');
    					       done(err, 'done');
              }
    				});
    			}
    		], function(err) {
    			if (err) return next(err);
    			res.redirect('/forgot');
    		});
    	});

    app.get('/reset/:token', function(req, res) {
    	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    		if (!user) {
    			req.flash('error', 'Password reset token is invalid or has expired.');
    			return res.redirect('/forgot');
    		}
    		res.render('reset', {
    			user: req.user
    		});
    	});
    });

    app.post('/reset/:token', function(req, res) {
	  async.waterfall([
		function(done) {
		  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
			if (!user) {
			  req.flash('error', 'Password reset token is invalid or has expired.');
			  return res.redirect('back');
			}

			user.password = req.body.password;
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
		  var smtpTransport = nodemailer.createTransport('SMTP', {
			service: 'SendGrid',
			auth: {
			  user: '!!! YOUR SENDGRID USERNAME !!!',
			  pass: '!!! YOUR SENDGRID PASSWORD !!!'
			}
		  });
		  var mailOptions = {
			to: user.email,
			from: 'passwordreset@demo.com',
			subject: 'Your password has been changed',
			text: 'Hello,\n\n' +
			  'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
		  };
		  smtpTransport.sendMail(mailOptions, function(err) {
			req.flash('success', 'Success! Your password has been changed.');
			done(err);
		  });
		}
	  ], function(err) {
		res.redirect('/');
	  });
	});

    app.get('/', function (req, res) {
      res.render('index');
    });

    /*
    app.get('/create', function (req, res) {
      res.render('create');
    });
    */

    app.get('/classroom', function (req, res) {
      res.render('classroom.ejs')
    });

    // =====================================
    // PRIVACY ========
    // =====================================
    app.get('/privacy', function (req, res) {
        res.render('privacy.ejs')
    });

    // =====================================
    // NO WEB GL ========
    // =====================================
    app.get('/nowebgl', function (req, res) {
        res.render('NoWebGL.ejs')
    });

//Login ===========================
    app.get('/login', function (req, res) {
        //render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage')});
    });

    app.get('/forgot', function (req, res) {
        //render the page and pass in any flash data if it exists
        res.render('forgot.ejs', { message: req.flash('loginMessage')});
    });


//process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/create', //redirect to the secure profile section
        failureRedirect: '/login', //redirect to the signup page if there is an error
        failureFlash: true //allow flash messages
    }));

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

//Profile Section ===================
//We will want this protected so you have to be logged in to visit
//We will use route middleware to verify this(the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user //get the user out of session and pass to template
        });
    });

//Change the Scene ===================
    app.post('/changeScene', function (req, res) {
        var User = require('../app/models/user');
        User.findOne({'email': req.body.email}, function (err, user) {
            user.scene = req.body.scene;
            user.save();
        })
    });

//Logout ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/sitemap', function (req, res) {
        res.set('Content-Type', 'application/xml');
        var options = {
          root: __dirname + '/../'
        }
        res.sendFile('sitemap.xml', options);
    });

    app.get('/:scape', function (req, res) {
        if (req.params.scape) {
          var s = JSON.stringify(req.params.scape);
          console.log("scape = " + s);
          res.render('create', {scape: s});
        } else {
          console.log("no scape");
          res.render('create');
        }
    });
}
	// =====================================
	// PROJECTS ============================
	// =====================================

//	//Show all projects
//	main.get('/api/projects', function(req, res) {
//
//		// use mongoose to get all projects in the database
//		Project.find(function(err, projects) {
//
//			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
//			if (err)
//				res.send(err)
//
//			res.json(projects); // return all projects in JSON format
//		});
//	});
//
//	//Show a single project
//	// main.get('/api/projects/:project_id', function(req, res) {
//	// 	Project.findById(req.params.project_id, function(err, project) {
//	// 		if (err)
//	// 			res.send(err);
//	// 		res.json(project);
//	// 	});
//	// });
//
//	// create project and send back all projects after creation
//	main.post('/api/projects', function(req, res) {
//		currentUser = req.user
//		// create a project, information comes from AJAX request from Angular
//		Project.create({
//			_creator : currentUser._id,
//			title : req.body.title,
//		}, function(err, project) {
//			if (err)
//				res.send(err);
//			// get and return all the project after you create another
//			Project.find(function(err, projects) {
//				if (err)
//					res.send(err)
//				res.json(projects);
//			});
//		});
//	});
//
//	//update a project
//	// main.put('/api/projects/:project_id', function(req, res) {
//
//	// 	// use our project model to find the project we want
//	// 	Project.findById(req.params.project_id, function(err, project) {
//
//	// 		if (err)
//	// 			res.send(err);
//
//	// 		project.title = req.body.title; 	// update the projects info
//
//	// 		// save the bear
//	// 		project.save(function(err) {
//	// 			if (err)
//	// 				res.send(err);
//
//	// 			res.json({ message: 'Project updated!' });
//	// 		});
//
//	// 	});
//	// });
//
//	//delete a project
//	main.delete('/api/projects/:project_id', function(req, res) {
//		Project.remove({
//			_id : req.params.project_id
//		}, function(err, project) {
//			if (err)
//				res.send(err);
//
//			// get and return all the projects after you create another
//			Project.find(function(err, projects) {
//				if (err)
//					res.send(err)
//				res.json(projects);
//			});
//		});
//	});
//
//	app.use('/', main);
//};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/login');
}
