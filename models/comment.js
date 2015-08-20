//Definición del modelo de Comment con validación

module.exports = function (sequelize, DataTypes){
  return sequelize.define('Comment',
    { texto: {
       type: DataTypes.STRING,
       validate: { notEmpty: {msg: "-> Falta Comentario"}}
     },
     //Añadimos la columna publicar en la tabla comentarios
     publicado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      classMethods: {
        countUnpublished: function() {
          return this.aggregate('QuizId', 'count', { 'where': { 'publicado': false }}).then('success', function(count){
            return count;
          })
        },
        countCommentedQuizes: function() {
          return this.aggregate('publicado', 'count', { 'distinct': true}).then('success',function(count){
            return count;
          })
        }
      }
    });
};
