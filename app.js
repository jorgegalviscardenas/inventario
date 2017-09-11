//
var env = process.env;
var express = require('express');
var config = require('./app-root/http/config/configToken.js');
var cors = require('cors')
var app = express();
var crypto=require('crypto');

//establecemos xcss-protection
var helmet = require('helmet');
app.use(helmet());
app.use(cors());
var http = require('http').createServer(app);
var socket= require('./app-root/http/socket.js');
socket.socket(http);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
//inicializamos los modelos de la base de datos
var database = require('./app-root/http/configdatabase.js');
database.conexion();
//establecemos las rutas que soporta la aplicacion
var routes = require('./app-root/http/routes.js');

app.use(routes);

 // create a new parser from a node ReadStream
 /**
 var parser = mm(fs.createReadStream("/home/jorge/workspace_node/HTMLFrankie/frankieapphtml/app/audio-sample/ezequiel_marotte__berlin's_east_side_gallery.mp3"),{duration:true}, function (err, metadata) {
   if (err) throw err;
   console.log(metadata);
 });
*/
http.listen(env.NODE_PORT || 3000, env.NODE_IP || '127.0.0.1', function() {
    console.log('Application worker started...');
});
