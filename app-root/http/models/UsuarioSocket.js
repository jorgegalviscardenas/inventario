/**
* Se encarga de las operaciones referentes al socket asociado al usuario
*/
function UsuarioSocket()
{
  /**
  * Guarda un usuario socket, si el socket existe, crea uno nuevo, de lo
  * contrario lo elimina
  * @param idUsuario identificador del usuario al que se le asocia el socket
  * @param idSocket identificador del socket
  * @param callback funciòn para comuicar el resultado
  */
  this.guardar=function(idUsuario,idSocket,callback){
    db.UsuarioSocket.findOne({id_usuario:idUsuario},function(error,data){
      var updatedAt=new Date(Date.now());
      if(!data){
        var newData={id_usuario:idUsuario,id_socket:idSocket,updatedAt:updatedAt};
        var usuarioSocket=new db.UsuarioSocket(newData);
        usuarioSocket.save(function(error,dataUsuarioSocket){
          callback(error,dataUsuarioSocket);
        });
      }else {
        db.UsuarioSocket.update({id_usuario:idUsuario},{$set:{id_socket:idSocket,
          updatedAt:updatedAt}},function(error,dataUsuarioSocket)
          {
            data.id_socket=idSocket;
            data.updatedAt=updatedAt;
            callback(error,data);
          });
        }
      });
    }
    /**
    * Obtiene el usuario socket, asociado al id del usuario
    * @param idUsuario identificador del usuario
    * @param callback función para comunicar el resultado
    */
    this.obtenerUsuarioSocket=function(idUsuario,callback){
      db.UsuarioSocket.findOne({id_usuario:idUsuario},function(error,data){
        callback(error,data);
      });
    }
    /**
    * Elimina el socket asociado al usuario
    * @param idSocket identificador del socket
    * @param callback función para comunicar el resultado
    */
    this.eliminarSocket=function(idSocket,callback){
      db.UsuarioSocket.remove({id_socket:idSocket},function(error,data){
        callback(error,data);
      });
    }
    return this;
  }
  module.exports=UsuarioSocket;
