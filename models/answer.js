var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var answerSchema = new Schema({
  question: {type: ObjectId, ref: 'Question'},
  body: String,
  letter: String
});

module.exports = mongoose.model('Answer', answerSchema);

