var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticsController = require('../controllers/statistics_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId
//Para que el comentario este preparado para cuando se realice la acción publish
router.param('commentId', commentController.load); //autoload :commentId

/****************Definición de rutas de sesión*************/
//formulario del login
router.get('/login', sessionController.new);
//Crear sesión
router.post('/login', sessionController.create);
//Destruir sesión
router.get('/logout', sessionController.destroy);

/****************** Get página de autor*******************/
router.get('/author', function(req, res) {
  res.render('author', { title: 'Francesc Muñoz', errors: []});
});

/*---------------- Get página estadisticas---------------------*/
router.get('/quizes/statistics', statisticsController.calculate, statisticsController.show);



//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
//Añadiendo sessionController.loginRequired delante de los controladores indicamos que los accesos necesitan autorización.
//Se impide, por tanto, que usuarios sin sesión ejecuten opciones de crear, editar o borrar recursos.
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);      //Para actualizar preguntas en bd
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);  //Para eliminar preguntas

/*******************************Definición de rutas de comentarios****************************************************/
//Accede al formulario de crear comentario, asociado al quiz :id.
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
//Crea una entrada en la tabla comments, asociada a :quizId en Quiz
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
//Publicación de comentario "x" en pregunta "y" además se añade obligación de que el usuario para publicar comentario debe estar autenticado
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

module.exports = router;
