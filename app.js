var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');
var expressValidator = require('express-validator');
var expressSession = require('express-session');

var routes = require('./routes/index');
var taxiAmigoRoutes = require('./routes/TaxiAmigo');

var partialsPath = path.join(__dirname, '/views/layouts');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    secret: 'meny',
    saveUninitialized: false,
    resave: false
}));


app.use('/', routes);
app.use('/TaxiAmigo', taxiAmigoRoutes);
//app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.render('global/error', {
      message: 'Este URL no es válido'
    });
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('global/error', {
      message: 'Este URL no es válido'
    });
});

module.exports = app;
