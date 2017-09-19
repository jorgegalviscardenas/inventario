/**
* Se encarga de enviara notificaciones por web socket
*/
function Notificacion()
{

  /**
  * Envia la notificación de una orden para un miembro de un local
  * @param evento cadena que representa el nombre del evento por el que se envia
  * la notificación
  * @param recurso objeto que se envia
  * @param idLocal identificador del local sobre el que se notifica la orden
  * @param idPermiso identificador del permiso para saber que se le puede enviar
  * la notificación
  * @param callback función para comunicar el resultado
  */
  this.enviarNotificacionOrdenLocal=function(evento,recurso,idLocal,idPermiso,callback)
  {
    var cant=0;
    for(var socket in io.sockets.sockets)
    {
      if(io.sockets.sockets[socket].request._query.locales && io.sockets.sockets[socket].request._query.permisos)
      {
        var locales=JSON.parse(io.sockets.sockets[socket].request._query.locales);
        var permisos=JSON.parse(io.sockets.sockets[socket].request._query.permisos);
        if(locales.indexOf(idLocal)!=-1)
        {
          if(permisos.indexOf(idPermiso)!=-1)
          {
            io.sockets.sockets[socket].emit(evento,recurso);
            cant=cant+1;
          }
        }
      }
    }
    if(cant>0)
    {
      callback(null,recurso);
    }
    else {
      callback(new Error("Usuario de local no encontrado"),recurso);
    }
  }
  /**
  * Envia la notificación de una orden para un cliente
  * @param evento  cadena que representa el nombre del evento por el que se envia
  * la notificación
  * @param telefono telefono del cliente
  * @param callback función para comunicar el resultado
  */
  this.enviarNotificacionOrdenCliente=function(evento,recurso,telefono,callback)
  {
    var cant=0;
    for(var socket in io.sockets.sockets)
    {
      if(io.sockets.sockets[socket].request._query.telefono)
      {
        if(io.sockets.sockets[socket].request._query.telefono==telefono)
        {
          io.sockets.sockets[socket].emit(evento,recurso);
          cant=cant+1;
        }
      }
    }
    if(cant>0)
    {
      callback(null,recurso);
    }
    else {
      callback(new Error("Cliente no encontrado"),recurso);
    }
  }
  return this;
}
module.exports=Notificacion;
