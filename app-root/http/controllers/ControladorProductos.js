/**
* Controla la insercción de un nuevo producto
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarProducto = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var producto= require('../models/Producto.js')();
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      producto.crearProducto(files,fields,function(error,code,data)
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
    else {
      response.status(400).send({error:err.message});
    }
  });

}
/**
* Obtiene los productos del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerProductos=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var producto= require('../models/Producto.js')();
  producto.obtenerProductos(payload.id,function(error,data)
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
* Controla la actualización de un producto
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarProducto=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var producto= require('../models/Producto.js')();
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      producto.actualizarProducto(request.params.id,files,fields,function(error,code,data)
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
    else {
      response.status(400).send({error:err.message});
    }
  });
}
/**
* Controla la eliminación de un producto
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarProducto=function(request,response)
{
  var producto= require('../models/Producto.js')();
  producto.eliminarProducto(request.params.id,function(error,code,data)
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
* Obtiene los productos asociados a la subcategoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerProductosDeSubcategoria=function(request,response)
{
  var producto= require('../models/Producto.js')();
  producto.obtenerProductosDeSubcategoria(request.params.id,function(error,data)
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
