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
  var ctx = {};
  if (!req.user.currentQuiz) return res.render('quiz/start');

  Quiz.findById(req.user.currentQuiz).exec()
  .then(function(currentQuiz) { return Question.findById(currentQuiz.questions[0]).exec(); })
  .then(function(question) {
    ctx['question'] = question;
    return Answer.find({ question: question._id }).exec();
  })
  .then(function(answers) { ctx['answers'] = answers; })
  .then(function() { return res.render('quiz/form', ctx); })
  .catch(function(err) { next(err); });
});


router.post('/checkAnswer', function(req, res, next) {
  Quiz.findById(req.user.currentQuiz).exec()
  .then(function(currentQuiz) {
    var answeredQuestion = currentQuiz.questions[0];
    Q.all([
      Quiz.checkAnswer(answeredQuestion, req.body.selectedAnswer),
      Question.findById(answeredQuestion).exec()
    ]).spread(function(isCorrect, question) {
      currentQuiz.update({
        $pull: { 'questions': answeredQuestion },
        $push: { 'answered': { q: answeredQuestion, a: req.body.selectedAnswer, answeredCorrectly: isCorrect } }
      }).then(function(dbWriteResult) {
        return res.json({
          isCorrect: isCorrect,
          correctAnswer: question.correctAnswer,
          chosenAnswer: req.body.selectedAnswer
        });
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
      User.update({ _id: req.user._id }, { $set: { currentQuiz: quiz._id } }, function(err, user) {
        return res.redirect('/quiz');
      });
    });
  });
});


module.exports = router;

