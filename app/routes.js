
module.exports = function(app, config) {
//HOME PAGE(with login links) ======

  var Creator = require('../app/models/creator');
  var Scape = require('../app/models/scape');

  app.get('/', function (req, res) {
    res.render('snappy');
  });

  app.get('/:scape?', function (req, res, next) {

    var s = "";
    var err = null;

    if (req.params.scape) {

      // check the database
      Scape.findOne({ _id: req.params.scape }, function(err, scape) {
        if (scape) {
          if (req.isAuthenticated()) {
            res.status(200).render('snappy', {
              scape: scape.content,
              scapeId: req.params.scape
            });
          } else (console.log("You must be logged in"));

        } else {
          s = JSON.stringify(req.params.scape).toLowerCase();
          var s1 = s.replace(/\"/g, "");  // strip quotes for switch

          switch(s1) {
            case '2dvs3d' :
            case 'egypt' :
            case 'twostroke' :
            case 'undersea':
              {
                res.status(200).render('demo', {
                  scape: s,
                  needsViewControls: true
                });
              }
              break;
            case 'entymology' :
            case 'hi5':
            case 'highfive':
            case 'facepalm':
              {
                res.status(200).render('demo', {
                  scape: s
                });
              }
              break;
            default:
              {
                return next('route');
              }
              break;
          }
        }

      });

    } else {
      err = new Error();
      err.status = 404;
      return next(err);
    }


  });

  app.get('/classroom', function (req, res) {
    res.render('classroom')
  });

  app.get('/nowebgl', function (req, res) {
      res.render('NoWebGL')
  });

  app.get('/privacy', function (req, res) {
      res.render('privacy')
  });

  app.get('/profile', isLoggedIn, function (req, res) {

      if (req.user) {

        Scape.find({ creator : req.user.email }, {_id : 1}, function(err, scapes) {
          if (err) {
            return err;
          }

          if (scapes) {
            res.render('profile', {
                creator: req.user,
                scapes: scapes
            });
          }

        });

      } else res.render('login');
  });

  app.get('/sitemap', function (req, res) {
      res.set('Content-Type', 'application/xml');
      var options = {
        root: __dirname + '/../'
      }
      res.sendFile('sitemap.xml', options);
  });

  app.get('/videos', function (req, res) {
      res.render('videos')
  });

  app.use(function(req, res, next){
    console.log("rendering 404");
    res.status(404).render('404');
  });

  // route middleware to make sure a creator is logged in
  function isLoggedIn(req, res, next) {

    // redirect to path after verifying
    if (req.path !== undefined) {
      req.session.returnTo = req.path;
    }

    // if creator is authenticated in the session, carry on
    if (req.isAuthenticated()) {
      return next();
    }

    // if they aren't redirect them to the login page
    res.redirect('/login');
  }
};
