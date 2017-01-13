var mongoose = require('mongoose')
  , bcrypt = require('bcrypt')
  , Schema = mongoose.Schema
  , passportLocalMongoose = require('passport-local-mongoose')
  , ObjectId = Schema.ObjectId;

const SALT_WORK_FACTOR = 10;


var User = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

User.pre('save', function(next) {
  var user = this;

  // This pre-save method is called for _every_ save, so if it's
  // a save where the password is not modified, just skip this logic entirely.
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });

});


User.methods.validPassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);

