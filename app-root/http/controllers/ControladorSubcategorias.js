/**
* Controla la insercción de una nueva subcategoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarSubcategoria = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var subcategoria= require('../models/Subcategoria.js')();
  subcategoria.crearSubcategoria(request.body,payload.id,function(error,code,data)
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
* Obtiene las subcategorias del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerSubcategorias=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var subcategoria= require('../models/Subcategoria.js')();
  subcategoria.obtenerSubcategorias(payload.id,function(error,data)
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
* Controla la actualización de una subcategoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarSubcategoria=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var subcategoria= require('../models/Subcategoria.js')();
  subcategoria.actualizarCliente(request.params.id,request.body,function(error,code,data)
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
* Controla la eliminación de una subcategoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarSubcategoria=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var subcategoria= require('../models/Subcategoria.js')();
  subcategoria.eliminarSubcategoria(request.params.id,function(error,code,data)
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
