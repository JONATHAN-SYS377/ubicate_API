const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
const port = process.env.PORT || 3009;

const pool = require('./Database/db');
const cors = require('cors');

// Configuración de Swagger JSDoc
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Ubicate',
        version: '1.0.1',
        description: 'Documentación de la API Ubicate',
    },
    servers: [
        {
            url: 'http://localhost:3009', // Asegúrate de que el puerto coincida
        },
    ],
};

// Opciones de los archivos donde se encuentran los comentarios JSDoc
const options = {
    swaggerDefinition,
    apis: ['./index.js'], // Rutas donde se encuentran los comentarios JSDoc
};

// Generar la especificación Swagger
const swaggerSpec = swaggerJSDoc(options);

app.use(cors({
    origin: '*',  // Ajusta esto a la URL de tu frontend
}));
// Middleware para manejar JSON
app.use(express.json());
// Servir la documentación de Swagger
app.use('/api-docs', cors(), swaggerUi.serve, swaggerUi.setup(swaggerSpec));









/**
 * @swagger
 * /api/registrarCliente:
 *   post:
 *     tags:
 *       - Datos del Cliente
 *     summary: Registra un nuevo cliente
 *     description: Este endpoint permite insertar un nuevo restaurante en la base de datos.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suscriptor:
 *                 type: string
 *               nombreCompleto:
 *                 type: string
 *               telefono1:
 *                 type: string
 *               telefono2:
 *                 type: string
 *               telefono3:
 *                 type: string
 *               plan:
 *                 type: string
 *               nodo:
 *                 type: string
 *               colilla:
 *                 type: string
 *               tap:
 *                 type: string
 *               nap:
 *                 type: string
 *               mac:
 *                 type: string
 *               sn:
 *                 type: string
 *               ip:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *                
 *     responses:
 *       200:
 *         description: Cliente registrado correctamente
 *       400:
 *         description: Error en los datos proporcionados
 *       500:
 *         description: Error interno del servidor
 */
app.post('/api/registrarCliente', async (req, res) => {
    const { 
        suscriptor, nombreCompleto, telefono1, telefono2, telefono3,
        plan, colilla, tap, nap, mac, sn, ip, direccion, ubicacion 
    } = req.body;

    const query = `
        INSERT INTO clientes (suscriptor, nombreCompleto, telefono1, telefono2, telefono3, plan, colilla, tap, nap, mac, sn, ip, direccion, ubicacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        suscriptor, nombreCompleto, telefono1, telefono2, telefono3,
        plan, colilla, tap, nap, mac, sn, ip, direccion, ubicacion
    ];

    try {
        const [results] = await pool.query(query, values);

        res.status(200).json({
            estado: true,
            message: 'Cliente registrado correctamente',
            restaurantId: results.insertId
        });
    } catch (err) {
        console.error('Error al registrar el cliente:', err);
        res.status(500).json({
            estado: false,
            message: 'Error interno del servidor',
            errorDetails: err.message
        });
    }
});


/**
 * @swagger
 * /api/editarCliente:
 *   post:
 *     tags:
 *       - Datos del Cliente
 *     summary: Edita los datos de un cliente existente
 *     description: Este endpoint permite editar los datos de un cliente por su numero de `suscriptor`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suscriptor:
 *                 type: string
 *               nuevoSuscriptor:
 *                 type: string
 *               nombreCompleto:
 *                 type: string
 *               telefono1:
 *                 type: string
 *               telefono2:
 *                 type: string
 *               telefono3:
 *                 type: string
 *               plan:
 *                 type: string
 *               nodo:
 *                 type: string
 *               colilla:
 *                 type: string
 *               tap:
 *                 type: string
 *               nap:
 *                 type: string
 *               mac:
 *                 type: string
 *               sn:
 *                 type: string
 *               ip:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente editado correctamente
 *       400:
 *         description: Error en los datos proporcionados
 *       500:
 *         description: Error interno del servidor
 */
app.post('/api/editarCliente', async (req, res) => {
    const { 
      suscriptor, nuevoSuscriptor, nombreCompleto, telefono1, telefono2, telefono3,
      plan, colilla, tap, nap, mac, sn, ip, direccion, ubicacion 
    } = req.body;
  
    // Validar que ambos `suscriptor` y `nuevoSuscriptor` estén presentes
    if (!suscriptor || !nuevoSuscriptor) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar el número de suscriptor actual y el nuevo número de suscriptor.'
      });
    }
  
    const query = `
      UPDATE clientes
      SET 
        suscriptor = ?, 
        nombreCompleto = ?, 
        telefono1 = ?, 
        telefono2 = ?, 
        telefono3 = ?,
        plan = ?,
        colilla = ?, 
        tap = ?, 
        nap = ?, 
        mac = ?,
        sn = ?,
        ip = ?,
        direccion = ?, 
        ubicacion = ?
      WHERE suscriptor = ? 
    `;
  
    const values = [
      nuevoSuscriptor, nombreCompleto, telefono1, telefono2, telefono3,
      plan, colilla, tap, nap, mac, sn, ip, direccion, ubicacion, suscriptor
    ];
  
    try {
      const [results] = await pool.query(query, values);
  
      if (results.affectedRows > 0) {
        res.status(200).json({
          estado: true,
          message: 'Cliente actualizado correctamente'
        });
      } else {
        res.status(400).json({
          estado: false,
          message: 'No se pudo actualizar el Cliente, verifique los datos.'
        });
      }
    } catch (err) {
      console.error('Error al editar el cliente:', err);
      res.status(500).json({
        estado: false,
        message: 'Error interno del servidor',
        errorDetails: err.message
      });
    }
  });
  


/**
 * @swagger
 * /api/obtenerCliente:
 *   post:
 *     tags:
 *       - Datos del Cliente
 *     summary: Obtiene los datos completos de un cliente por su número de suscriptor.
 *     description: Este endpoint permite obtener todos los datos de un cliente registrado en el sistema, usando su `suscriptor` como parámetro único.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suscriptor:
 *                 type: string
 *                 description: Número de suscriptor del cliente
 *     responses:
 *       200:
 *         description: Datos del cliente obtenidos correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suscriptor:
 *                   type: string
 *                   description: Número de suscriptor del cliente.
 *                 nombreCompleto:
 *                   type: string
 *                   description: Nombre completo del cliente.
 *                 telefono1:
 *                   type: string
 *                   description: Teléfono principal del cliente.
 *                 telefono2:
 *                   type: string
 *                   description: Segundo teléfono del cliente.
 *                 telefono3:
 *                   type: string
 *                   description: Tercer teléfono del cliente (si lo tiene).
 *                 colilla:
 *                   type: string
 *                   description: Colilla de pago o factura asociada al cliente.
 *                 tap:
 *                   type: string
 *                   description: Detalles de TAP (si aplica).
 *                 nap:
 *                   type: string
 *                   description: Detalles de NAP (si aplica).
 *                 direccion:
 *                   type: string
 *                   description: Dirección del cliente.
 *                 ubicacion:
 *                   type: string
 *                   description: Ubicación geográfica del cliente.
 *       400:
 *         description: Cliente no encontrado, o no se proporcionó el número de suscriptor.
 *       500:
 *         description: Error interno del servidor.
 */
app.post('/api/obtenerCliente', async (req, res) => {
    const { suscriptor } = req.body;
  
    console.log("Valor del suscriptor recibido:", suscriptor);
  
    if (!suscriptor) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar un número de suscriptor válido.',
      });
    }
  
    const query = 'SELECT * FROM clientes WHERE suscriptor = ?';
    const values = [suscriptor];
  
    try {
      const [results] = await pool.query(query, values);
  
      if (results.length > 0) {
        res.status(200).json({
          estado: true,
          data: results[0],
        });
      } else {
        res.status(404).json({
          estado: false,
          data: [],
          message: 'No se encontró un cliente con el suscriptor proporcionado.',
        });
      }
    } catch (err) {
      console.error('Error al obtener los datos del cliente:', err);
      res.status(500).json({
        estado: false,
        message: 'Error interno del servidor',
        errorDetails: err.message,
      });
    }
  });
  


/**
 * @swagger
 * /api/TodosLosClientes:
 *   post:
 *     tags:
 *       - Datos del Cliente
 *     summary: Obtiene todos los datos de los clientes registrados en el sistema.
 *     description: Este endpoint permite obtener la lista completa de clientes registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 estado:
 *                   type: boolean
 *                   description: Indica si la operación fue exitosa.
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       suscriptor:
 *                         type: string
 *                         description: Número de suscriptor del cliente.
 *                       nombreCompleto:
 *                         type: string
 *                         description: Nombre completo del cliente.
 *                       telefono1:
 *                         type: string
 *                         description: Teléfono principal del cliente.
 *                       telefono2:
 *                         type: string
 *                         description: Segundo teléfono del cliente.
 *                       telefono3:
 *                         type: string
 *                         description: Tercer teléfono del cliente (si lo tiene).
 *                       colilla:
 *                         type: string
 *                         description: Colilla de pago o factura asociada al cliente.
 *                       tap:
 *                         type: string
 *                         description: Detalles de TAP (si aplica).
 *                       nap:
 *                         type: string
 *                         description: Detalles de NAP (si aplica).
 *                       direccion:
 *                         type: string
 *                         description: Dirección del cliente.
 *                       ubicacion:
 *                         type: string
 *                         description: Ubicación geográfica del cliente.
 *       500:
 *         description: Error interno del servidor.
 */
app.post('/api/TodosLosClientes', async (req, res) => {
    // Consulta SQL para obtener todos los clientes
    const query = 'SELECT * FROM clientes';

    try {
        // Usar el pool para ejecutar la consulta
        const [results] = await pool.query(query);
    
        if (results.length > 0) {
          res.status(200).json({
            estado: true,
            data: results,
          });
        } else {
          res.status(404).json({
            estado: false,
            data: [],
          });
        }
      } catch (err) {
        console.error('Error al obtener los datos del cliente:', err);
        res.status(500).json({
          estado: false,
          message: 'Error interno del servidor',
          errorDetails: err.message,
        });
      }
});


/**
 * @swagger
 * /api/validarSuscriptorExiste:
 *   post:
 *     tags:
 *        - Datos del Cliente
 *     summary: Valida si un suscriptor ya existe
 *     description: Comprueba si un número de suscriptor ya está registrado en la tabla clientes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suscriptor:
 *                 type: string
 *                 description: número de suscriptor
 *     responses:
 *       200:
 *         description: Devuelve true si el suscriptor ya existe, false en caso contrario.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
app.post('/api/validarSuscriptorExiste', async (req, res) => {
    const { suscriptor } = req.body;
  
    if (!suscriptor) {
      return res.status(400).json({
        estado: false,
        message: 'Debe proporcionar un número de suscriptor válido.',
      });
    }
  
    const query = `
      SELECT COUNT(*) AS count
      FROM clientes
      WHERE suscriptor = ?
    `;
    const values = [suscriptor];
  
    try {
      const [results] = await pool.query(query, values);
      const existeColaborador = results[0].count > 0;
  
      res.status(200).json({
        estado: true,
        existeColaborador,
      });
    } catch (err) {
      console.error('Error al validar si el suscriptor ya existe:', err);
      res.status(500).json({
        estado: false,
        message: 'Error interno del servidor',
      });
    }
  });
  





// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);
});
