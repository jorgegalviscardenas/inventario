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
      return this;
    }
