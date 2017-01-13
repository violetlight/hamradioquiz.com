var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var passport = require('passport');

var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.redirect('/users/login');
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/users/u/' + user.username);
    });
  })(req, res, next);
});

router.get('/sign-up', function(req, res, next) {
  res.render('signup');
});

router.post('/sign-up', function(req, res, next) {
  new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }).save(function() {
    res.redirect('/');
  });
});

router.get('/u/:userName', function(req, res, next) {
  var ctx = {user: req.user};
  res.render('home', ctx);
});



module.exports = router;

