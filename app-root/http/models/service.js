var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../config/configToken.js');
/**
 * Crea un token
 * @param user el usuario con el que se crea el token
 */
exports.createToken = function(user) {
    var payload = {
        sub: user.email,
        iat: moment().unix(),
        locales:user.locales,
        permisos:user.permisos,
        id: user.id,
        exp: moment().add(2, "days").unix(),
        pathImage:user.pathImage || '/images/users/user-placeholder.png'
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
};
/**
 * Decodifica el token
 *
 */
exports.decodeToken = function(request)
{
    var token = request.headers.authorization.split(" ")[1];
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    return payload;
}
/**
* Decodifica el token a partir de un token
* @param token   el token a decodificar
*/
exports.decodeTokenFromToken = function(token)
{
    var payload = jwt.decode(token, config.TOKEN_SECRET);
    return payload;
}
