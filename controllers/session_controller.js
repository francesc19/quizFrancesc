//MW de autorización de accesos HTTP restringidos -- solo deja continuar si el usuario se ha autenticado correctamente.
exports.loginRequired = function(req, res, next){
  if (req.session.user){
    next();
  } else{
    res.redirect('/login');
  }
};

//Get /login -- Formulario de login
exports.new = function(req, res) {
  //Cargamos los errores o vacío si no está inicializada
  var errors = req.session.errors || {};
  req.session.errors = {};

  res.render('sessions/new', {errors: errors});
};

//POST /login -- Crear la sesión
exports.create = function(req, res){
  //Guardamos variables de login y su password
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user){
    //Si hay error retornamos mensajes de error de sesión
    if (error){
      req.session.errors = [{"message": 'Se ha producido un error: '+error}];
      res.redirect("/login");
      return;
    }
    //Crear req.session.user y guardar campos id y username
    //La sesión se define por la existencia de: req.session.user
    req.session.user = {id:user.id, username:user.username};
    //Se guarda la hora de inicio de sesión en req.session.time además creamos la variable boleana req.session.autoLogout para el mensaje de desconexión
    req.session.time = new Date().getTime();
    req.session.autoLogout = false;
    //Redirección a path anterior a login
    res.redirect(req.session.redir.toString());
  });
};

//DELETE /logout -- Destruir sesión
exports.destroy = function(req, res){
  delete req.session.user;
  if (req.session.autoLogout){
    //Si el boolean de login esta en true me redirige a la página de login enseñandonos el error.
    res.redirect('/login');
  }else{
    //Redirect a path anterior a login
    res.redirect(req.session.redir.toString());
  }
};
