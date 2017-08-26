/**
* Maneja operaciones referentes a las subcategorias
*/
function Subcategoria()
{
  /**
  * Crea una nueva subcategoria
  * @param files donde vienen las imagenes
  * @param fields los campos
  * @param callback función para comunicar el resultado
  */
  this.crearSubcategoria=function(files,fields,callback)
  {
    var keys=Object.keys(files);
    var fils=new Array();
    for (i=0 ; i < keys.length; i++)
    {
      fils.push(files[keys[i]][0]);
    }
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(fields.nombre && fields.id_local && fields.id_categoria)
    {
      var newData={nombre:fields.nombre[0],id_categoria:fields.id_categoria[0],
        id_local:fields.id_local[0],createdAt:createdAt,updatedAt:updatedAt};
        var categoria=new db.Subcategoria(newData);
        categoria.save(function(error,dta1)
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
              f.agregarArchivo('public/subcategorias/',dta.id+"."+ext,fi,function(e,d)
              {
                db.Categoria.update({id:dta.id},{$set:{ruta_imagen:'subcategorias/'+dta.id+"."+ext}},function(e,d)
                {
                  dta.ruta_imagen='subcategorias/'+dta.id+"."+ext;
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
        callback(new Error("Los campos de nombre, local y categoria son requeridos"),400,null);
      }
    }
    /**
    * Obtiene las subcategorias asociados al usuario
    * @param idUsuario identificador del usuario que solicita las subcategorias
    * @param callback función para comunicar el resultado
    */
    this.obtenerSubcategorias=function(idUsuario,callback)
    {
      var local=require('./Local.js')();
      local.obtenerLocales(idUsuario,function(error,locales)
      {
        var ids=new Array();
        for(var i=0;i<locales.length;i++)
        {
          ids.push(locales[i].id);
        }
        db.Subcategoria.find({id_local:{$in:ids}},{__v:0,_id:0},{sort: {id: 1}},function(error,subcategorias)
        {
          callback(error,subcategorias);
        });
      });
    }
    /**
    * Actualiza la subcategoria asociada al id
    * @param idSubcategoria identificador de la subcategoria en la base de datos
    * @param files  imagen a actualizar
    * @param fields   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarSubcategoria=function(idSubcategoria,files,fields,callback)
    {
      db.Subategoria.findOne({id:idSubcategoria},{__v:0,_id:0},function(error, subcategoria)
      {
        if(!error)
        {
          if(subcategoria)
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
            if(fields.id_categoria)
            {
              data.id_categoria=fields.id_categoria[0];
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
              if(subcategoria.ruta_imagen!='subcategorias/imagenPorDefecto.png')
              {
                f.eliminarArchivo('public/'+subcategoria.ruta_imagen,function(e,d)
                {
                  f.agregarArchivo('public/subcategorias/',subcategoria.id+"."+ext,fi,function(e,d)
                  {
                    data.ruta_imagen='subcategorias/'+subcategoria.id+"."+ext;
                    db.Subcategoria.update({id:subcategoria.id},{$set:data},function(e,d)
                    {
                      callback(error,200,Object.assign(subcategoria,data));
                    });
                    f.eliminarArchivo(fi.path,function(e,d){})
                  });
                });
              }
              else {
                f.agregarArchivo('public/subcategorias/',subcategoria.id+"."+ext,fi,function(e,d)
                {
                  data.ruta_imagen='subcategorias/'+subcategoria.id+"."+ext;
                  db.Subcategoria.update({id:subcategoria.id},{$set:data},function(e,d)
                  {
                    callback(error,200,Object.assign(subcategoria,data));
                  });
                  f.eliminarArchivo(fi.path,function(e,d){})
                });
              }
            }
            else {
              db.Subcategoria.update({id:subcategoria.id},{$set:data},function(e,d)
              {
                callback(error,200,Object.assign(subcategoria,data));
              });
            }
          }
          else {
            callback(new Error("Subcategoria no encontrada"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Elimina la subcategoria asociada al id
    * @param idSubcategoria identificador de la subcategoria en la base de datos
    * @param callback función para comunicar el resultado
    */
    this.eliminarSubcategoria=function(idSubcategoria,callback)
    {
      db.Subcategoria.findOne({id:idSubcategoria},{__v:0,_id:0},function(error,subcategoria)
      {
        if(!error)
        {
          if(subcategoria)
          {
            db.Subcategoria.remove({id:idSubcategoria},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                callback(error,200,subcategoria);
              }
            });
          }
          else {
            callback(new Error("Subcategoria no encontrada"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Obtiene las subcategorias de la categoria
    * @param idCategoria identificador de la categoria
    * @param callback función para comunicar el resultado
    */
    this.obtenerSubcategoriasDeCategoria=function(idCategoria,callback)
    {
      db.Subcategoria.find({id_categoria:idCategoria},{__v:0,_id:0},{sort: {id: 1}},function(error,data)
      {
        if(!error)
        {
          if(data.length>0)
          {
            var cate=new Array();
            var producto=require('./Producto.js')();
            for(var i=0;i<data.length;i++)
            {
              let ca=data[i];
              producto.obtenerProductosDeSubcategoria(ca.id,function(error,dta)
              {
                cate.push({id:ca.id,nombre:ca.nombre,id_local:ca.id_local,id_categoria:ca.id_categoria,
                  ruta_imagen:ca.ruta_imagen,productos:dta});
                  if(cate.length==data.length)
                  {
                    callback(null,cate);
                  }
                });
              }
            }
            else {
              callback(error,data);
            }
          }
          else {
            callback(error,[]);
          }
        });
      }
      /**
      * Obtiene la subcategoria asociada al id
      * @param idSubcategoria identificador de la subcategoria
      * @param callback función para comunicar el resultado
      */
      this.obtenerSubcategoria=function(idSubcategoria,callback)
      {
        db.Subcategoria.findOne({id:idSubcategoria},{__v:0,_id:0},function(error,dta)
        {
          if(!error)
          {
            if(dta)
            {
              callback(error,200,dta);
            }
            else {
              callback(new Error("Subcategoria no encontrada"),404,null);
            }
          }
          else {
            callback(error,400,null);
          }
        });
      }
      return this;
    }
    module.exports=Subcategoria;
