/**
* Establece la conexion al socket
*/
var socket = function(http)
{
  var io = require('socket.io')(http);
  io.on('connection',function(socket){
    socket.emit("init",{hola:socket.request._query.idUser});
    console.log('one user connected '+socket.id);
    var sockets = io.sockets.sockets;
    socket.on('disconnect',function(){
      console.log('one user disconnected '+socket.id);
    });
  });
  /**
  * Variable global para obtener el objeto io, para conocer los sockets
  */
  global.io=io;
}
module.exports.socket = socket;
