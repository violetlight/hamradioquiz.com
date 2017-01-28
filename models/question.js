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
  licenseType: { type: String, enum: ['technician', 'general', 'amateur-extra'] }
});

module.exports = mongoose.model('Question', questionSchema);

