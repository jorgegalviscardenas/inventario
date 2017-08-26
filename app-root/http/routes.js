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
var categoriasCtrl=require('./controllers/ControladorCategorias.js');
var clientesCtrl=require('./controllers/ControladorClientes.js');
var localesCtrl=require('./controllers/ControladorLocales.js');
var productosCtrl=require('./controllers/ControladorProductos.js');
var proveedoresCtrl=require('./controllers/ControladorProveedores.js');
var subcategoriasCtrl=require('./controllers/ControladorSubcategorias.js');
var usuariosCtrl=require('./controllers/ControladorUsuarios.js');
var promocionesCtrl=require('./controllers/ControladorPromociones.js');
var mesasCtrl=require('./controllers/ControladorMesas.js');
//definimos los middlewares
var middlewareAuth = require('./middleware/MiddlewareAuth.js');
//rutas
router.post('/login',authCtrl.autenticar);
//CATEGORIAS
router.post('/categorias',middlewareAuth.ensureAuthenticated,categoriasCtrl.agregarCategoria);
router.get('/categorias',middlewareAuth.ensureAuthenticated,categoriasCtrl.obtenerCategorias);
router.put('/categorias/:id',middlewareAuth.ensureAuthenticated,categoriasCtrl.actualizarCategoria);
router.delete('/categorias/:id',middlewareAuth.ensureAuthenticated,categoriasCtrl.eliminarCategoria);
//CLIENTES
router.post('/clientes',middlewareAuth.ensureAuthenticated,clientesCtrl.agregarCliente);
router.get('/clientes',middlewareAuth.ensureAuthenticated,clientesCtrl.obtenerClientes);
router.put('/clientes/:id',middlewareAuth.ensureAuthenticated,clientesCtrl.actualizarCliente);
router.delete('/clientes/:id',middlewareAuth.ensureAuthenticated,clientesCtrl.eliminarCliente);
//LOCALES
router.post('/locales',middlewareAuth.ensureAuthenticated,localesCtrl.agregarLocal);
router.get('/locales',middlewareAuth.ensureAuthenticated,localesCtrl.obtenerLocales);
router.put('/locales/:id',middlewareAuth.ensureAuthenticated,localesCtrl.actualizarLocal);
router.delete('/locales/:id',middlewareAuth.ensureAuthenticated,localesCtrl.eliminarLocal);
//PRODUCTOS
router.post('/productos',middlewareAuth.ensureAuthenticated,productosCtrl.agregarProducto);
router.get('/productos',middlewareAuth.ensureAuthenticated,productosCtrl.obtenerProductos);
router.put('/productos/:id',middlewareAuth.ensureAuthenticated,productosCtrl.actualizarProducto);
router.delete('/productos/:id',middlewareAuth.ensureAuthenticated,productosCtrl.eliminarProducto);
//PROVEEDORES
router.post('/proveedores',middlewareAuth.ensureAuthenticated,proveedoresCtrl.agregarProveedor);
router.get('/proveedores',middlewareAuth.ensureAuthenticated,proveedoresCtrl.obtenerProveedores);
router.put('/proveedores/:id',middlewareAuth.ensureAuthenticated,proveedoresCtrl.actualizarProveedor);
router.delete('/proveedores/:id',middlewareAuth.ensureAuthenticated,proveedoresCtrl.eliminarProveedor);
//SUBCATEGORIAS
router.post('/subcategorias',middlewareAuth.ensureAuthenticated,subcategoriasCtrl.agregarSubcategoria);
router.get('/subcategorias',middlewareAuth.ensureAuthenticated,subcategoriasCtrl.obtenerSubcategorias);
router.put('/subcategorias/:id',middlewareAuth.ensureAuthenticated,subcategoriasCtrl.actualizarSubcategoria);
router.delete('/subcategorias/:id',middlewareAuth.ensureAuthenticated,subcategoriasCtrl.eliminarSubcategoria);
//USUARIOS
router.post('/usuarios',middlewareAuth.ensureAuthenticated,usuariosCtrl.agregarUsuario);
router.get('/usuarios',middlewareAuth.ensureAuthenticated,usuariosCtrl.obtenerUsuarios);
router.put('/usuarios/:id',middlewareAuth.ensureAuthenticated,usuariosCtrl.actualizarUsuario);
router.delete('/usuarios/:id',middlewareAuth.ensureAuthenticated,usuariosCtrl.eliminarUsuario);
//promociones
router.post('/locales/:id/promociones',middlewareAuth.ensureAuthenticated,promocionesCtrl.agregarPromocion);
router.get('/locales/:id/promociones',middlewareAuth.ensureAuthenticated,promocionesCtrl.obtenerPromociones);
router.put('/locales/:idLocal/promociones/:idPromocion',middlewareAuth.ensureAuthenticated,promocionesCtrl.actualizarPromocion);
router.delete('/locales/:idLocal/promociones/:idPromocion',middlewareAuth.ensureAuthenticated,promocionesCtrl.eliminarPromocion);
//mesas
/**
router.post('/empresas/:id/mesas',middlewareAuth.ensureAuthenticated,mesasCtrl.agregarMesa);
router.get('/empresas/:id/mesas',middlewareAuth.ensureAuthenticated,mesasCtrl.obtenerMesas);
router.put('/empresas/:idEmpresa/mesas/:idMesa',middlewareAuth.ensureAuthenticated,mesasCtrl.actualizarMesa);
router.delete('/empresas/:idEmpresa/mesas/:idMesa',middlewareAuth.ensureAuthenticated,mesasCtrl.eliminarMesa);
*/
//////////////////////-------CLIENTES----------///////////////////////////////////////
router.get('/cliente/empresas/:id/locales',localesCtrl.obtenerLocalesDeEmpresa);
router.get('/cliente/locales/:id/categorias',categoriasCtrl.obtenerCategoriasDeLocal);
router.get('/cliente/categorias/:id/subcategorias',subcategoriasCtrl.obtenerSubcategoriasDeCategoria);
router.get('/cliente/subcategorias/:id/productos',productosCtrl.obtenerProductosDeSubcategoria);
router.get('/cliente/subcategorias/:id',subcategoriasCtrl.obtenerSubcategoria);
router.get('/cliente/categorias/:id',categoriasCtrl.obtenerCategoria);
router.get('/cliente/empresas/:id/promociones',promocionesCtrl.obtenerPromocionesVigentesEmpresa);
/////////////-----PRUEBAS-------//////////
router.get('/prueba',middlewareAuth.ensureAuthenticated,function(request,response)
{
  response.status(200).send({respuesta:"Holaa"});
});

router.get('/restart',function(request,response)
{
  var us = require('./models/Usuario.js')();
  us.porDefecto();
  response.status(200).send({});
});

module.exports = router;
