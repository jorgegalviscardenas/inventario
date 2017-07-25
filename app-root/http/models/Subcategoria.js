/**
* Representa una subcategoria
*/
function Subcategoria()
{
  /**
  * Crea una nueva subcategoria
  * @param data la información de la subcategoria a crear
  * @param idUsuario identificador del usuario que hace la peticion
  * @param callback función para comunicar el resultado
  */
  this.crearSubcategoria=function(data,idUsuario,callback)
  {
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(data.nombre && data.id_local)
    {
      var newData={nombre:data.nombre,id_local:data.id_local,createdAt:createdAt,updatedAt:updatedAt};
        var subcategoria=new db.Subcategoria(newData);
        subcategoria.save(function(error,dta)
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
        callback(new Error("Los campos de nombre y local son requeridos"),400,null);
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
    * @param data   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarSubcategoria=function(idSubcategoria,data,callback)
    {
      db.Subcategoria.findOne({id:idSubcategoria},{__v:0,_id:0},function(error, subcategoria)
      {
        if(!error)
        {
          if(subcategoria)
          {
            data.updatedAt=new Date(Date.now());
            db.Subcategoria.update({id:idSubcategoria},{$set:data},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                subcategoria=Object.assign(subcategoria,data);
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
    return this;
  }
  module.exports=Subcategoria;
