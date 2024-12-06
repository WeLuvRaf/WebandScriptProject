var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcryptjs');

const { users } = require('../userStore'); // Import shared users array


// Render Login Page
router.get('/login', (req, res) => {
    res.render('login'); // Ensure this route is defined
  });
  
// Render Register Page
router.get('/register', (req, res) => {
  console.log('Rendering Register Page');
  res.render('register', { errors: [], email: '', password: '', password2: '' }); // Pass default values
});

// Update Register POST Route to handle Errors
router.post('/register', (req, res) => {
  const { email, password, password2 } = req.body;
  let errors = [];

  console.log('Registering user:', email);

  if (!email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (users.find((user) => user.email === email)) {
    errors.push({ msg: 'Email is already registered' });
  }

  if (errors.length > 0) {
    console.log('Rendering Register Page with errors:', errors);
    return res.render('register', {
      errors,
      email, // Pass the submitted email back to the form
      password,
      password2,
    });
  }

  // Hash password and store the user
  const hashedPassword = bcrypt.hashSync(password, 10);
  users.push({ id: users.length + 1, email, password: hashedPassword });
  console.log('User registered successfully:', email);

  req.flash('success_msg', 'You are now registered and can log in.');
  res.redirect('/auth/login');
});



// Login User
router.post('/login', (req, res, next) => {
    console.log('Login attempt for:', req.body.email);
  
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Error during authentication:', err);
        return next(err);
      }
      if (!user) {
        console.log('Login failed:', info.message);
        req.flash('error_msg', info.message);
        return res.redirect('/auth/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error logging in user:', err);
          return next(err);
        }
        console.log('User logged in successfully:', user.email);
        req.flash('success_msg', 'Welcome back, ' + user.email + '!');
        return res.redirect('/');
      });
    })(req, res, next);
  });
  
// Logout User
router.get('/logout', (req, res, next) => {
    console.log('Logout attempt for user:', req.user ? req.user.email : 'No user logged in');
  
    if (!req.user) {
      console.log('No user is logged in to log out.');
      req.flash('error_msg', 'You are not logged in.');
      return res.redirect('/auth/login');
    }
  
    req.logout(function (err) {
      if (err) {
        console.error('Error during logout:', err);
        return next(err); // Handle errors during logout
      }
      console.log('User logged out successfully');
      req.flash('success_msg', 'You are logged out');
      res.redirect('/auth/login'); // Redirect to login page
    });
  });
  

module.exports = router;
