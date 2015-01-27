
module.exports = function(app, passport, async, crypto, nodemailer) {
//HOME PAGE(with login links) ======

  var User = require('../app/models/user');
  var config = require('../configLoader')(process.env.NODE_ENV || "local")

    app.get('/', checkForMobile);
    app.get('/mobile', function (req, res) {
      res.render('mobile');
    });

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
      console.log("MAIL USER: " + config.smtp_user);
    	res.render('forgot.ejs', {
    		user: req.user,
        	message: req.flash('info')
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
              req.flash('info', 'No account with that email address exists.');
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
        res.render('forgot.ejs', { message: req.flash('info')});
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

    // note: the next method param is passed as well
    function checkForMobile(req, res, next) {
      // check to see if the caller is a mobile device
      var isMobile = isCallerMobile(req);

      if (isMobile) {
        console.log("Going mobile");
        res.redirect('mobile');
      } else {
        // if we didn't detect mobile, call the next method, which will eventually call the desktop route
        res.render('index');
      }
    }

    // returns true if the caller is a mobile phone (not tablet)
    // compares the user agent of the caller against a regex
    // This regex comes from http://detectmobilebrowsers.com/
    function isCallerMobile(req) {
      var ua = req.headers['user-agent'].toLowerCase(),
      isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4));

      return !!isMobile;
    }
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
