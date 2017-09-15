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
              let sbor=data.ordenes[i];
              producto.obtenerProductosSoloConPrecioSalida(ids,function(error,precios)
              {
                var total=0;
                for(var l=0;l<precios.length;l++)
                {
                  total=total+precios[l].precio_salida;
                }
                var suborden=new db.Suborden({productos:sbor.productos,
                  local_id:sbor.local,estado_entrega:1,valor:total,mesa_id:data.mesa,
                  orden_id:dataOrden.id,createdAt:new Date(Date.now())});
                  suborden.save(function(error,dataSuborden)
                  {
                    subordenes.push(dataSuborden);
                    cont=cont+1;
                    if(data.ordenes.length==cont)
                    {
                      var mesa=require('./Mesa.js')();
                      var local=require('./Local.js')();
                      var producto=require('./Producto.js')();
                      this.obtenerDetalleOrdenFull(dataOrden,mesa,local,producto,function(error,ordenFull)
                      {
                        callback(error,ordenFull);
                      });
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
              var mesa=require('./Mesa.js')();
              var local=require('./Local.js')();
              var producto=require('./Producto.js')();
              var ordenesArray=new Array();
              var cont=0;
              for(var i=0;i<ordenes.length;i++)
              {
                let ord=ordenes[i];
                obtenerDetalleOrdenFull(ord,mesa,local,producto,function(error,ordenFull){
                  ordenesArray.push(ordenFull);
                  cont=cont+1;
                  if(cont==ordenes.length)
                  {
                    ordenesArray.sort(function(a, b) {
                      return b.id - a.id;
                    });
                    callback(error,ordenesArray);
                  }
                });
              }
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
        db.EstadoEntrega.findOne({id:id},{__v:0,_id:0},null,function(error,estadoEntrega)
        {
          callback(error,estadoEntrega);
        });
      }
      /**
      * Obtiene el detalle de la orden de manera completa con sus subordenes
      * @param orden orden con todos sus campos simples
      * @param mesa  modelo para hacer consultas referentes a las mesas
      * @param local modelo para hacer consultas referentes al local
      * @param producto modelo para hacer consultas referentes al producto
      * @param callback función para comunicar el resultado
      */
      this.obtenerDetalleOrdenFull=function(orden,mesa,local,producto,callback)
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
                  obtenerDetalleSuborden(suborden,local,producto,function(error,sbor)
                  {
                    cont=cont+1;
                    subordenesArray.push(sbor);
                    if(cont==subordenes.length)
                    {
                      var fullData={id:orden.id,telefono:orden.telefono,pago:orden.pago,
                        mesa:ms,estado_entrega:estadoEntrega,createdAt:orden.createdAt,ordenes:subordenesArray};
                        callback(error,fullData);
                      }
                    });
                  }
                }
                else {
                  var fullData={id:orden.id,telefono:orden.telefono,pago:orden.pago,
                    mesa:ms,estado_entrega:estadoEntrega,createdAt:orden.createdAt,ordenes:[]};
                    callback(error,fullData);
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
          * @param mesa información de la mesa a la que esta asociada la suborden
          * @param callback función para comunicar el resultado
          */
          this.obtenerDetalleSuborden=function(suborden,local,producto,mesa,callback)
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
                        createdAt:suborden.createdAt,productos:productosFull,mesa:mesa};
                        callback(error,fullData);
                      }
                      else {
                        var fullData={id:suborden.id,local:lc,estado_entrega:estadoEntrega,
                          valor:suborden.valor,orden_id:suborden.orden_id,
                          createdAt:orden.createdAt,productos:[],mesa:mesa};
                          callback(error,fullData);
                        }
                      });
                    }
                    else {
                      var fullData={id:suborden.id,local:lc,estado_entrega:estadoEntrega,
                        valor:suborden.valor,orden_id:suborden.orden_id,
                        createdAt:orden.createdAt,productos:[],mesa:mesa};
                        callback(error,fullData);
                      }
                    });
                  });
                }
                /**
                * Actualiza el estado de la orden
                * @param idOrden identificador de la orden
                * @param idEstado identificador del estado al que se va a modificar
                * @param callback función para comunicar el resultado
                */
                this.actualizarEstadoOrden=function(idOrden,idEstado,callback)
                {
                  db.Orden.findOne({id:idOrden},function(error,orden)
                  {
                    if(!error)
                    {
                      if(orden)
                      {
                        db.Orden.update({id:idOrden},{$set:{estado_entrega:idEstado}},function(error,data)
                        {
                          callback(error,200,data);
                          db.Suborden.update({orden_id:idOrden},{$set:{estado_entrega:idEstado}},function(err,dat)
                          {
                          });
                        });
                      }
                      else {
                        callback(new Error("Orden no encontrada"),404,null);
                      }
                    }
                    else{
                      callback(error,400,null);
                    }
                  });
                }
                /**
                * Actualiza el estado de la suborden
                * @param idSuborden identificador de la suborden
                * @param idEstado identificador del estado al que se va a modificar
                * @param callback función para comunicar el resultado
                */
                this.actualizarEstadoSuborden=function(idSuborden,idEstado,callback)
                {
                  db.Suborden.findOne({id:idSuborden},function(error,suborden)
                  {
                    if(!error)
                    {
                      if(suborden)
                      {
                        db.Suborden.update({id:idSuborden},{$set:{estado_entrega:idEstado}},function(error,data)
                        {
                          callback(error,200,data);
                          db.Suborden.findOne({orden_id:suborden.orden_id},{estado_entrega:1},{sort:{estado_entrega:1}},function(error,dta)
                          {
                            db.Orden.update({id:suborden.orden_id},{$set:{estado_entrega:dta.estado_entrega}},function(error,data)
                            {
                            });
                          });
                        });
                      }
                      else {
                        callback(new Error("Suborden no encontrada"),404,null);
                      }
                    }
                    else {
                      callback(error,400,null);
                    }
                  });
                }
                return this;
              }
              /**
              * Obtiene las ordenes asociadas a los locales
              * @param ids identificadores de los locales
              * @param callback función para comunicar el resultado
              */
              this.obtenerOrdenesLocales=function(ids,callback)
              {
                db.Suborden.find({local_id:{$in:ids}},{orden_id:1},{sort:{orden_id:1}},function(error,ordenesIds)
                {
                  if(!error)
                  {
                    if(ordenesIds.length>0)
                    {
                      var newIds=new Array();
                      for(var i=0;i<ordenesIds.length;i++)
                      {
                        if(newIds.indexOf(ordenesIds[i].orden_id)==-1)
                        {
                          newIds.push(ordenesIds[i].orden_id);
                        }
                      }
                      var newOrdenes=new Array();
                      db.Orden.find({id:{$in:newIds}},{__v:0,_id:0},{sort:{estado_entrega:1}},function(error,ordenes)
                      {
                        if(!error)
                        {
                          if(ordenes.length>0)
                          {
                            var cont=0;
                            var mesa=require('./Mesa.js')();
                            for(var i=0;i<ordenes.length;i++)
                            {
                              obtenerDetalleOrdenSimple(ordenes[i],mesa,function(error,orden)
                              {
                                newOrdenes.push(orden);
                                cont++;
                                if(cont==ordenes.length)
                                {
                                  newOrdenes.sort(function(a, b) {
                                    return a.estado_entrega- b.estado_entrega;
                                  });
                                  callback(null,newOrdenes);
                                }
                              });
                            }
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
                    else {
                      callback(null,[]);
                    }
                  }
                  else {
                    callback(error,null);
                  }

                });
              }
              /**
              * Obtiene el detalle de la orden de manera completa sin sus subordenes
              * @param orden orden con todos sus campos simples
              * @param mesa  modelo para hacer consultas referentes a las mesas
              * @param callback función para comunicar el resultado
              */
              this.obtenerDetalleOrdenSimple=function(orden,mesa,callback)
              {
                mesa.obtenerMesa(orden.mesa_id,function(error,ms)
                {
                  this.obtenerEstadoEntrega(orden.estado_entrega,function(error,estadoEntrega)
                  {
                    var fullData={id:orden.id,telefono:orden.telefono,pago:orden.pago,
                      mesa:ms,estado_entrega:estadoEntrega,createdAt:orden.createdAt};
                      callback(error,fullData);
                    });
                  });

                }
                /**
                * Obtiene las subordenes asociadas a los locales, pero con
                * los datos básicos
                * @param ids  identificadores de los locales
                * @param callback función para comunicar el resultado
                */
                this.obtenerSubordenesLocales=function(ids,callback)
                {
                  db.Suborden.find({local_id:{$in:ids}},{__v:0,_id:0},
                    {sort:{estado_entrega:1}},function(error,subordenes)
                    {
                      if(!error)
                      {
                        if(subordenes.length>0)
                        {
                          var newSubordenes=new Array();
                          var cont=0;
                          var mesa=require('./Mesa.js')();
                          for(var i=0;i<subordenes.length;i++)
                          {
                            obtenerDetalleSubordenSimple(subordenes[i],mesa,
                              function(error,suborden)
                              {
                                newSubordenes.push(suborden);
                                cont++;
                                if(cont==subordenes.length)
                                {
                                  newSubordenes.sort(function(a, b) {
                                    return a.estado_entrega- b.estado_entrega;
                                  });
                                  callback(null,newSubordenes);
                                }
                              });
                            }
                          }
                          else {
                            callback(null,[]);
                          }
                        }
                        else {
                          callback(error,null);
                        }
                      });
                    }
                    /**
                    * Obtiene el detalle de una suborden pero con su datos basicos
                    * @param suborden suborden con datos imples
                    * @param mesa modelo para hacer consultas sobre las mesas
                    * @param callback función para comunicar el resultado
                    */
                    this.obtenerDetalleSubordenSimple=function(suborden,mesa,callback)
                    {
                      mesa.obtenerMesa(suborden.mesa_id,function(error,ms)
                      {
                        this.obtenerEstadoEntrega(suborden.estado_entrega,function(error,estadoEntrega)
                        {
                          var fullData={id:suborden.id,estado_entrega:estadoEntrega,
                            valor:suborden.valor,orden_id:suborden.orden_id,
                            createdAt:suborden.createdAt,mesa:ms};
                            callback(error,fullData);
                          });
                        });
                      }
                      return this;
                    }
                    module.exports=Orden;
