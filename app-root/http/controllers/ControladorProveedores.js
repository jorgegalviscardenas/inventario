/**
* Controla la insercción de un nuevo proveedor
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarProveedor= function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var proveedor= require('../models/Proveedor.js')();
  proveedor.crearProveedor(request.body,payload.id,function(error,code,data)
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
* Obtiene los proveedores del usuario en sesion
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerProveedores=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var proveedor= require('../models/Proveedor.js')();
  proveedor.obtenerProveedores(payload.id,function(error,data)
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
* Controla la actualización de un proveedor
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarProveedor=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var proveedor= require('../models/Proveedor.js')();
  proveedor.actualizarProveedor(request.params.id,payload.id,request.body,function(error,code,data)
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
* Controla la eliminación de un proveedor
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarProveedor=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var proveedor= require('../models/Proveedor.js')();
  proveedor.eliminarProveedor(request.params.id,payload.id,function(error,code,data)
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
