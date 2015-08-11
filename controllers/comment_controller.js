var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
//instancia el formulario de crear comentarios
exports.new = function(req, res){
  res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
//guarda el comentario en la tabla comment de la base de datos y luego redireccióna a la vista con la lista de preguntas
exports.create = function(req, res){
  var comment = models.Comment.build({texto: req.body.comment.texto, QuizId: req.params.quizId});
  //La relación belognsTo(...) de Commment a Quiz añade un parámetro :quizId adicional en cada elemento de la tabla Comments que indica el Quiz asociado.
  //Se utiliza el nombre :quizId definido en la ruta en routes/index.js, salvo que se indique otro nombre
  comment
  .validate()
  .then(
    function(err){
      if(err){
        res.render('comments/new.ejs', {comment: comment, errors: err.errors});
      } else{
        comment //save: guarda en DB campo texto de comment
        .save()
        .then ( function(){ res.redirect('/quizes/'+req.params.quizId)})
      }                     //res.redirect: Redirección HTTP a lista de preguntas
    }
  ).catch(function(error){next(error)});
};
