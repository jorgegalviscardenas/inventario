/**
* Controla la autenticacion
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.autenticar = function(request, response)
{
  var user = require('../models/Usuario.js')();
  user.auth(request, function(error, data)
  {
    if (error)
    {
      response.status(401).send({error: error.message});
    }
    else {
      response.status(200).send(data.token);
    }
  });
}
