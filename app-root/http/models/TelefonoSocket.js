/**
* Se encarga de las operaciones referentes al socket asociado al telefono
*/
function TelefonoSocket()
{
  /**
  * Guarda un telefono socket, si el socket existe, crea uno nuevo, de lo
  * contrario lo elimina
  * @param telefono número de telefono al que se asocia el socket
  * @param idSocket identificador del socket
  * @param callback función para comuicar el resultado
  */
  this.guardar=function(telefono,idSocket,callback){
    db.TelefonoSocket.findOne({telefono:telefono},function(error,data){
      var updatedAt=new Date(Date.now());
      if(!data){
        var newData={telefono:telefono,id_socket:idSocket,updatedAt:updatedAt};
        var telefonoSocket=new db.TelefonoSocket(newData);
        telefonoSocket.save(function(error,dataTelefonoSocket){
          callback(error,dataTelefonoSocket);
        });
      }else {
        db.TelefonoSocket.update({telefono:telefono},{$set:{id_socket:idSocket,
          updatedAt:updatedAt}},function(error,dataTelefonoSocket)
          {
            data.id_socket=idSocket;
            data.updatedAt=updatedAt;
            callback(error,data);
          });
        }
      });
    }
    /**
    * Obtiene el telefono socket, asociado al id del usuario
    * @param telefono  telefono del usuario
    * @param callback función para comunicar el resultado
    */
    this.obtenerTelefonoSocket=function(telefono,callback){
      db.TelefonoSocket.findOne({telefono:telefono},function(error,data){
        callback(error,data);
      });
    }
    /**
    * Elimina el socket asociado al telefono
    * @param idSocket identificador del socket
    * @param callback función para comunicar el resultado
    */
    this.eliminarSocket=function(idSocket,callback){
      db.TelefonoSocket.remove({id_socket:idSocket},function(error,data){
        callback(error,data);
      });
    }
    return this;
  }
  module.exports=TelefonoSocket;
