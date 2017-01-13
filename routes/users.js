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

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/',
    failureRedirect: '/totalfailure'
  }
));

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

module.exports = router;

