/**
* Representa un local
*/
function Local()
{
  /**
  * Crea un nuevo local
  * @param data la información del local a crear
  * @param idUsuario identificador del usuario que hace la peticion
  * @param callback función para comunicar el resultado
  */
  this.crearLocal=function(data,idUsuario,callback)
  {
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(data.nombre && data.departamento && data.ciudad && data.telefono && data.direccion)
    {
      var newData={nombre:data.nombre,departamento:data.departamento,ciudad:data.ciudad,
        telefono:data.telefono,direccion:data.direccion,createdAt:createdAt,
        updatedAt:updatedAt,creado_por:idUsuario};
        var local=new db.Local(newData);
        local.save(function(error,dta)
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
        callback(new Error("Los campos de nombre, departamento, ciudad, telefono y dirección son requeridos"),400,null);
      }
    }
    /**
    * Obtiene los locales asociados al usuario
    * @param idUsuario identificador del usuario que solicita los locales
    * @param callback función para comunicar el resultado
    */
    this.obtenerLocales=function(idUsuario,callback)
    {
      db.Local.find({creado_por: idUsuario},{__v:0,_id:0},{sort: {id: 1}}, function(error, locales)
      {
        callback(error, locales);
      });
    }
    /**
    * Actualiza el local asociado al id, y al identificador del usuario
    * @param idLocal identificador del local en la base de datos
    * @param idUsuario identificador del usuario en la base de datos
    * @param data   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarLocal=function(idLocal,idUsuario,data,callback)
    {
      db.Local.findOne({id:idLocal,creado_por: idUsuario},{__v:0,_id:0},function(error, local)
      {
        if(!error)
        {
          if(local)
          {
            data.updatedAt=new Date(Date.now());
            db.Local.update({id:idLocal},{$set:data},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                local=Object.assign(local,data);
                callback(error,200,local);
              }
            });
          }
          else {
            callback(new Error("Local no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Elimina el local asociado al id y al id del usuario
    * @param idLocal identificador del local en la base de datos
    * @param idUsuario identificador del usuario
    * @param callback función para comunicar el resultado
    */
    this.eliminarLocal=function(idLocal,idUsuario,callback)
    {
      db.Local.findOne({id:idLocal,creado_por: idUsuario},{__v:0,_id:0},function(error, local)
      {
        if(!error)
        {
          if(local)
          {
            db.Local.remove({id:idLocal},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                callback(error,200,local);
              }
            });
          }
          else {
            callback(new Error("Local no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    return this;
  }
  module.exports=Local;