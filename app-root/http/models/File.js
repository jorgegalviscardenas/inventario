/**
* Se encarga de hacer operaciones relacionados con archivos
*/
function File()
{
  /**
  * Gestionador de directorios
  */
  var fs = require('fs');
  /**
  * Agrega un nuevo archivo
  * @param ruta ruta en la que se va a subir el archivo
  * @param nombre nombre del archivo
  * @param callback función para comunicar el resultado
  */
  this.agregarArchivo=function(ruta,nombre,file,callback)
  {
    var stats = fs.statSync(file.path);
    if (stats) {
      //procedemos a guardar el track en el servidor
      var is = fs.createReadStream(file.path);
      var os = fs.createWriteStream(ruta+nombre)
      //escribimos el track en la carpeta
      is.pipe(os);
      callback(null,null);
    }
    else
    {
      callback(null,null);
    }
  }
  /**
  * Elimina el archivo localizado en la ruta
  */
  this.eliminarArchivo=function(ruta,callback)
  {
    fs.stat(ruta, function(error, stats)
    {
      if (!error)
      {
        fs.unlinkSync(ruta);
      }
      callback(null, null);
    });
  }
  return this;
}
module.exports=File;
