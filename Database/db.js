const mysql = require('mysql2');

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'FsoTS23',
  database: 'ServiciosL&R',
  waitForConnections: true,
  connectionLimit: 20, // Número máximo de conexiones simultáneas
  queueLimit: 0,       // Sin límite en la cola de solicitudes
});

// Verificar el estado de la conexión para asegurarse de que esté activa
pool.on('connection', (connection) => {
  console.log('Conexión establecida con ID:', connection.threadId);
});

// Manejo de desconexión de conexiones inactivas
pool.on('release', (connection) => {
  console.log('Conexión liberada con ID:', connection.threadId);
});

// Garantizar la reconexión si hay fallos
pool.on('error', (err) => {
  console.error('Error en la conexión a la base de datos:', err);
  // Podrías intentar realizar una nueva conexión o notificar de manera más controlada.
});

// Exportar el pool para usarlo en otras partes de la aplicación
module.exports = pool.promise();
