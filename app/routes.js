express = require('express');
var mongoose = require('mongoose');
var User = require('./models/user');
var Project = require('./models/project');


module.exports = function(app, passport) {
	var main = express.Router();
	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	main.get('/', function(req, res) {
		res.render('index.ejs', { 
			user: req.user
		}); // load the index.ejs file
	});

	// =====================================
	// NO WEB GL ========
	// =====================================
	main.get('/nowebgl', function(req, res) {
		res.render('NoWebGL.ejs')
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	main.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') }); 
	});

	// process the login form
	main.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : "Hello!" // allow flash messages
	}));

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	main.get('/signup', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	main.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	main.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	main.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// =====================================
	// PROJECTS ============================
	// =====================================

	//Show all projects
	main.get('/api/projects', function(req, res) {

		// use mongoose to get all projects in the database
		Project.find(function(err, projects) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(projects); // return all projects in JSON format
		});
	});

	//Show a single project
	// main.get('/api/projects/:project_id', function(req, res) {
	// 	Project.findById(req.params.project_id, function(err, project) {
	// 		if (err)
	// 			res.send(err);
	// 		res.json(project);
	// 	});
	// });

	// create project and send back all projects after creation
	main.post('/api/projects', function(req, res) {
		currentUser = req.user
		// create a project, information comes from AJAX request from Angular
		Project.create({
			_creator : currentUser._id,
			title : req.body.title,
		}, function(err, project) {
			if (err)
				res.send(err);
			// get and return all the project after you create another
			Project.find(function(err, projects) {
				if (err)
					res.send(err)
				res.json(projects);
			});
		});
	});

	//update a project
	// main.put('/api/projects/:project_id', function(req, res) {

	// 	// use our project model to find the project we want
	// 	Project.findById(req.params.project_id, function(err, project) {

	// 		if (err)
	// 			res.send(err);

	// 		project.title = req.body.title; 	// update the projects info

	// 		// save the bear
	// 		project.save(function(err) {
	// 			if (err)
	// 				res.send(err);

	// 			res.json({ message: 'Project updated!' });
	// 		});

	// 	});
	// });

	//delete a project
	main.delete('/api/projects/:project_id', function(req, res) {
		Project.remove({
			_id : req.params.project_id
		}, function(err, project) {
			if (err)
				res.send(err);

			// get and return all the projects after you create another
			Project.find(function(err, projects) {
				if (err)
					res.send(err)
				res.json(projects);
			});
		});
	});

	app.use('/', main);
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}