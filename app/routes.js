const passport    = require('passport');

module.exports = function (app, db) {
  
    function ensureAuthenticated(req, res, next) {
      if (req.isAuthenticated()) {
          return next();
      }
      res.redirect('/');
    };

    app.route('/auth/github')
      .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
      .get(passport.authenticate('github', { failureRedirect: '/' }), (req,res) => {
          req.session.user_id = req.user.id;
          // console.log('redirect to chat...')
          res.redirect('/chat');
      });

    app.route('/')
      .get((req, res) => {
        res.render(process.cwd() + '/views/pug/index');
      });

    app.route('/chat')
      .get(ensureAuthenticated, (req, res) => {
        // req.user is the same as the returned doc.value inside auth.js:findAndModify()
        // console.log(req.user);
           res.render(process.cwd() + '/views/pug/chat', {user: req.user});
      });

    app.route('/logout')
      .get((req, res) => {
          req.logout();
          res.redirect('/');
      });

  // try insert. for debug use
  app.get("/insertone", function(req, res) {
    // Insert a single document
    db.collection("chatusers").insertOne({ username: "Santa" }, function(err, r) {
      if (err) {
        console.log("error inserting new record.",err);
        res.send({ insertone: "error" });
      } else {
        console.log("insert successful.");
        res.send({ insertone: "successful" });
      }
    });
  });
  
    app.use((req, res, next) => {
      res.status(404)
        .type('text')
        .send('Not Found');
    });
  
}