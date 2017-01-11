var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var questionSchema = new Schema({
  correctAnswer: {type: ObjectId, ref: 'Answer'},
  body: String,
  questionNumber: String,
  section: String,
  subSection: String,
  fccSection: String,
  licenseType: String
});

module.exports = mongoose.model('Question', questionSchema);

