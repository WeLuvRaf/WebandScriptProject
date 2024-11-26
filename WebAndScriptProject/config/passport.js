// Load Passport's Local Strategy and bcrypt for password hashing
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

// Temporary storage for users (will use database later)
var users = [];

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
      var user = users.find(user => user.email === email);
      if (!user) {
        return done(null, false, { message: 'No user found' });
      }
      bcrypt.compare(password, user.password, function(err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    })
  );
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function(id, done) {
    var user = users.find(user => user.id === id);
    done(null, user);
  });
};
