/**
* Representa un cliente
*/
function Cliente()
{
  /**
  * Crea un nuevo cliente
  * @param data la información del cliente a crear
  * @param idUsuario identificador del usuario que hace la peticion
  * @param callback función para comunicar el resultado
  */
  this.crearCliente=function(data,idUsuario,callback)
  {
    var createdAt=new Date(Date.now());
    var updatedAt=new Date(Date.now());
    if(data.nombre && data.apellido && data.email && data.telefono && data.direccion)
    {
      var newData={nombre:data.nombre,apellido:data.apellido,email:data.email,
        telefono:data.telefono,direccion:data.direccion,createdAt:createdAt,
        updatedAt:updatedAt,cliente_de:idUsuario};
        var cliente=new db.Cliente(newData);
        cliente.save(function(error,dta1)
        {
          var dta;
          if(dta1)
          {
            dta=dta1.toObject();
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
    return this;
  }
  module.exports=Cliente;
