/**
* Maneja operaciones referentes a las mesas
*/
function Mesa()
{
  /**
  * Agrega una nueva mesa
  * @param data información a guardar en la base de datos
  * @param idEmpresa  identificador de la empresa al que esta asociado la mesa
  * @param callback función para comunicar el resultado
  */
  this.agregarMesa=function(data,idEmpresa,callback)
  {
    if(data.nombre)
    {
      var mesa=new db.Mesa({nombre:data.nombre,id_empresa:idEmpresa,createdAt:new Date(Date.now),
        updatedAt:new Date(Date.now())});
        mesa.save(function(error,dta1)
        {
          var dta=dta1.toObject();
          delete dta.__v;
          delete dta._id;
          callback(error,dta1);
        })
      }
      else {
        callback(new Error("El nombre de la mesa es requerido"),null);
      }
    }
    /**
    * Obtiene las mesas asociadas a la empresa
    * @param idEmpresa identificador de la empresa
    * @param callback función para comunicar el resultado
    */
    this.obtenerMesas=function(idEmpresa,callback){
      db.Mesa.find({id_empresa:idEmpresa},{__v:0,_id:0},{sort:{id:1}},function(error,data)
      {
        callback(error,data);
      });
    }
    /**
    * Actualiza la información de una mesa
    * @param idEmpresa identificador de la empresa al que pertenece la mesa
    * @param idMesa   identificador de la mesa
    */
    this.actualizarMesa=function(idEmpresa,idMesa,data,callback)
    {
      db.Mesa.findOne({id:idMesa,id_empresa:idEmpresa},{__v:0,_id:0},null,function(error,mesa)
      {
        if(!error)
        {
          if(mesa)
          {
            if(data.nombre)
            {
              mesa.nombre=nombre;
            }
            db.Mesa.update({id:idMesa,id_empresa:idEmpresa},{$set:mesa},function(error,dta)
            {
              if(!error)
              {
                callback(error,200,mesa);
              }
              else {
                callback(error,400,mesa);
              }
            });
          }
          else{
            callback(new Error("Mesa no encontrada"),404,mesa);
          }
        }
        else {
          callback(error,400,mesa);
        }
      });
    }
    /**
    * Elimina una mesa
    * @param idEmpresa identificador de la empresa a la que pertenece la mesa
    * @param idMesa identificador de la mesa
    * @param callback función para comunicar el resultado
    */
    this.eliminarMesa=function(idEmpresa,idMesa,callback)
    {
      db.Mesa.findOne({id:idMesa,id_empresa:idEmpresa},{__v:0,_id:0},null,function(error,mesa)
      {
        if(!error)
        {
          if(mesa)
          {
            db.Mesa.remove({id:idMesa,id_empresa:idEmpresa},function(error,dta)
            {
              if(!error)
              {
                callback(error,200,mesa);
              }
              else {
                callback(error,400,mesa);
              }
            });
          }
          else{
            callback(new Error("Mesa no encontrada"),404,mesa);
          }
        }
        else {
          callback(error,400,mesa);
        }
      });
    }
    /**
    * Obtiene la mesa asociada al id
    * @param id identificador de la mesa
    * @param callback función para comunicar el resultado
    */
    this.obtenerMesa=function(id,callback)
    {
      db.Mesa.findOne({id:id},function(error,mesa)
      {
        callback(error,mesa);
      });
    }
    return this;
  }
  module.exports=Mesa;
