const mysql = require('mysql2');

// Crear una conexión a la base de datos MariaDB
const connection = mysql.createConnection({
  host: 'localhost',     // Dirección del servidor de base de datos (si está en la misma máquina, usa 'localhost')
  user: 'root',          // Tu nombre de usuario de MariaDB
  password: 'FsoTS23', // Tu contraseña de MariaDB
  database: 'ServiciosL&R',    // Nombre de tu base de datos
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos con el ID de hilo: ' + connection.threadId);
});

module.exports = connection;
