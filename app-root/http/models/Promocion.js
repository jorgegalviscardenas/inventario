/**
* Representa una promoción
*/
function Promocion()
{
  /**
  * Crea una nueva promocion
  * @param files donde vienen las imagenes
  * @param fields los campos
  * @param callback función para comunicar el resultado
  */
  this.crearPromocion=function(id_local,files,fields,callback)
  {
    var keys=Object.keys(files);
    var fils=new Array();
    for (i=0 ; i < keys.length; i++)
    {
      fils.push(files[keys[i]][0]);
    }
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(fields.nombre && id_local && fields.fecha_finalizacion)
    {
      var newData={nombre:fields.nombre[0],id_local:id_local,descripcion:fields.descripcion[0],
        fecha_finalizacion:new Date(fields.fecha_finalizacion[0]),
        createdAt:createdAt,updatedAt:updatedAt};
        var promocion=new db.Promocion(newData);
        promocion.save(function(error,dta1)
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
              f.agregarArchivo('public/promociones/',dta.id+"."+ext,fi,function(e,d)
              {
                db.Promocion.update({id:dta.id},{$set:{ruta_imagen:'promociones/'+dta.id+"."+ext}},function(e,d)
                {
                  dta.ruta_imagen='promociones/'+dta.id+"."+ext;
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
        callback(new Error("Los campos de nombre y fecha finalización son requeridos"),400,null);
      }
    }
    /**
    * Obtiene las promociones asociadas al local
    * @param idLocal identificador del local
    * @param callback función para comunicar el resultado
    */
    this.obtenerPromociones=function(idLocal,callback)
    {
      db.Promocion.find({id_local:id_local},{__v:0,_id:0},{sort: {id: 1}},function(error,locales)
      {
        callback(error,locales);
      });
    }
    /**
    * Actualiza la promocion asociada al id, y al id del local
    * @param idLocal identificador del local al que esta asociadola promoción
    * @param idPromocion identificador de la promocion que se debe actualizar
    * @param files  imagen a actualiza
    * @param fields   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarPromocion=function(idLocal,idPromocion,files,fields,callback)
    {
      db.Promocion.findOne({id:idPromocion,id_local:idLocal},{__v:0,_id:0},function(error, promocion)
      {
        if(!error)
        {
          if(promocion)
          {
            var data={updatedAt:new Date(Date.now())};
            if(fields.nombre)
            {
              data.nombre=fields.nombre[0];
            }
            if(fields.descripcion)
            {
              data.descripcion=fields.descripcion[0];
            }
            if(fields.fecha_finalizacion)
            {
              data.fecha_finalizacion=new Date(fields.fecha_finalizacion[0]);
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
              if(promocion.ruta_imagen!='promociones/imagenPorDefecto.png')
              {
                f.eliminarArchivo('public/'+promocion.ruta_imagen,function(e,d)
                {
                  f.agregarArchivo('public/promociones/',promocion.id+"."+ext,fi,function(e,d)
                  {
                    data.ruta_imagen='promociones/'+promocion.id+"."+ext;
                    db.Promocion.update({id:promocion.id},{$set:data},function(e,d)
                    {
                      callback(error,200,Object.assign(promocion,data));
                    });
                    f.eliminarArchivo(fi.path,function(e,d){})
                  });
                });
              }
              else {
                f.agregarArchivo('public/promociones/',promocion.id+"."+ext,fi,function(e,d)
                {
                  data.ruta_imagen='promociones/'+promocion.id+"."+ext;
                  db.Promocion.update({id:promocion.id},{$set:data},function(e,d)
                  {
                    callback(error,200,Object.assign(promocion,data));
                  });
                  f.eliminarArchivo(fi.path,function(e,d){})
                });
              }
            }
            else {
              db.Promocion.update({id:promocion.id},{$set:data},function(e,d)
              {
                callback(error,200,Object.assign(promocion,data));
              });
            }
          }
          else {
            callback(new Error("Promocion no encontrada"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Elimina la promocion asociada al id y al id del local
    * @param idPromocion identificador de la promocion
    * @param idLocal identificador del local
    * @param callback función para comunicar el resultado
    */
    this.eliminarPromocion=function(idPromocion,idLocal,callback)
    {
      db.Promocion.findOne({id:idPromocion,id_local:idLocal},{__v:0,_id:0},function(error, promocion)
      {
        if(!error)
        {
          if(promocion)
          {
            var f=require('./File.js')();
            if(promocion.ruta_imagen!='promociones/imagenPorDefecto.png')
            {
              f.eliminarArchivo('public/'+promocion.ruta_imagen,function(e,d){});
            }
            db.Promocion.remove({id:idPromocion},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                callback(error,200,promocion);
              }
            });
          }
          else {
            callback(new Error("Promocion no encontrada"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Obtiene las promociones vigentes de una empresa
    * @param idEmpresa identificador de la empresa
    * @param callback función para comunicar el resultado
    */
    this.obtenerPromocionesVigentesEmpresa=function(idEmpresa,callback)
    {
      var local=require('./Local.js')();
      local.obtenerLocalesDeEmpresa(idEmpresa,function(error,locales)
      {
        var ids=new Array();
        for(var i=0;i<locales.length;i++)
        {
          ids.push(locales[i].id);
        }
        var now=new Date(Date.now());
        db.Promocion.find({id_local:{$in:ids},fecha_finalizacion:{$gt:now}},{__v:0,_id:0},{sort: {id: 1}},function(error,data)
        {
          callback(error,data);
        });
      });

    }

    return this;
  }
  module.exports=Promocion;
