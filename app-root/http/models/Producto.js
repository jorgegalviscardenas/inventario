/**
* Representa un producto
*/
function Producto()
{
  /**
  * Crea un nuevo producto
  * @param files donde vienen las imagenes
  * @param fields los campos
  * @param callback función para comunicar el resultado
  */
  this.crearProducto=function(files,fields,callback)
  {
    var keys=Object.keys(files);
    var fils=new Array();
    for (i=0 ; i < keys.length; i++)
    {
      fils.push(files[keys[i]][0]);
    }
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(fields.nombre && fields.id_local && fields.precio_entrada && fields.precio_salida
      && fields.unidad && fields.id_subcategoria)
      {
        var newData={nombre:fields.nombre[0],id_local:fields.id_local[0],
          precio_entrada:fields.precio_entrada[0],precio_salida:fields.precio_salida[0]
          ,unidad:fields.unidad[0],createdAt:createdAt,updatedAt:updatedAt};
          if(fields.id_subcategoria)
          {
            newData.id_subcategoria=fields.id_subcategoria[0];
          }
          if(fields.descripcion)
          {
            newData.descripcion=fields.descripcion[0];
          }
          if(fields.minima_inventario)
          {
            newData.minima_inventario=fields.minima_inventario[0];
          }
          if(fields.presentacion)
          {
            newData.presentacion=fields.presentacion[0];
          }
          var producto=new db.Producto(newData);
          producto.save(function(error,dta1)
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
                f.agregarArchivo('public/productos/',dta.id+"."+ext,fi,function(e,d)
                {
                  db.Producto.update({id:dta.id},{$set:{ruta_imagen:'productos/'+dta.id+"."+ext}},function(e,d)
                  {
                    dta.ruta_imagen='productos/'+dta.id+"."+ext;
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
          callback(new Error("Los campos de nombre, local, precio entrada, precio salida, subcategoria y unidad son requeridos"),400,null);
        }
      }
      /**
      * Obtiene las productos asociados al usuario
      * @param idUsuario identificador del usuario que solicita los productos
      * @param callback función para comunicar el resultado
      */
      this.obtenerProductos=function(idUsuario,callback)
      {
        var local=require('./Local.js')();
        local.obtenerLocales(idUsuario,function(error,locales)
        {
          var ids=new Array();
          for(var i=0;i<locales.length;i++)
          {
            ids.push(locales[i].id);
          }
          db.Producto.find({id_local:{$in:ids}},{__v:0,_id:0},{sort: {id: 1}},function(error,productos)
          {
            callback(error,productos);
          });
        });
      }
      /**
      * Actualiza el producto asociado al id
      * @param idProducto identificador del producto en la base de datos
      * @param files  imagen a actualizar
      * @param fields   información a actualizar
      * @param callback función para comunicar el resultado
      */
      this.actualizarProducto=function(idProducto,files,fields,callback)
      {
        db.Producto.findOne({id:idProducto},{__v:0,_id:0},function(error, producto)
        {
          if(!error)
          {
            if(producto)
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
              if(fields.precio_entrada)
              {
                data.precio_entrada=fields.precio_entrada[0];
              }
              if(fields.precio_salida)
              {
                data.precio_salida=fields.precio_salida[0];
              }
              if(fields.unidad)
              {
                data.unidad=fields.unidad[0];
              }
              if(fields.id_subcategoria)
              {
                data.id_subcategoria=fields.id_subcategoria[0];
              }
              if(fields.descripcion)
              {
                data.descripcion=fields.descripcion[0];
              }
              if(fields.minima_inventario)
              {
                data.minima_inventario=fields.minima_inventario[0];
              }
              if(fields.presentacion)
              {
                data.presentacion=fields.presentacion[0];
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
                if(producto.ruta_imagen!='productos/imagenPorDefecto.png')
                {
                  f.eliminarArchivo('public/'+producto.ruta_imagen,function(e,d)
                  {
                    f.agregarArchivo('public/productos/',producto.id+ext,fi,function(e,d)
                    {
                      data.ruta_imagen='productos/'+producto.id+ext;
                      db.Producto.update({id:producto.id},{$set:data},function(e,d)
                      {
                        callback(error,200,Object.assign(producto,data));
                      });
                      f.eliminarArchivo(fi.path,function(e,d){})
                    });
                  });
                }
                else {
                  f.agregarArchivo('public/productos/',producto.id+ext,fi,function(e,d)
                  {
                    data.ruta_imagen='productos/'+producto.id+ext;
                    db.Producto.update({id:producto.id},{$set:data},function(e,d)
                    {
                      callback(error,200,Object.assign(producto,data));
                    });
                    f.eliminarArchivo(fi.path,function(e,d){})
                  });
                }
              }
              else {
                db.Producto.update({id:producto.id},{$set:data},function(e,d)
                {
                  callback(error,200,Object.assign(producto,data));
                });
              }
            }
            else {
              callback(new Error("Producto no encontrado"),404,null);
            }
          }
          else {
            callback(error,400,null);
          }
        });
      }
      /**
      * Elimina el producto asociado al id
      * @param idProducto identificador del producto en la base de datos
      * @param callback función para comunicar el resultado
      */
      this.eliminarProducto=function(idProducto,callback)
      {
        db.Producto.findOne({id:idProducto},{__v:0,_id:0},function(error, producto)
        {
          if(!error)
          {
            if(producto)
            {
              db.Producto.remove({id:idProducto},function(error,dta)
              {
                if(error)
                {
                  callback(error,400,null);
                }
                else {
                  callback(error,200,producto);
                }
              });
            }
            else {
              callback(new Error("Producto no encontrado"),404,null);
            }
          }
          else {
            callback(error,400,null);
          }
        });
      }
      /**
      * Obtiene los productos de la subcategoria
      * @param idSubcategoria identificador de la subcategoria
      * @param callback función para comunicar el resultado
      */
      this.obtenerProductosDeSubcategoria=function(idSubcategoria,callback)
      {
        db.Producto.find({id_subcategoria:idSubcategoria},{__v:0,_id:0},{sort: {id: 1}},function(error,data)
        {
          callback(error,data);
        });
      }
      return this;
    }
    module.exports=Producto;
