
module.exports = function(app, config) {
//HOME PAGE(with login links) ======

  var Creator = require('../app/models/creator');
  var Scape = require('../app/models/scape');

  app.get('/', isLoggedIn, function (req, res) {
    res.render('snappy');
  });

  app.get('/:scape?', function (req, res, next) {

    var s = "";
    var err = null;

    if (req.params.scape) {

      // check the database
      Scape.findOne({ scapeRef: req.params.scape }, function(err, scape) {
        if (scape) {
          if (req.isAuthenticated()) {
            res.status(200).render('snappy', {
              scape: scape.content,
              scapeRef: scape.scapeRef
            });
          } else {
            console.log("Unauthorized request for scape " + req.params.scape);
            res.redirect("/login");
          }

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
            case 'inclinedplanes':
            case 'inertia':
              {
                res.status(200).render('physicslessons', {
                  scape: s
                });
              }
              break;
              case 'adventuretime':
              {
                res.status(200).render('games', {
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
    res.redirect('http://3Scape.me/lesson-plans')
  });


  app.get('/nowebgl', function (req, res) {
      res.render('NoWebGL')
  });

  app.get('/opt-out', function (req, res) {
    res.render('opt-out')
  });

  app.get('/privacy', function (req, res) {
      res.render('privacy')
  });

  app.get('/profile', isLoggedIn, function (req, res) {

      if (req.user) {

        Scape.find({ creator : req.user.email }, {scapeRef : 1}, function(err, scapes) {
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
      // if time since date joined is > X and
      // the 3scaper hasn't registered a payment option
      // set the request payment flag

      // if req.user.joined is undefined then error

      var ONE_DAY = 3600000 * 24; /* ms */

      if (req.user.verified == false &&
        ((new Date()) - req.user.joined) > ONE_DAY) {
          console.log("Not Verified");
          return res.render('snappy', {
            verified: false,
            paymentKey: config.payment.pubKey
          });
      }
      else {
        return next();
      }
    }

    // if they aren't then set registration timer for anonymous
    res.status(200).render('snappy', {
      anonymous: true
    });

  }
};
