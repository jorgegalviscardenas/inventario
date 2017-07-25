function Usuario()
{
  var service = require('./service.js');
  this.porDefecto=function()
  {
    db.Usuario.remove({},function(error,data)
    {
      var em='jorgegalcad@gmail.com';
      var pa='123'
      var con=cifrarContrasenia(em,pa);
      var us=new db.Usuario({email:em,contrasenia:con});
      us.save(function(error,dta){

      });
    });
  }
  /**
  * Cifra la contraseña que recibimos por parametro
  * @param email   el email del usuario
  * @param contrasenia   el password del usuario
  */
  this.cifrarContrasenia = function(email, contrasenia)
  {
    var crypto = require('crypto');
    // usamos el metodo CreateHmac y le pasamos el parametro user y actualizamos el hash con la password
    var hmac = crypto.createHmac('sha1', email).update(contrasenia).digest('hex');
    return hmac;
  }
  /**
  * Autentica un usuario en la aplicacion
  * @param request  donde vienen los datos para autenticar el usuario
  * @param callback  funcion para saber el estado de la autenticacion
  */
  this.auth = function(request, callback)
  {
    console.log(request.body);
    if (request.body.email)
    {
      if (request.body.contrasenia)
      {
        db.Usuario.findOne({email:request.body.email}, function(error, user)
        {
          if (!error)
          {
            if (user)
            {
              var passwordCode = cifrarContrasenia(request.body.email, request.body.contrasenia);
              if (passwordCode == user.contrasenia)
              {
                callback(null, {token: service.createToken(user), user: user});
              }
              else {
                callback({message:'Incorrect password',code:1}, null)
              }
            }
            else {
              callback({message:'User not found',code:3}, null);
            }
          }
          else {
            callback(error, user);
          }
        });
      }
      else {
        callback({message:'Password empty',code:4}, null);
      }
    }
    else {
      callback({message:'Email empty',code:5}, null);
    }

  }
  return this;
}
module.exports=Usuario;
