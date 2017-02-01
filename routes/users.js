var express = require('express');
var router = express.Router();

var bcrypt = require('bcrypt');
var passport = require('passport');

var User = require('../models/user');

router.get('/login', function(req, res, next) {
  return res.render('users/login');
});

router.get('/logout', function(req, res, next) {
  req.logout();
  return res.redirect('/');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.redirect('/users/login');
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/sign-up', function(req, res, next) {
  return res.render('users/signup');
});

router.post('/sign-up', function(req, res, next) {
  new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email
  }).save(function() {
    return res.redirect('/users/login');
  });
});

router.get('/u/:userName', function(req, res, next) {
  var ctx = {user: req.user};
  return res.render('users/home', ctx);
});



module.exports = router;

