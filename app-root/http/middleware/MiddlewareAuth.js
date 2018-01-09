//codificador y decodificador de token de session
var service = require('../models/service.js');
//para obtener ek momento actual
var moment = require('moment');
/**
* Asegura que quien hace determinado peticion este autenticado
* @param request  donde vienen datos del formulario
* @param response  para dar respuesta a la peticion
* @param next  para dejar pasar la peticion en caso de que pase los filtros
*/
exports.ensureAuthenticated = function(req, res, next) {
  if (!req.headers.authorization) {
    return res
    .status(403)
    .send({error: "unauthorized"});
  }
  try{
    var payload = service.decodeToken(req);
    if (payload.exp <= moment().unix()) {
      return res.status(401).send({message: "token expired"});
    }

    req.user = payload.sub;
    next();
  }catch(err)
  {
    return res.status(401).send({message: err.message});
  }

}
/**
* Asegura que quien hace determinado peticion este autenticado
* @param request  donde vienen datos del formulario
* @param response  para dar respuesta a la peticion
* @param next  para dejar pasar la peticion en caso de que pase los filtros
*/
exports.ensureAuthenticatedToken = function(req, res, next) {
  if (!req.session.token) {
    return res
    .status(403)
    .send({error: "unauthorized"});
  }
  try{
    var payload = service.decodeTokenFromToken(req.session.token);

    if (payload.exp <= moment().unix()) {
      return res
      .status(401)
      .send({message: "token expired"});
    }

    req.user = payload.sub;
    next();
  }catch(err)
  {
    return res.status(401).send({message: err.message});
  }
}
/**
* Asegura que quien hace determinado peticion este autenticado
* @param request  donde vienen datos del formulario
* @param response  para dar respuesta a la peticion
* @param next  para dejar pasar la peticion en caso de que pase los filtros
*/
exports.ensureAuthenticatedHome = function(req, res, next) {
  if (!req.headers.authorization) {
    delete req.session.token;
    return res.render('auth/sign-in.ejs');
  }
  var payload = service.decodeToken(req);

  if (payload.exp <= moment().unix()) {
    delete request.session.token;
    return res.render('auth/sign-in.ejs');
  }

  req.user = payload.sub;
  next();
}
