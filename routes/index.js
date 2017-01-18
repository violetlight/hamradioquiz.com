var express = require('express');
var router = express.Router();

var Answer = require('../models/answer');
var Question = require('../models/question');

/* GET home page. */
router.get('/', function(req, res, next) {
  var ctx = { title: 'Express' };
  ctx['user'] = req.user;
  return res.render('index', ctx);
});

module.exports = router;

