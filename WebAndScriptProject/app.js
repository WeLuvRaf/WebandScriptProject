var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sample data to mimic database
let toDoList = [
  { id: 1, title: 'Buy groceries', description: 'Milk, Bread, Eggs', status: 'Active' },
  { id: 2, title: 'Read a book', description: 'Read at least 30 pages', status: 'Completed' },
];

// Home route to render to-do list
app.get('/', (req, res) => {
  res.render('index', { toDoList });
});

// Create a new to-do item
app.post('/add', (req, res) => {
  const { title, description } = req.body;
  const newToDo = { id: Date.now(), title, description, status: 'Active' };
  toDoList.push(newToDo);
  res.redirect('/');
});

// Update a to-do item's status
app.post('/update/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = toDoList.find((task) => task.id === id);
  if (item) item.status = item.status === 'Active' ? 'Completed' : 'Active';
  res.redirect('/');
});

// Delete a to-do item
app.post('/delete/:id', (req, res) => {
  const id = parseInt(req.params.id);
  toDoList = toDoList.filter((task) => task.id !== id);
  res.redirect('/');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
