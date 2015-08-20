var models = require('../models/models.js');
var Sequelize = require('sequelize');

//Creamos variables que usaremos en el controlador
var statistics = {
  questions:0,
  comments:0,
  unpublished:0,
  published:0
};

exports.calculate = function (req, res, next){

  models.Quiz.count()
  .then( function (questions){   //número de preguntas
    statistics.questions = questions;
    return models.Comment.count(); //se llama al siguiente método donde nos dirá los comentarios
  })
  .then( function (comments){    //número de comentarios
    statistics.comments = comments;
    return models.Comment.countUnpublished(); //se llama al método donde nos dirá los comentarios no publicados
  })
  .then( function (unpublished){   //número de comentarios sin publicar
    statistics.unpublished = unpublished;
    return models.Comment.countCommentedQuizes(); //se llama al último método que nos dirá los comentarios publicados
  })
  .then( function (published){     //número de preguntas con comentarios
    statistics.published = published;
  })
  .catch(function (error) { next(error) })
  .finally(function (){ next()});

};

//GET /quizes/statistics
exports.show = function(req, res){
  res.render('quizes/statistics', { statistics: statistics, errors: [] });
};
