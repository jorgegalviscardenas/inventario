function Usuario()
{
  var service = require('./service.js');

  /**
  * Crea un nuevo usuario
  * @param data la información del usuario a crear
  * @param idUsuario identificador del usuario que hace la peticion
  * @param callback función para comunicar el resultado
  */
  this.crearCliente=function(data,idUsuario,callback)
  {
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(data.nombre && data.apellido && data.email && data.nombre_usuario)
    {
      if(data.contrasenia)
      {
        if(data.contrasenia.trim()!="")
        {

        }
      }else {

      }
      var newData={nombre:data.nombre,apellido:data.apellido,email:data.email,
        telefono:data.telefono,direccion:data.direccion,createdAt:createdAt,
        updatedAt:updatedAt,cliente_de:idUsuario};
        var cliente=new db.Cliente(newData);
        cliente.save(function(error,dta)
        {
          if(dta)
          {
            delete dta.__v;
            delete dta._id;
          }
          var code=201;
          if(error)
          {
            code=400;
          }
          callback(error,code,dta);
        });
      }
      else {
        callback(new Error("Los campos de nombre, apellido, email, telefono y dirección son requeridos"),400,null);
      }
    }
    /**
    * Obtiene los clientes asociados al usuario
    * @param idUsuario identificador del usuario que solicita los clientes
    * @param callback función para comunicar el resultado
    */
    this.obtenerClientes=function(idUsuario,callback)
    {
      db.Cliente.find({cliente_de: idUsuario},{__v:0,_id:0},{sort: {id: 1}}, function(error, clientes)
      {
        callback(error, clientes);
      });
    }
    /**
    * Actualiza el cliente asociado al id, y al identificador del usuario
    * @param idCliente identificador del cliente en la base de datos
    * @param idUsuario identificador del usuario en la base de datos
    * @param data   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarCliente=function(idCliente,idUsuario,data,callback)
    {
      db.Cliente.findOne({id:idCliente,cliente_de: idUsuario},{__v:0,_id:0},function(error, cliente)
      {
        if(!error)
        {
          if(cliente)
          {
            data.updatedAt=new Date(Date.now());
            db.Cliente.update({id:idCliente},{$set:data},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                cliente=Object.assign(cliente,data);
                callback(error,200,cliente);
              }
            });
          }
          else {
            callback(new Error("Cliente no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Elimina el cliente asociado al id y al id del usuario
    * @param idCliente identificador del cliente en la base de datos
    * @param idUsuario identificador del usuario
    * @param callback función para comunicar el resultado
    */
    this.eliminarCliente=function(idCliente,idUsuario,callback)
    {
      db.Cliente.findOne({id:idCliente,cliente_de: idUsuario},{__v:0,_id:0},function(error, cliente)
      {
        if(!error)
        {
          if(cliente)
          {
            db.Cliente.remove({id:idCliente},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                callback(error,200,cliente);
              }
            });
          }
          else {
            callback(new Error("Cliente no encontrado"),404,null);
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
