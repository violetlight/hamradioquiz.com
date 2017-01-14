var express = require('express');
var router = express.Router();

var Quiz = require('../models/quiz');

/* GET home page. */
router.get('/start', function(req, res, next) {
  var ctx = { title: 'Express' };
  res.render('quiz/start', ctx);
});

module.exports = router;

