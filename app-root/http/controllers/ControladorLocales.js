/**
* Controla la insercción de un nuevo local
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarLocal = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var local= require('../models/Local.js')();
  local.crearLocal(request.body,payload.id,function(error,code,data)
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
* Obtiene los locales del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerLocales=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var local= require('../models/Local.js')();
  local.obtenerLocales(payload.id,function(error,data)
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
* Controla la actualización de un local
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarLocal=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var local= require('../models/Local.js')();
  local.actualizarLocal(request.params.id,payload.id,request.body,function(error,code,data)
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
* Controla la eliminación de un local
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarLocal=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var local= require('../models/Local.js')();
  local.eliminarLocal(request.params.id,payload.id,function(error,code,data)
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
/**
* Controla la obtención de los locales asociados a una empresa
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerLocalesDeEmpresa=function(request,response)
{
  var local= require('../models/Local.js')();
  local.obtenerLocalesDeEmpresa(request.params.id,function(error,code,data)
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
