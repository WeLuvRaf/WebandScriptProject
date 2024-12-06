var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

const { users } = require('../userStore'); 

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
      var user = users.find((user) => user.email === email);
      if (!user) {
        return done(null, false, { message: 'No user found' });
      }
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    console.log('Serializing user:', user.id);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('Deserializing user with ID:', id);
    var user = users.find((user) => user.id === id);
    if (user) {
      done(null, user);
    } else {
      done(new Error('User not found'));
    }
  });
};
