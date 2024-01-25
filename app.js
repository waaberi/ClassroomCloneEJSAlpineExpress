const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { createClient } = require("@libsql/client");
const users_model = require("./models_sql/users");
require("dotenv").config();
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

let config;

if (process.env.NODE_ENV === "development") {
  console.log("Development environment!")
  config = {
    url: process.env.DB_LINK_DEV,
  };
} else {
  console.log("Production environment!")
  config = {
    url: process.env.DB_LINK_PROD,
    authToken: process.env.DB_PROD_KEY
  };
}

const new_db = createClient(config);

const user_table = new users_model(new_db);

user_table.migrate();

app.use(function (req, res, next) { // sqlite3
  req.db = { user_table }
  next();
});

app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/index'));
app.use('/dashboard', require('./routes/dashboard'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (process.env.NODE_ENV === "development") {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  } else res.render('404');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
