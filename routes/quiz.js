var express = require('express');
var router = express.Router();

var Q = require('q');

var each = require('async/each');
var asyncReduce = require('async/reduce');

var Answer = require('../models/answer');
var Question = require('../models/question');
var Quiz = require('../models/quiz');
var User = require('../models/user');


// Automatically handles next question or finishing quiz with each subsequent GET
router.get('/', function(req, res, next) {
  var ctx = { user: req.user };

  Quiz.findById(req.user.currentQuiz).exec()
  .then(function(currentQuiz) {
    if (currentQuiz.questions.length === 0) {
      return res.redirect('/quiz/results');
    } else {
      ctx['numQuestionsTotal'] = currentQuiz.numTotal;
      ctx['numCurrentQuestion'] = currentQuiz.answered.length + 1;
      return Question.findById(currentQuiz.questions[0]).exec()
        .then(function(question) {
          ctx['question'] = question;
          return Answer.find({ question: question._id }).exec();
        })
        .then(function(answers) {
          answers.sort(function(a, b) {
            if (a.letter < b.letter) {
              return -1;
            }
            if (b.letter < a.letter) {
              return 1;
            }
            return 0;
          });
          ctx['answers'] = answers;
        })
        .then(function() {
          return res.render('quiz/form', ctx);
        })
        .catch(function(err) { next(err); });
    }
  })
});


// AJAX POST to check if supplied answer was correct
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
  })
  .catch(function(err) {
    next(err);
  });
});


// Show quiz results
router.get('/results', function(req, res, next) {
  var ctx = { user: req.user };
  if (!req.user.currentQuiz) return res.redirect('/quiz');
  Q.all([
    Quiz.findById(req.user.currentQuiz).exec(),
    User.findById(req.user._id).exec()
  ])
  .spread(function(currentQuiz, user) {
    if (!currentQuiz.isComplete) return res.redirect('/quiz');
    user.update({ $set: { 'currentQuiz': null } })
    .then(function(dbWriteResult) {
      // if (dbWriteResult.err) or whatever
      ctx['quiz'] = currentQuiz;
      ctx['numCorrect'] = currentQuiz.answered.reduce(function(acc, val) {
        if (val.answeredCorrectly) acc += 1;
        return acc;
      }, 0);
      ctx['numQuestions'] = currentQuiz.answered.length;
      res.render('quiz/results', ctx);
    })
  });

});


module.exports = router;

