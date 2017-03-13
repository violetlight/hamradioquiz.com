var express = require('express');
var router = express.Router();

var Answer = require('../models/answer');
var Question = require('../models/question');
var Quiz = require('../models/quiz');
var User = require('../models/user');

router.get('/', function(req, res, next) {
  var ctx = { user: req.user };
  return res.render('index', ctx);
});

// POST to start quiz
router.post('/', function(req, res, next) {
  Question.find({ licenseType: req.body.licenseType }).exec(function(err, questions) {
    new Quiz({
      questions: questions,
      user: req.user._id,
    }).save(function(err, quiz) {
      User.update({ _id: req.user._id }, { $set: { currentQuiz: quiz._id } }, function(err, user) {
        return res.redirect('/quiz');
      });
    });
  })
  .catch(function(err) {
    next(err);
  });
});


module.exports = router;

