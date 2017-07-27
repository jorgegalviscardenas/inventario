/**
* Controla la insercción de un nuevo usuario
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarUsuario = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var usuario= require('../models/Usuario.js')();
  usuario.crearUsuario(request.body,payload.id,function(error,code,data)
  {
    if(error)
    {
      response.status(code).send({error:error.message});
    }
    else {
      response.status(code).send(data);
    }
  });
}
/**
* Obtiene los usuarios del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerUsuarios=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var usuario= require('../models/Usuario.js')();
  usuario.obtenerUsuarios(payload.id,function(error,data)
  {
    if (!error)
    {
      response.status(200).send(data);
    }
    else
    {
      response.status(400).send({error: error.message});
    }
  });
}
/**
* Controla la actualización de un usuario
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarUsuario=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var usuario= require('../models/Usuario.js')();
  usuario.actualizarUsuario(request.params.id,payload.id,request.body,function(error,code,data)
  {
    if(error)
    {
      response.status(code).send({error:error.message});
    }
    else {
      response.status(code).send(data);
    }
  });
}
/**
* Controla la eliminación de un usuario
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarUsuario=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var usuario= require('../models/Usuario.js')();
  usuario.eliminarUsuario(request.params.id,payload.id,function(error,code,data)
  {
    if (!error)
    {
      response.status(code).send(data);
    }
    else
    {
      response.status(code).send({error: error.message});
    }
  });
}
