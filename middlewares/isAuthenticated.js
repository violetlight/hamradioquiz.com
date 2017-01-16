module.exports = function(req, res, next) {
  console.log(req.user);
  if (req.user) {
    return next();
  }

  res.redirect('/');
};

