/**
* Representa un proveedor
*/
function Proveedor()
{
  /**
  * Crea un nuevo proveedor
  * @param data la información del proveedor a crear
  * @param idUsuario identificador del usuario que hace la peticion
  * @param callback función para comunicar el resultado
  */
  this.crearProveedor=function(data,idUsuario,callback)
  {
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(data.nombre && data.apellido && data.email && data.telefono && data.direccion)
    {
      var newData={nombre:data.nombre,apellido:data.apellido,email:data.email,
        telefono:data.telefono,direccion:data.direccion,createdAt:createdAt,
        updatedAt:updatedAt,cliente_de:idUsuario};
        var proveedor=new db.Proveedor(newData);
        proveedor.save(function(error,dta)
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
    * Obtiene los proveedores asociados al usuario
    * @param idUsuario identificador del usuario que solicita los proveedores
    * @param callback función para comunicar el resultado
    */
    this.obtenerProveedores=function(idUsuario,callback)
    {
      db.Proveedor.find({proveedor_de: idUsuario},{__v:0,_id:0},{sort: {id: 1}}, function(error, proveedores)
      {
        callback(error, proveedores);
      });
    }
    /**
    * Actualiza el proveedor asociado al id, y al identificador del usuario
    * @param idCliente identificador del cliente en la base de datos
    * @param idUsuario identificador del usuario en la base de datos
    * @param data   información a actualizar
    * @param callback función para comunicar el resultado
    */
    this.actualizarProveedor=function(idProveedor,idUsuario,data,callback)
    {
      db.Proveedor.findOne({id:idProveedor,proveedor_de: idUsuario},{__v:0,_id:0},function(error, proveedor)
      {
        if(!error)
        {
          if(proveedor)
          {
            data.updatedAt=new Date(Date.now());
            db.Proveedor.update({id:idProveedor},{$set:data},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                proveedor=Object.assign(proveedor,data);
                callback(error,200,proveedor);
              }
            });
          }
          else {
            callback(new Error("Proveedor no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    /**
    * Elimina el proveedor asociado al id y al id del usuario
    * @param idCliente identificador del cliente en la base de datos
    * @param idUsuario identificador del usuario
    * @param callback función para comunicar el resultado
    */
    this.eliminarProveedor=function(idProveedor,idUsuario,callback)
    {
      db.Proveedor.findOne({id:idProveedor,proveedor_de: idUsuario},{__v:0,_id:0},function(error, proveedor)
      {
        if(!error)
        {
          if(proveedor)
          {
            db.Proveedor.remove({id:idProveedor},function(error,dta)
            {
              if(error)
              {
                callback(error,400,null);
              }
              else {
                callback(error,200,proveedor);
              }
            });
          }
          else {
            callback(new Error("Proveedor no encontrado"),404,null);
          }
        }
        else {
          callback(error,400,null);
        }
      });
    }
    return this;
  }
  module.exports=Proveedor;
