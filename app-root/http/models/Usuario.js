/**
* Representa un usuario
*/
function Usuario()
{
  var service = require('./service.js');

  /**
  * Crea un nuevo usuario
  * @param data la información del usuario a crear
  * @param idUsuario identificador del usuario que hace la peticion
  * @param callback función para comunicar el resultado
  */
  this.crearUsuario=function(data,idUsuario,callback)
  {
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(data.nombre && data.apellido && data.email && data.nombre_usuario)
    {
      var pass;
      if(data.contrasenia)
      {
        if(data.contrasenia.trim()!="")
        {
          pass=cifrarContrasenia(data.email,data.contrasenia.trim());

        }
        else {
          pass=cifrarContrasenia(data.email,'123');
        }
      }else {
        pass=cifrarContrasenia(data.email,'123');
      }
      var newData={nombre:data.nombre,apellido:data.apellido,email:data.email,
        nombre_usuario:data.nombre_usuario,createdAt:createdAt,
        updatedAt:updatedAt,usuario_de:idUsuario};
        db.Usuario.findOne({email:data.email},function(error,user)
        {
          if(user)
          {
            callback(new Error("El email del usuario ya se encuentra registrado"),400,null);
          }
          else {
            var usuario=new db.Usuario(newData);
            usuario.save(function(error,dta1)
            {
              var dta;
              if(dta1)
              {
                dta=dta1.toObject();
                delete dta.__v;
                delete dta._id;
                delete dta.contrasenia;
              }
              var code=201;
              if(error)
              {
                code=400;
              }
              callback(error,code,dta);
            });
          }
        });

      }
      else {
        callback(new Error("Los campos de nombre, apellido, email, nombre usuario son requeridos"),400,null);
      }
    }
    /**
    * Obtiene los usuarios del usuario
    * @param idUsuario identificador del usuario que solicita los usuarios
    * @param callback función para comunicar el resultado
    */
    this.obtenerUsuarios=function(idUsuario,callback)
    {
      db.Usuario.find({usuario_de: idUsuario},{__v:0,_id:0},{sort: {id: 1}}, function(error, usuarios)
      {
        callback(error, usuarios);
      });
    }
    /**
    * Actualiza el usuario al id, y al identificador del usuario
    * @param idUs identificador del  usuario en la base de datos
    * @param idUsuario identificador del usuario en la base de datos
    * @param data   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarUsuario=function(idUs,idUsuario,data,callback)
    {
      db.Usuario.findOne({id:idUs,usuario_de: idUsuario},{__v:0,_id:0},function(error, usuario)
      {
        if(!error)
        {
          if(usuario)
          {
            data.updatedAt=new Date(Date.now());
            db.Usuario.update({id:idUs},{$set:data},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                usuario=Object.assign(usuario,data);
                callback(error,200,usuario);
              }
            });
          }
          else {
            callback(new Error("Usuario no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Elimina el usuario asociado al id y al id del usuario
    * @param idUs identificador del usuario en la base de datos
    * @param idUsuario identificador del usuario
    * @param callback función para comunicar el resultado
    */
    this.eliminarUsuario=function(idUs,idUsuario,callback)
    {
      db.Usuario.findOne({id:idUs,usuario_de: idUsuario},{__v:0,_id:0},function(error, usuario)
      {
        if(!error)
        {
          if(usuario)
          {
            db.Usuario.remove({id:idUs},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                callback(error,200,usuario);
              }
            });
          }
          else {
            callback(new Error("Usuario no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Funcion que elimina todos los usuarios
    */
    this.porDefecto=function()
    {
      db.Usuario.remove({},function(error,data)
      {
        var em='jorgegalcad@gmail.com';
        var pa='123'
        var con=cifrarContrasenia(em,pa);
        var us=new db.Usuario({id:1,email:em,contrasenia:con});
        us.save(function(error,dta){

        });
      });
      db.Local.remove({},function(error,dta)
      {
        var loc=new db.Local({nombre:"Local ejemplo",departamento:"Caldas",ciudad:"Manizales",
        telefono:"12345",direccion:"",createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()),id:1});
        loc.save(function(error,dta)
        {

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
                  callback({message:'Contraseña incorrecta',code:1}, null)
                }
              }
              else {
                callback({message:'Usuario no encontrado',code:3}, null);
              }
            }
            else {
              callback(error, user);
            }
          });
        }
        else {
          callback({message:'Contraseña vacia',code:4}, null);
        }
      }
      else {
        callback({message:'Correo vacio',code:5}, null);
      }
    }
    return this;
  }
  module.exports=Usuario;
