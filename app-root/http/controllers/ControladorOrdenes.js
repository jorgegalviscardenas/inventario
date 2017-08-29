/**
* Controla la insercción de una nueva orden
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarOrden = function(request, response)
{
  var orden= require('../models/Orden.js')();
  orden.crearOrden(request.body,function(error,data)
  {
    if(error)
    {
      response.status(400).send({error:error.message});
    }
    else {
      response.status(201).send(data);
    }
  });
}
/**
* Controla la obtención de las ordenes asociadas a un telefono
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerOrdenesDeTelefono=function(request,response)
{
  var orden= require('../models/Orden.js')();
  orden.obtenerOrdenesDeTelefono(request.params.numero,function(error,data)
  {
    if(error)
    {
      response.status(400).send({error:error.message});
    }
    else {
      response.status(200).send(data);
    }
  });
}
/**
* Controla la actualización del estado de una orden
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarEstadoOrden=function(request,response)
{
  var orden= require('../models/Orden.js')();
  orden.actualizarEstadoOrden(request.params.id,request.body.estado_entrega,function(error,code,data)
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
* Controla la actualiazción del estado de una suborden
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarEstadoSuborden=function(request,response)
{
  var orden= require('../models/Orden.js')();
  orden.actualizarEstadoSuborden(request.params.id,request.body.estado_entrega,function(error,code,data)
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
