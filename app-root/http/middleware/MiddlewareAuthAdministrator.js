//codificador y decodificador de token de session
var service = require('../models/service.js');
/**
 * Asegura que quien hace determinado peticion este autenticado como administrador
 * @param request  donde vienen datos del formulario
 * @param response  para dar respuesta a la peticion
 * @param next  para dejar pasar la peticion en caso de que pase los filtros
 */
exports.ensureAuthenticated = function(request, response, next) {
    var payload = service.decodeToken(request);
    if (payload.type != 0)
    {
        return response
                .status(401)
                .send({error: "access denied"});
    }
    request.user = payload.sub;
    next();
}

