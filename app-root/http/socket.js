/**
* Establece la conexion al socket
*/
var socket = function(http)
{
  var io = require('socket.io')(http);
  io.on('connection',function(socket){
    console.log(socket.request._query);
    socket.emit("init",{hola:socket.request._query.telefono});
    var sockets = io.sockets.sockets;
    socket.on('disconnect',function(){

    });
  });
  /**
  * Variable global para obtener el objeto io, para conocer los sockets
  */
  global.io=io;
}
module.exports.socket = socket;
