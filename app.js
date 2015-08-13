var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
//incluimos el metodo Override para poder updatear las preguntas
var methodOverride = require('method-override');
//Se importa el paquete express-session instalado con npm
var session = require('express-session');

var routes = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(partials());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015')); //Cookieparser: añaadir semilla 'Quiz 2015' para cifrar la cookie
//instala MW session
app.use(session());
//añadimos el metodo override para poder actualizar las preguntas (editarlas)
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

//Helpers dinamicos:
app.use(function(req, res, next){
  //guardar path en session.redir para despues de login
    if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
    //guarda la ruta de cada solicitud HTTP en la variable session.redir para poder redireccionar a la vista anterior después de hacer login o logout.
  }

  //Hacer visible req.session en las vistas
  res.locals.session = req.session;
  /*Se implementa la expiración de sesión por tiempo*/
  //Si el usuario está más de dos minutos sin hacer un get HTTP entonces...
  if (req.session.time){
    //Se crea variable para saber el tiempo actual
    var lastTime = new Date().getTime();
    //Se crea variable para saber la diferencia de tiempo entre la actual y la última del usuario
    var diff = lastTime - req.session.time;
    //Si la diferencia es mayor a dos minutos
    if (diff > 120000){ //120000 viene de 2*60*1000
      //Se borra el último tiempo de sesión del usuario
      delete req.session.time;
      //Se activa el boolean que nos indica que si hay logout
      req.session.autoLogout = true;
      res.redirect("/logout");
    }else{
      //Si no se ha superado los 2 minutos la sesión del usuario pasa a ser la última consultada
      req.session.time = lastTime;
    }
  };
  //copia la sesión que está accesible en req.session en res.locals.session para que esté accesible en las vistas.
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
