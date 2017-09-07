/**
* Establece la conexion con la base de datos
*@author Jorge Galvis Cardenas
*@version 1.0
*/
var conexion = function()
{
  /**
  * uso del paquete mongoose para acceder a la base de datos MongoDB
  */
  var mongo = require('mongoose');
  /** Parametros para conectarse a la base de datos cuando se esta desarrollado en localhost
  *
  */
  var configDB = require('./config/configDB.js');
  //var connection_string = 'localhost:27017/frunkieDB';
  var connection_string = '';
  if (configDB.USER_NAME != '')
  {
    connection_string = connection_string + configDB.USER_NAME + ':'
  } else
  {
    if (configDB.PASSWORD != '')
    {
      connection_string = connection_string + configDB.PASSWORD + '@';
    }
  }

  connection_string = configDB.HOST +':'+configDB.PORT + '/' + configDB.DB_NAME;

  /**Configuracion de variables de un servidor, en este caso si se prueba en openshift
  *
  */
  if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
  }
  /**
  * Conexión con la base de datos
  */
  //  var connection = mongo.createConnection("mongodb://" + connection_string);
  var connection = mongo.connect("mongodb://" + connection_string);
  /**
  * Schema para crear las colecciones en la base de datos
  */
  var Schema = mongo.Schema;
  /**
  * plugin para gestionar un id autoincrement en las colecciones
  */
  var autoIncrement = require('mongoose-auto-increment');
  /**
  * Asociamos el autoincrement a la base de datos
  */
  autoIncrement.initialize(connection);
  /**
  * Creamos esquemas de cada collecion, le asociamos el autoincrement, y creamos
  * un modelo en la base de datos
  */
  var tipoUsuarioSchema = new Schema({
    nombre: String,
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  tipoUsuarioSchema.plugin(autoIncrement.plugin, {model: 'tipo_usuario', field: 'id', startAt: 10});
  var modelTipoUsuario = connection.model('tipo_usuario', tipoUsuarioSchema);
  /////////////////////////////////////////////////////////////////////////////////
  var permisoSchema=new Schema({
    nombre:String,
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  permisoSchema.plugin(autoIncrement.plugin, {model: 'permiso', field: 'id', startAt: 50});
  var modelPermiso=connection.model('permiso', permisoSchema);
  /////////////////////////////////////////////////////////////////////////////////
  var empresaSchema=new Schema({
    nombre:String,
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  empresaSchema.plugin(autoIncrement.plugin, {model: 'empresa', field: 'id', startAt: 5});
  var modelEmpresa=connection.model('empresa', empresaSchema);
  /////////////////////////////////////////////////////////////////////////////////
  var localSchema=new Schema({
    nombre:{type:String,default:''},
    departamento:{type:String,default:''},
    ciudad:{type:String,default:''},
    telefono:{type:String,default:''},
    direccion:{type:String,default:''},
    id_empresa:{type: Number, ref: 'empresa',default:1},
    creado_por:{type: Number, ref: 'usuario',default:1},
    ruta_imagen:{type:String,default:'locales/imagenPorDefecto.png'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  localSchema.plugin(autoIncrement.plugin, {model: 'local', field: 'id', startAt: 6});
  var modelLocal=connection.model('local', localSchema);
  /////////////////////////////////////////////////////////////////////////////////
  var usuarioSchema = new Schema({
    nombre:{type:String,default:''},
    apellido:{type:String,default:''},
    nombre_usuario:{type:String,default:''},
    email:{type:String,default:''},
    contrasenia:{type:String},
    activo:{type:Boolean, default:true},
    permisos:{type:[Number],default:[]},
    locales:{type:[Number],default:[]},
    es_administrador:{type:Boolean,default:false},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  usuarioSchema.plugin(autoIncrement.plugin, {model: 'usuario', field: 'id', startAt: 6});
  var modelUsuario = connection.model('usuario', usuarioSchema);
  ////////////////////////////////////////////////////////////////////////////
  var clienteSchema = new Schema({
    nombre:{type:String,default:''},
    apellido:{type:String,default:''},
    direccion:{type:String,default:''},
    email:{type:String,default:''},
    telefono:{type:String,default:''},
    cliente_de:{type: Number, ref: 'usuario'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  clienteSchema.plugin(autoIncrement.plugin, {model: 'cliente', field: 'id', startAt: 5});
  var modelCliente = connection.model('cliente', clienteSchema);
  ////////////////////////////////////////////////////////////////////////////
  var proveedorSchema = new Schema({
    nombre:{type:String,default:''},
    apellido:{type:String,default:''},
    direccion:{type:String,default:''},
    email:{type:String,default:''},
    telefono:{type:String,default:''},
    proveedor_de:{type: Number, ref: 'usuario'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  proveedorSchema.plugin(autoIncrement.plugin, {model: 'proveedor', field: 'id', startAt: 5});
  var modelProveedor = connection.model('proveedor', proveedorSchema);
  ////////////////////////////////////////////////////////////////////////////
  var categoriaSchema = new Schema({
    nombre: {type:String,default:''},
    id_local:{type:Number,ref:'local'},
    ruta_imagen:{type:String,default:'categorias/imagenPorDefecto.png'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  categoriaSchema.plugin(autoIncrement.plugin, {model: 'categoria', field: 'id', startAt: 5});
  var modelCategoria = connection.model('categoria', categoriaSchema);
  ////////////////////////////////////////////////////////////////////////////
  var subcategoriaSchema = new Schema({
    nombre: {type:String,default:''},
    id_local:{type:Number,ref:'local'},
    id_categoria:{type:Number,ref:'categoria'},
    ruta_imagen:{type:String,default:'subcategorias/imagenPorDefecto.png'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  subcategoriaSchema.plugin(autoIncrement.plugin, {model: 'subcategoria', field: 'id', startAt: 5});
  var modelSubcategoria= connection.model('subcategoria', subcategoriaSchema);
  ////////////////////////////////////////////////////////////////////////////
  var productoSchema = new Schema({
    nombre: {type:String,default:''},
    id_subcategoria:{type:Number,ref:'subcategoria'},
    descripcion:{type:String,default:''},
    precio_entrada:{type:Number,default:0.0},
    precio_salida:{type:Number,default:0.0},
    unidad:{type:String,default:''},
    presentacion:{type:String,default:''},
    minima_inventario:{type:Number,default:10},
    activo:{type:Boolean,default:true},
    ruta_imagen:{type:String,default:'productos/imagenPorDefecto.png'},
    id_local:{type:Number,ref:'local'},
    createdAt: {type: Date, default: Date.now()},
    updatedAt: {type: Date, default: Date.now()}
  });
  productoSchema.plugin(autoIncrement.plugin, {model: 'producto', field: 'id', startAt: 10});
  var modelProducto = connection.model('producto', productoSchema);
  ///////////////////////////////////////////////////////////////////////////
  var promocionSchema=new Schema({
    nombre:{type:String,default:''},
    descripcion:{type:String,default:''},
    ruta_imagen:{type:String,default:'promociones/imagenPorDefecto.png'},
    fecha_inicio:{type:Date,default:new Date(Date.now())},
    fecha_finalizacion:{type:Date,default:new Date(Date.now)},
    tipo:{type:Number,default:1},
    id_recurso:{type:Number},
    id_local:{type:Number,ref:'local'},
    createdAt:{type:Date,default:new Date(Date.now())},
    updatedAt:{type:Date,default:new Date(Date.now())}
  });
  promocionSchema.plugin(autoIncrement.plugin, {model: 'promocion', field: 'id', startAt: 5});
  var modelPromocion = connection.model('promocion', promocionSchema);
  ///////////////////////////////////////////////////////////////////////////
  var mesaSchema=new Schema({
    nombre:{type:String,default:''},
    id_empresa:{type:Number,ref:'empresa'},
    createdAt:{type:Date, default: new Date(Date.now())},
    ruta_qr:{type:String,default:'mesas/default.png'},
    updatedAt:{type:Date,default:new Date(Date.now())}
  });
  mesaSchema.plugin(autoIncrement.plugin, {model: 'mesa', field: 'id', startAt: 5});
  var modelMesa = connection.model('mesa', mesaSchema);
  ////////////////////////////////////////////////////////////////////////////
  var estadoEntregaSchema=new Schema({
    nombre:{type:String,default:''},
    createdAt:{type:Date,default:new Date(Date.now())},
    updatedAt:{type:Date,default:new Date(Date.now())},
  });
  estadoEntregaSchema.plugin(autoIncrement.plugin, {model: 'estadoentrega', field: 'id', startAt: 10});
  var modelEstadoEntrega=connection.model('estadoentrega', estadoEntregaSchema);
  ///////////////////////////////////////////////////////////////////////////
  var ordenSchema=new Schema({
    telefono:{type:String,default:''},
    mesa_id:{type:Number,ref:'mesa'},
    pago:{type:Boolean,default:false},
    estado_entrega:{type:Number,ref:'estadoentrega',default:1},
    createdAt:{type:Date,default:new Date(Date.now())}
  });
  ordenSchema.plugin(autoIncrement.plugin, {model: 'orden', field: 'id', startAt: 5});
  var modelOrden=connection.model('orden',ordenSchema);
  //////////////////////////////////////////////////////////////////////////////
  var subordenSchema=new Schema({
    productos:{type:[{id:Number,cantidad:Number}],default:[]},
    local_id:{type:Number,ref:'local'},
    estado_entrega:{type:Number,ref:'estadoentrega',default:1},
    valor:{type:Number,default:0.0},
    orden_id:{type:Number,ref:'orden'},
    createdAt:{type:Date,default:new Date(Date.now())}
  });
  subordenSchema.plugin(autoIncrement.plugin, {model: 'suborden', field: 'id', startAt: 5});
  var modelSuborden=connection.model('suborden',subordenSchema);
  /////////////////////////////////////////////////////////////////////////////
  var comentarioSchema=new Schema({
    orden_id:{type:Number,ref:'orden'},
    comentario:{type:String,default:''},
    calificacion:{type:Number,default:0},
    createdAt:{type:Date,default:new Date(Date.now())}
  });
  comentarioSchema.plugin(autoIncrement.plugin, {model: 'comentario', field: 'id', startAt: 1});
  var modelComentario=connection.model('comentario',comentarioSchema);
  ////////////////////////////////////////////////////////////////////////////
  /**
  * Este objeto global, va servir para acceder a todos los modelos creados en
  * la base de datos
  */
  global.db = {
    mongoose: mongo,
    //models
    TipoUsuario: modelTipoUsuario,
    Permiso: modelPermiso,
    Usuario: modelUsuario,
    Local: modelLocal,
    Cliente: modelCliente,
    Proveedor: modelProveedor,
    Categoria: modelCategoria,
    Subcategoria:modelSubcategoria,
    Producto:modelProducto,
    Empresa:modelEmpresa,
    Promocion:modelPromocion,
    Mesa: modelMesa,
    EstadoEntrega:modelEstadoEntrega,
    Orden:modelOrden,
    Suborden:modelSuborden,
    Comentario:modelComentario
    // agregar más modelos aquí en caso de haberlos
  };
}
module.exports.conexion = conexion;
