var express = require('express');
var router = express.Router();

var each = require('async/each');
var asyncReduce = require('async/reduce');

var Answer = require('../models/answer');
var Question = require('../models/question');
var Quiz = require('../models/quiz');
var User = require('../models/user');


router.get('/', function(req, res, next) {
  if (!req.user.currentQuiz) return res.render('quiz/start');
  Question.findOne({ _id: req.user.currentQuestion }, function(err, question) {
    if (err) next(err);
    Answer.find({ question: question._id }, function(err, answers) {
      if (err) next(err);
      var ctx = {
        question: question,
        answers: answers
      };
      return res.render('quiz/form', ctx);
    });
  });
});


router.post('/', function(req, res, next) {
});


router.post('/checkAnswer', function(req, res, next) {
  // pop req.user.currentQuestion from req.user.currentQuiz.questions
  Quiz.findOne({ _id: req.user.currentQuiz }, function(err, currentQuiz) {
    currentQuiz.questions.remove(req.user.currentQuestion);
    Quiz.checkAnswer(req.user.currentQuestion, req.body.selectedAnswer, function(isCorrect) {
      Question.findOne({ _id: req.user.currentQuestion }, function(err, question) {
        var ajaxResponseData = { isCorrect: isCorrect, correctAnswer: question.correctAnswer, chosenAnswer: req.body.selectedAnswer };
        // add req.user.currentQuestion to req.user.answeredQuestions, with chosen answer and result
        currentQuiz.answered.push({
          q: req.user.currentQuestion,
          a: req.body.selectedAnswer,
          answeredCorrectly: isCorrect
        });
        currentQuiz.save(function(err, quiz) {
          if (err) res.send(err);
          // If quiz is complete...
          if (currentQuiz.questions.length === 0) {
            currentQuiz.inProgress = false;
            currentQuiz.save(function() {
              asyncReduce(currentQuiz.answered, 0, function(memo, answer, cb) {
                if (answer.answeredCorrectly) memo += 1;
                cb(null, memo);
              }, function(err, result) {
                req.user.currentQuiz = null;
                req.user.save(function(err) {
                  return res.json(ajaxResponseData);
                });
              });
            });
          } else {
          // update req.user.currentQuestion to req.user.currentQuiz.questions[0]
            User.update({ _id: req.user._id }, {$set: { currentQuestion: currentQuiz.questions[0] }},function(err, user) {
              // find out what happens here when currentQuiz.questions[0] does not exist anymore
              // if array is empty, redirect to /quiz/results to show results etc.
              // otherwise redirect to '/quiz'
              return res.json(ajaxResponseData);
            });
          }
        });
      });
    });
  });

});

router.post('/start', function(req, res, next) {
  Question.find({ licenseType: req.body.licenseType }).limit(5).exec(function(err, questions) {
    new Quiz({
      questions: questions,
      user: req.user._id,
      inProgress: true
    }).save(function(err, quiz) {
      User.update({ _id: req.user._id }, { $set: { currentQuiz: quiz._id, currentQuestion: quiz.questions[0]._id } }, function(err, user) {
        res.redirect('/quiz');
      });
    });
  });

});


module.exports = router;

