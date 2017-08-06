/**
* Controla la insercción de una nueva categoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarCategoria = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var categoria= require('../models/Categoria.js')();
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      categoria.crearCategoria(files,fields,function(error,code,data)
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
* Obtiene las categorias del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerCategorias=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var categoria= require('../models/Categoria.js')();
  categoria.obtenerCategorias(payload.id,function(error,data)
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
* Controla la actualización de la categoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarCategoria=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var categoria= require('../models/Categoria.js')();
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      categoria.actualizarCategoria(request.params.id,files,fields,function(error,code,data)
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
      response.status(400).send({error:error.message});
    }
  });
}
/**
* Controla la eliminación de una categoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarCategoria=function(request,response)
{
  var categoria= require('../models/Categoria.js')();
  categoria.eliminarCategoria(request.params.id,function(error,code,data)
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
* Controla la obteneción de las categorias del local
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerCategoriasDeLocal=function(request,response)
{
  var categoria= require('../models/Categoria.js')();
  categoria.obtenerCategoriasDeLocal(request.params.id,function(error,data)
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
