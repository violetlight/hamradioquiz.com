var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var Quiz = new Schema({
  user: { type: ObjectId, ref: 'User' },
  questions: [{ type: ObjectId, ref: 'Question' }],
  questionsAnswered: [
    {
      q: { type: ObjectId, ref: 'Question' },
      a: { type: ObjectId, ref: 'Answer' }
    },
  ],
  inProgress: Boolean,
  
});
