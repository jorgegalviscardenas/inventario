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
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      subcategoria.crearSubcategoria(files,fields,function(error,code,data)
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
      console.log(err);
      response.status(400).send({error:err.message});
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
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      subcategoria.actualizarCliente(request.params.id,files,fields,function(error,code,data)
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
/**
* Obtiene las categorias asociadas a una categoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerSubcategoriasDeCategoria=function(request,response)
{
  var subcategoria= require('../models/Subcategoria.js')();
  subcategoria.obtenerSubcategoriasDeCategoria(request.params.id,function(error,data)
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
* Controla la obtención de una subcategoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerSubcategoria=function(request,response)
{
  var subcategoria= require('../models/Subcategoria.js')();
  subcategoria.obtenerSubcategoria(request.params.id,function(error,code,data)
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
