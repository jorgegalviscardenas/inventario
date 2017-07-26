/**
* Representa una categoria
*/
function Categoria()
{
  /**
  * Crea una nueva categoria
  * @param files donde vienen las imagenes
  * @param fields los campos
  * @param callback función para comunicar el resultado
  */
  this.crearCategoria=function(files,fields,callback)
  {
    var keys=Object.keys(files);
    var fils=new Array();
    for (i=0 ; i < keys.length; i++)
    {
      fils.push(files[keys[i]][0]);
    }
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(fields.nombre && fields.id_local)
    {
      var newData={nombre:fields.nombre[0],id_local:fields.id_local[0],createdAt:createdAt,updatedAt:updatedAt};
      var categoria=new db.Categoria(newData);
      categoria.save(function(error,dta)
      {
        if(dta)
        {
          delete dta.__v;
          delete dta._id;
        }
        if(error)
        {
          callback(error,400,null);
        }
        else {
          if(fils.length>0)
          {
            var f=require('./File.js')();
            var fi=fils[0];
            var nameFile=fi.originalFilename;
            var extParts=nameFile.split(".");
            var ext=extParts[extParts.length-1];
            f.agregarArchivo('public/categorias/',dta.id+ext,fi,function(e,d)
            {
              db.Categoria.update({id:dta.id},{$set:{ruta_imagen:'categorias/'+dta.id+ext}},function(e,d)
              {
                dta.ruta_imagen='categorias/'+dta.id+ext;
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
      callback(new Error("Los campos de nombre y local son requeridos"),400,null);
    }
  }
  /**
  * Obtiene las categorias asociados al usuario
  * @param idUsuario identificador del usuario que solicita las categorias
  * @param callback función para comunicar el resultado
  */
  this.obtenerCategorias=function(idUsuario,callback)
  {
    var local=require('./Local.js')();
    local.obtenerLocales(idUsuario,function(error,locales)
    {
      var ids=new Array();
      for(var i=0;i<locales.length;i++)
      {
        ids.push(locales[i].id);
      }
      db.Categoria.find({id_local:{$in:ids}},{__v:0,_id:0},{sort: {id: 1}},function(error,categorias)
      {
        callback(error,categorias);
      });
    });
  }
  /**
  * Actualiza la categoria asociada al id
  * @param idCategoria identificador de la categoria en la base de datos
  * @param files  imagen a actualizar
  * @param fields   información a actualizar
  * @param callback función para comunicar el resultado
  */
  this.actualizarCategoria=function(idCategoria,files,fields,callback)
  {
    db.Categoria.findOne({id:idCategoria},{__v:0,_id:0},function(error, categoria)
    {
      if(!error)
      {
        if(categoria)
        {
          var data={updatedAt:new Date(Date.now())};
          if(fields.nombre)
          {
            data.nombre=fields.nombre[0];
          }
          if(fields.id_local)
          {
            data.id_local=fields.id_local[0];
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
            if(categoria.ruta_imagen!='categorias/imagenPorDefecto.png')
            {
              f.eliminarArchivo(categoria.ruta_imagen,function(e,d)
              {
                f.agregarArchivo('public/categorias/',categoria.id+ext,fi,function(e,d)
                {
                  data.ruta_imagen='categorias/'+categoria.id+ext;
                  db.Categoria.update({id:categoria.id},{$set:data},function(e,d)
                  {
                    callback(error,200,Object.assign(categoria,data));
                  });
                  f.eliminarArchivo(fi.path,function(e,d){})
                });
              });
            }
            else {
              f.agregarArchivo('public/categorias/',categoria.id+ext,fi,function(e,d)
              {
                data.ruta_imagen='categorias/'+categoria.id+ext;
                db.Categoria.update({id:categoria.id},{$set:data},function(e,d)
                {
                  callback(error,200,Object.assign(categoria,data));
                });
                f.eliminarArchivo(fi.path,function(e,d){})
              });
            }
          }
          else {
            db.Categoria.update({id:producto.id},{$set:data},function(e,d)
            {
              callback(error,200,Object.assign(Categoria,data));
            });
          }
        }
        else {
          callback(new Error("Categoria no encontrada"),404,null);
        }
      }
      else {
        callback(error,400,null);
      }
    });
  }
  /**
  * Elimina la categoria asociada al id
  * @param idCategoria identificador de la categoria en la base de datos
  * @param callback función para comunicar el resultado
  */
  this.eliminarCategoria=function(idCategoria,callback)
  {
    db.Categoria.findOne({id:idCategoria},{__v:0,_id:0},function(error, categoria)
    {
      if(!error)
      {
        if(categoria)
        {
          db.Categoria.remove({id:idCategoria},function(error,dta)
          {
            if(error)
            {
              callback(error,400,null);
            }
            else {
              callback(error,200,categoria);
            }
          });
        }
        else {
          callback(new Error("Categoria no encontrada"),404,null);
        }
      }
      else {
        callback(error,400,null);
      }
    });
  }
  return this;
}
module.exports=Categoria;
