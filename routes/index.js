var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

//Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId

/*Definición de rutas de sesión*/

//formulario del login
router.get('/login', sessionController.new);
//Crear sesión
router.post('/login', sessionController.create);
//Destruir sesión
router.get('/logout', sessionController.destroy);

/* Get author page. */
router.get('/author', function(req, res) {
  res.render('author', { title: 'Francesc Muñoz', errors: []});
});

//Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);      //Para actualizar preguntas en bd
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);  //Para eliminar preguntas

//Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new); //accede al formulario de crear comentario, asociado al quiz :id.
router.post('/quizes/:quizId(\\d+)/comments', commentController.create); //crea una entrada en la tabla comments, asociada a :quizId en Quiz

module.exports = router;
