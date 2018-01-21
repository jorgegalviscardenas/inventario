
/**
* Establece la conexion al socket
*/
var socket = function(http)
{

  var io = require('socket.io')(http);
  io.on('connection',function(socket){
    socket.emit("init",{idSocket:socket.client.id});
    var sockets = io.sockets.sockets;
    socket.on('disconnect',function(){
      var telefonoSocket=require('./models/TelefonoSocket.js')();
      var usuarioSocket=require('./models/UsuarioSocket.js')();
      usuarioSocket.eliminarSocket(socket.client.id,function(error,data){
      });
      telefonoSocket.eliminarSocket(socket.client.id,function(error,data){
      });
    });
    /**
    * Evento para registrar un usuaro con el socket
    */
    socket.on("registrar:usuario",function(idUsuario){
      var usuarioSocket=require('./models/UsuarioSocket.js')();
      usuarioSocket.guardar(idUsuario,socket.client.id,function(error,data){
      });
    });
    /**
    * Evento para registrar un telefono con el socket
    */
    socket.on("registrar:cliente",function(telefono){
      var telefonoSocket=require('./models/TelefonoSocket.js')();
      telefonoSocket.guardar(telefono,socket.client.id,function(error,data){

      });
    });
  });
  /**
  * Variable global para obtener el objeto io, para conocer los sockets
  */
  global.io=io;
}
module.exports.socket = socket;
