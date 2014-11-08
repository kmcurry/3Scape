
module.exports = function(app, passport) {
//HOME PAGE(with login links) ======
    /*
    app.get('/',isLoggedIn, function (req, res) {
        res.render('index.ejs',{
            user: req.user
        }); //load the index.ejs file
    });
    */

    app.get('/', function (req, res) {
      console.log("rendering index");
          res.render('index');
    });

    app.get('/:scape', function (req, res) {
        if (req.params.scape) {
          var s = JSON.stringify(req.params.scape);
          console.log("scape = " + s);
          res.render('index', {scape: s});
        } else {
          console.log("no scape");
          res.render('index');
        }
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

//process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', //redirect to the secure profile section
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
        successRedirect: '/', //redirect to the secure profile section
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
