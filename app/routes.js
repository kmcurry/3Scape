
module.exports = function(app, config) {
//HOME PAGE(with login links) ======

  var User = require('../app/models/user');

  app.get('/', isLoggedIn, function (req, res) {
    res.render('snappy');
  });

  app.get('/:scape?', function (req, res, next) {

    var s = "";
    var err = null;

    if (req.params.scape) {
      s = JSON.stringify(req.params.scape);
      var s1 = s.replace(/\"/g, "");

      switch(s1) {
        case "2Dvs3D" :
        case "Egypt" :
        case "egypt" :
        case "Entymology" :
        case "entymology" :
        case "Physics" :
        case "physics" :
        case "Two-stroke" :
        case "two-stroke" :
          {
            res.status(200).render('demo', {
              scape: s,
              needsViewControls: true
            });
          }
          break;
        case "hi5":
        case "Hi5":
          {
            {
              res.status(200).render('demo', {
                scape: s
              });
            }
          }
        default:
          {
            return next('route');
          }
          break;
      }
    } else {
      err = new Error();
      err.status = 404;
      return next(err);
    }


  });

  app.get('/classroom', function (req, res) {
    res.render('classroom')
  });

  app.get('/privacy', function (req, res) {
      res.render('privacy')
  });


  app.get('/nowebgl', function (req, res) {
      res.render('NoWebGL')
  });

  app.get('/profile', isLoggedIn, function (req, res) {
      res.render('profile', {
          user: req.user //get the user out of session and pass to template
      });
  });

  app.get('/sitemap', function (req, res) {
      res.set('Content-Type', 'application/xml');
      var options = {
        root: __dirname + '/../'
      }
      res.sendFile('sitemap.xml', options);
  });

  app.use(function(req, res, next){
    //res.send(404, 'Sorry cant find that!');
    res.status(404).render('404');
  });

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

    if (req.path !== undefined)
      req.session.returnTo = req.path;

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the login page
    res.redirect('/login');
  }
};
