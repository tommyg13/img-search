var express = require('express');
var path = require('path');
var logger = require('morgan');
var index = require('./routes/index');
var users = require('./routes/users');
var mongo = require("mongodb").MongoClient;
var app = express();
require("dotenv").config();
var url=process.env.MONGOLAB_URI;

mongo.connect(url,function(err,db){
  
  if(err){throw err;}
  else{
   console.log('Successfully connected to MongoDB.');
  }
  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

index (app, db);
app.use('/users', users);

 db.createCollection("images", {
    capped: true,
    size: 5242880,
    max: 5000
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
});
module.exports = app;
