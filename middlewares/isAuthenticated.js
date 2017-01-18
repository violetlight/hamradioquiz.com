module.exports = function(req, res, next) {
  if (req.user) {
    return next();
  }
  // if not req.user, redirect to login
  res.redirect('/users/login');
};

