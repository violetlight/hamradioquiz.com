var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , Question = require('./question');


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
  inProgress: Boolean,
});

Quiz.virtual('numRemaining').get(function() {
  return ((this.questions.length + this.answered.length) - this.answered.length);
});

Quiz.virtual('numTotal').get(function() {
  return (this.questions.length + this.answered.length);
});


Quiz.statics.checkAnswer = function(questionId, answerId, cb) {
  Question.findOne({ _id: questionId }, function(err, question) {
    console.log(question.correctAnswer);
    console.log(answerId);
    cb(question.correctAnswer == answerId);
  });
};

module.exports = mongoose.model('Quiz', Quiz);

