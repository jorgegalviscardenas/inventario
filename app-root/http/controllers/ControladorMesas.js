/**
* Controla la inserccion de una nueva mesa
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarMesa=function(request,response)
{
  var mesa=require('../models/Mesa.js')();
  mesa.agregarMesa(request.body,request.params.id,function(error,data)
  {
    if(!error)
    {
      response.status(200).send(data);
    }
    else {
      response.status(400).send({error:error.message});
    }
  });
}
/**
* Controla la obtención de las mesas
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerMesas=function(request,response)
{
  var mesa=require('../models/Mesa.js')();
  mesa.obtenerMesas(request.params.id,function(error,data)
  {
    if(!error)
    {
      response.status(200).send(data);
    }
    else {
      response.status(400).send({error:error.message});
    }
  });
}
/**
* Controla la actualización de la mesa
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarMesa=function(request,response)
{
  var mesa=require('../models/Mesa.js')();
  mesa.actualizarMesa(request.params.idEmpresa,request.params.idMesa,request.body,function(error,code,data)
  {
    if(!error)
    {
      response.status(code).send(data);
    }
    else {
      response.status(code).send({error:error.message});
    }
  });
}
/**
* Controla la eliminación de la mesa
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarMesa=function(request,response)
{
  var mesa=require('../models/Mesa.js')();
  mesa.eliminarMesa(request.params.idEmpresa,request.params.idMesa,function(error,code,data)
  {
    if(!error)
    {
      response.status(code).send(data);
    }
    else {
      response.status(code).send({error:error.message});
    }
  });
}
