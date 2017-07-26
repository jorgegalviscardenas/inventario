/**
* Controla la insercción de un nuevo cliente
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarCliente = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var cliente= require('../models/Cliente.js')();
  cliente.crearCliente(request.body,payload.id,function(error,code,data)
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
* Obtiene los clientes del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerClientes=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var cliente= require('../models/Cliente.js')();
  cliente.obtenerClientes(payload.id,function(error,data)
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
* Controla la actualización de un cliente
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarCliente=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var cliente= require('../models/Cliente.js')();
  cliente.actualizarCliente(request.params.id,payload.id,request.body,function(error,code,data)
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
* Controla la eliminación de un cliente
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarCliente=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var cliente= require('../models/Cliente.js')();
  cliente.eliminarCliente(request.params.id,payload.id,function(error,code,data)
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
