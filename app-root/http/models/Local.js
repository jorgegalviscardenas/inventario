/**
* Representa un local
*/
function Local()
{
  /**
  * Crea un nuevo local
  * @param idUsuario identificador del usuario que hace la peticion
  * @param files donde vienen las imagenes
  * @param fields los campos
  * @param callback función para comunicar el resultado
  */
  this.crearLocal=function(files,fields,idUsuario,callback)
  {
    var keys=Object.keys(files);
    var fils=new Array();
    for (i=0 ; i < keys.length; i++)
    {
      fils.push(files[keys[i]][0]);
    }
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(fields.nombre && fields.departamento && fields.ciudad && fields.telefono && fields.direccion)
    {
      var newData={nombre:fields.nombre[0],departamento:fields.departamento[0],ciudad:fields.ciudad[0],
        telefono:fields.telefono[0],direccion:fields.direccion[0],createdAt:createdAt,
        updatedAt:updatedAt,creado_por:idUsuario};
        var local=new db.Local(newData);
        local.save(function(error,dta1)
        {

          if(error)
          {
            callback(error,400,null);
          }
          else {
            var dta=dta1.toObject();
            delete dta.__v;
            delete dta._id;
            if(fils.length>0)
            {
              var f=require('./File.js')();
              var fi=fils[0];
              var nameFile=fi.originalFilename;
              var extParts=nameFile.split(".");
              var ext=extParts[extParts.length-1];
              f.agregarArchivo('public/locales/',dta.id+"."+ext,fi,function(e,d)
              {
                db.Local.update({id:dta.id},{$set:{ruta_imagen:'locales/'+dta.id+"."+ext}},function(e,d)
                {
                  dta.ruta_imagen='locales/'+dta.id+"."+ext;
                  callback(error,201,dta)
                });
                f.eliminarArchivo(fi.path,function(e,d){})
              });
            }
            else {
              callback(error,201,dta);
            }
          }
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
    * @param files donde vienen las imagenes
    * @param fields los campos
    * @param idLocal identificador del local en la base de datos
    * @param idUsuario identificador del usuario en la base de datos
    * @param callback función para comunicar el resultado
    */
    this.actualizarLocal=function(files,fields,idLocal,idUsuario,callback)
    {
      db.Local.findOne({id:idLocal,creado_por: idUsuario},{__v:0,_id:0},function(error, local)
      {
        if(!error)
        {
          if(local)
          {
            var data={updatedAt:new Date(Date.now())};
            if(fields.nombre)
            {
              data.nombre=fields.nombre[0];
            }
            if(fields.departamento)
            {
              data.departamento=fields.departamento[0];
            }
            if(fields.ciudad)
            {
              data.ciudad=fields.ciudad[0];
            }
            if(fields.telefono)
            {
              data.telefono=fields.telefono[0];
            }
            if(fields.direccion)
            {
              data.direccion=fields.direccion[0];
            }
            var keys=Object.keys(files);
            var fils=new Array();
            for (i=0 ; i < keys.length; i++)
            {
              fils.push(files[keys[i]][0]);
            }
            if(fils.length>0)
            {
              var f=require('./File.js')();
              var fi=fils[0];
              var nameFile=fi.originalFilename;
              var extParts=nameFile.split(".");
              var ext=extParts[extParts.length-1];
              if(local.ruta_imagen!='locales/imagenPorDefecto.png')
              {
                f.eliminarArchivo('public/'+local.ruta_imagen,function(e,d)
                {
                  f.agregarArchivo('public/locales/',local.id+"."+ext,fi,function(e,d)
                  {
                    data.ruta_imagen='locales/'+local.id+"."+ext;
                    db.Local.update({id:local.id},{$set:data},function(e,d)
                    {
                      callback(error,200,Object.assign(local,data));
                    });
                    f.eliminarArchivo(fi.path,function(e,d){})
                  });
                });
              }
              else {
                f.agregarArchivo('public/locales/',local.id+"."+ext,fi,function(e,d)
                {
                  data.ruta_imagen='locales/'+local.id+"."+ext;
                  db.Local.update({id:local.id},{$set:data},function(e,d)
                  {
                    callback(error,200,Object.assign(local,data));
                  });
                  f.eliminarArchivo(fi.path,function(e,d){})
                });
              }
            }
            else {
              db.Local.update({id:local.id},{$set:data},function(e,d)
              {
                callback(error,200,Object.assign(local,data));
              });
            }
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
    /**
    * Obtiene los locales asociados al id de la empresa
    * @param idEmpresa identificador de la empresa
    * @calback función para comunicar el resultado
    */
    this.obtenerLocalesDeEmpresa=function(idEmpresa,callback)
    {
      db.Local.find({id_empresa:idEmpresa},{__v:0,_id:0},{sort: {id: 1}},function(error,data)
      {
        callback(error,data);
      });
    }
    return this;
  }
  module.exports=Local;
