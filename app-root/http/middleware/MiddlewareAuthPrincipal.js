//codificador y decodificador de token de session
var service = require('../models/service.js');

/**
 * Asegura que quien hace determinado peticion este autenticado como administrador
 * @param request  donde vienen datos del formulario
 * @param response  para dar respuesta a la peticion
 * @param next  para dejar pasar la peticion en caso de que pase los filtros
 */
exports.ensureAuthenticated = function(req, res, next) {
    var payload = service.decodeToken(req);
    if (payload.type != 1)
    {
        return res
                .status(401)
                .send({message: "access denied"});
    }
    req.user = payload.sub;
    next();
}

/**
 * Asegura que quien hace determinado peticion este autenticado como administrador
 * @param request  donde vienen datos del formulario
 * @param response  para dar respuesta a la peticion
 * @param next  para dejar pasar la peticion en caso de que pase los filtros
 */
exports.ensureAuthenticatedToken = function(req, res, next) {
    var payload = service.decodeTokenFromToken(req.session.token);
    if (payload.type != 1)
    {
        return res
                .status(401)
                .send({message: "access denied"});
    }
    req.user = payload.sub;
    next();
}
