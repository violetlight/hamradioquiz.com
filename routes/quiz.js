var express = require('express');
var router = express.Router();

var Q = require('q');

var each = require('async/each');
var asyncReduce = require('async/reduce');

var Answer = require('../models/answer');
var Question = require('../models/question');
var Quiz = require('../models/quiz');
var User = require('../models/user');


router.get('/', function(req, res, next) {
  if (!req.user.currentQuiz) return res.render('quiz/start');
  console.log(req.user.currentQuiz);

  var ctx = {};
  Question.findById(req.user.currentQuestion).exec()
  .then(function(question) {
    ctx['question'] = question;
    return Answer.find({ question: question._id }).exec();
  })
  .then(function(answers) {
    ctx['answers'] = answers;
  })
  .then(function() {
    return res.render('quiz/form', ctx);
  })
  .catch(function(err) {
    next(err);
  });

});


router.post('/', function(req, res, next) {
});


router.post('/checkAnswer', function(req, res, next) {
  Q.all([
    Quiz.checkAnswer(req.user.currentQuestion, req.body.selectedAnswer),
    Question.findById(req.user.currentQuestion).exec()
  ]).spread(function(isCorrect, question) {
    Quiz.findById(req.user.currentQuiz).update({
      $pull: { 'questions': { _id: req.user.currentQuestion } },
      $push: { 'answered': { q: req.user.currentQuestion, a: req.body.selectedAnswer, answeredCorrectly: isCorrect } }
    }).then(function(currentQuiz) {
      return res.json({
        isCorrect: isCorrect,
        correctAnswer: question.correctAnswer,
        chosenAnswer: req.body.selectedAnswer
      });
    });
  });
});


router.post('/start', function(req, res, next) {
  Question.find({ licenseType: req.body.licenseType }).exec(function(err, questions) {
    new Quiz({
      questions: questions,
      user: req.user._id,
      inProgress: true
    }).save(function(err, quiz) {
      User.update({ _id: req.user._id }, { $set: { currentQuiz: quiz._id, currentQuestion: quiz.questions[0]._id } }, function(err, user) {
        return res.redirect('/quiz');
      });
    });
  });

});


module.exports = router;

