/**
* Configura las rutas a las que se puede acceder
*/
var express = require('express');
var app = express();
//obtenemos el enrutador
var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//definimos los controladores
var authCtrl = require('./controllers/ControladorAutenticacion.js');
//definimos los middlewares

//rutas
router.post('/login',authCtrl.autenticar);
router.get('/restart',function(request,response)
{
  var us = require('./models/Usuario.js')();
  us.porDefecto();
  response.status(200).send({});
});
module.exports = router;
