/**
* Controla la insercción de una nueva categoria
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.agregarCategoria = function(request, response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var campaign= require('../models/Campaign.js')();
  campaign.agregarCampania(request.body.campaign,payload.id,function(error,data)
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
* Obtiene las campañas del usuario en sesión
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.obtenerCampanias=function(request,response)
{
  var service = require('../models/service.js');
  var payload = service.decodeToken(request);
  var campaign= require('../models/Campaign.js')();
  campaign.obtenerCampanias(payload.id,function(error,data)
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
* Controla la eliminación de una campaña
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.eliminarCampania=function(request,response)
{
  var campaign= require('../models/Campaign.js')();
  campaign.eliminarCampania(request.body.idCampania,function(error,data)
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
* Controla la actualización de la campaña
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.actualizarCampania=function(request,response)
{
  var campaign= require('../models/Campaign.js')();
  campaign.actualizarCampania(request.body.campaign,function(error,data)
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
* Controla el envio de una campaña a emails
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.enviarCampaniaAEmails=function(request,response)
{
  var campaign= require('../models/Campaign.js')();
  campaign.enviarCampaniaAContactos(request.body.idCampania,request.body.emails,request.body.enviarReview,function(error,data)
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
* Controla la finalización de una campaña
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.finalizarCampania=function(request,response)
{
  var campaign= require('../models/Campaign.js')();
  campaign.finalizarCampania(request.body.idCampania,function(error,data)
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
* Controla el envio de una campaña
* @param {type} request donde viene los datos para la consulta
* @param {type} response para dar respuesta a la peticion
*/
exports.enviarCampaniaAhora=function(request,response)
{
  var campaign= require('../models/Campaign.js')();
  campaign.enviarCampaniaAhora(request.body.idCampania,function(error,data)
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
