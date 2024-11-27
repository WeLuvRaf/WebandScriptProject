var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  console.log('Rendering Index Page, User:', req.user);
  res.render('index', { title: 'To-Do List', user: req.user });
});


module.exports = router;

