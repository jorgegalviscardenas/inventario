/**
* Se encarga de las operaciones referentes a las ordenes y subordenes
*/
function Orden()
{
  /**
  * Crea una nueva orden
  * @param data informacion de la orden
  * @param callback función para comunicar el resultado
  */
  this.crearOrden=function(data,callback)
  {
    if(data.telefono && data.mesa && data.ordenes)
    {
      if(data.ordenes.length>0)
      {
        var orden=new db.Orden({telefono:data.telefono,mesa_id:data.mesa,pago:false,
          estado_entrega:1,createdAt:new Date(Date.now())});
          orden.save(function(error,dataOrden)
          {
            cont =0;
            var subordenes=new Array();
            var producto=require('./Producto.js')();
            for(var i=0;i<data.ordenes.length;i++)
            {
              var ids=new Array();
              for(var j=0;j<data.ordenes[i].productos.length;j++)
              {
                ids.push(data.ordenes[i].productos[j].id);
              }
              producto.obtenerProductosSoloConPrecioSalida(ids,function(error,precios)
              {
                var total=0;
                for(var l=0;l<precios.length;l++)
                {
                  total=total+precios[l].precio_salida;
                }
                var suborden=new db.Orden({productos:data.ordenes[i].productos,
                  local_id:data.ordenes[i].local,estado_entrega:1,valor:total,
                  orden_id:dataOrden.id,createdAt:new Date(Date.now())});
                  suborden.save(function(error,dataSuborden)
                  {
                    subordenes.push(dataSuborden);
                    cont=cont+1;
                    if(data.ordenes.length==cont)
                    {
                      callback(null,Object.assign(dataOrden.toObject(),{ordenes:subordenes}));
                    }
                  });
                });

              }
            });
          }
          else {
            callback(new Error("La cantidad de ordenes deben ser mayor a cero"),null);
          }
        }
        else {
          callback(new Error("Telefono, mesa y ordenes son requeridas"),null);
        }
      }
      /**
      * Obtiene las ordenes asociadas al telefono
      * @param telefono numero de telefono del que se piden las ordenes
      * @param callback función para comunicar el resultado
      */
      this.obtenerOrdenesDeTelefono=function(numero,callback)
      {
        db.Orden.find({telefono:numero},{__v:0,_id:0},{$sort:{id:-1}},function(error,ordenes)
        {
          if(!error)
          {
            if(ordenes.length>0)
            {
              var subordenes=new Array();

            }
            else {
              callback(error,ordenes);
            }
          }
          else {
            callback(error,null);
          }

        });
      }
      /**
      * Obtiene el estado de entrega
      * @param id identificador del estado de entrega
      * @param callback función para comunicar el resultado
      */
      this.obtenerEstadoEntrega=function(id,callback)
      {
        db.EstadoEntrega.findOne({id:id},function(error,estadoEntrega)
        {
          callback(error,estadoEntrega);
        });
      }
      /**
      * Obtiene el detalle de la orden
      * @param orden orden con todos sus campos simples
      * @param mesa  modelo para hacer consultas referentes a las mesas
      * @param local modelo para hacer consultas referentes al local
      * @param producto modelo para hacer consultas referentes al producto
      * @param callback función para comunicar el resultado
      */
      this.obtenerDetalleOrden=function(orden,mesa,local,producto,callback)
      {
        mesa.obtenerMesa(orden.mesa_id,function(error,ms)
        {
          this.obtenerEstadoEntrega(orden.estado_entrega,function(error,estadoEntrega)
          {
            var cont=0;
            db.Suborden.find({orden_id:orden.id},{__v:0,_id:0},{sort:{id:1}},function(error,subordenes)
            {
              var subordenesArray=new Array();
              if(subordenes.length>0)
              {
                for(var i=0;i<subordenes.length;i++)
                {
                  let suborden=subordenes[i];
                  this.obtenerDetalleSuborden(suborden,function(error,sbor)
                  {

                  });
                }
              }
              else {
                var fullData={id:orden.id,telefono:orden.telefono,pago:orden.pago,
                  mesa:ms,estado_entrega:estadoEntrega,createdAt:orden.createdAt};
                }
              });
            });
          });

        }
        /**
        * Obtiene el detalle de la suborden
        * @param suborden suborden con los campos simples
        * @param local modelo para hacer consultas referentes a los locales
        * @param producto modelo para hacer consultas referentes a los productos
        * @param callback función para comunicar el resultado
        */
        this.obtenerDetalleSuborden=function(suborden,local,producto,callback)
        {
          local.obtenerLocal(suborden.local_id,function(error,lc)
          {
            this.obtenerEstadoEntrega(suborden.estado_entrega,function(error,estadoEntrega)
            {
              var proIds=new Array();
              for(var i=0;i<suborden.productos.length;i++)
              {
                proIds.push(suborden.productos[i].id);
              }
              if(proIds.length>0)
              {

                producto.obtenerProductosDesdeIds(proIds,function(error,productos)
                {
                  var productosFull=new Array();
                  if(productos.length>0)
                  {
                    for(var i=0;i<suborden.productos.length;i++)
                    {
                      for(var j=0;j<productos.length;j++)
                      {
                        if(productos[j].id==suborden.productos[i].id)
                        {
                          productosFull.push({producto:productos[j],cantidad:suborden.productos[i].cantidad});
                        }
                      }
                    }
                    var fullData={id:suborden.id,local:lc,estado_entrega:estadoEntrega,
                      valor:suborden.valor,orden_id:suborden.orden_id,
                      createdAt:orden.createdAt,productos:productosFull};
                    }
                    else {
                      var fullData={id:suborden.id,local:lc,estado_entrega:estadoEntrega,
                        valor:suborden.valor,orden_id:suborden.orden_id,
                        createdAt:orden.createdAt,productos:[]};
                      }
                    });
                  }
                  else {
                    var fullData={id:suborden.id,local:lc,estado_entrega:estadoEntrega,
                      valor:suborden.valor,orden_id:suborden.orden_id,
                      createdAt:orden.createdAt,productos:[]};
                    }
                  }
                });
              });
            }
            return this;
          }
