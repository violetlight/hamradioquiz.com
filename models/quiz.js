var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Question = require('./question')
  , reduce = require('async/reduce')
  , q = require('q')
;


var Quiz = new Schema({
  user: { type: ObjectId, ref: 'User' },
  questions: [{ type: ObjectId, ref: 'Question' }],
  answered: [
    {
      q: { type: ObjectId, ref: 'Question' },
      a: { type: ObjectId, ref: 'Answer' },
      answeredCorrectly: Boolean
    },
  ],
});

Quiz.virtual('numRemaining').get(function() {
  return ((this.questions.length + this.answered.length) - this.answered.length);
});

Quiz.methods.numCorrect = function(callback) {
  reduce(this.answered, 0, function(memo, answer, cb) {
    if (answer['answeredCorrectly']) memo += 1;
    cb(null, memo);
  }, callback);
};

Quiz.virtual('numTotal').get(function() {
  return (this.questions.length + this.answered.length);
});

Quiz.virtual('isComplete').get(function() {
  return (this.questions.length === 0);
});


Quiz.statics.checkAnswer = function(questionId, answerId) {
  var deferred = q.defer();
  Question.findOne({ _id: questionId }, function(err, question) {
    deferred.resolve(question.correctAnswer == answerId);
  });
  return deferred.promise;
};

module.exports = mongoose.model('Quiz', Quiz);

