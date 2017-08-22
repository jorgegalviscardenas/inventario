/**
* Controla la inserción de una nueva promocion
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarPromocion = function(request, response)
{
  var promocion= require('../models/Promocion.js')();
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      promocion.crearPromocion(request.params.id,files,fields,function(error,code,data)
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
* Controla la obtención de las promociones del local
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerPromociones=function(request,response)
{
  var promocion= require('../models/Promocion.js')();
  promocion.obtenerPromociones(request.params.id,function(error,data)
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
* Controla la actualización de una promocion
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarPromocion=function(request,response)
{
  var promocion= require('../models/Promocion.js')();
  var multiparty = require('multiparty');
  var form = new multiparty.Form();
  form.parse(request, function(err, fields, files) {
    if(!err)
    {
      promocion.actualizarPromocion(request.params.idLocal,request.params.idPromocion,files,fields,function(error,code,data)
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
* Controla la eliminación de una promocion
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarPromocion=function(request,response)
{
  var promocion= require('../models/Promocion.js')();
  promocion.eliminarPromocion(request.params.idPromocion,request.params.idLocal,function(error,code,data)
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
* Controla la obtención de las promociones vigentes para una empresa
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerPromocionesVigentesEmpresa=function(request,response)
{
  var promocion= require('../models/Promocion.js')();
  promocion.obtenerPromocionesVigentesEmpresa(request.params.id,function(error,data)
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
