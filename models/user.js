var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose')
  , ObjectId = Schema.ObjectId;


var User = new Schema({
  username: String,
  password: String
});


User.methods.validPassword = function(password) {
  return (password === this.password);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

