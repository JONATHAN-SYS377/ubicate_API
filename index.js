const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
const port = process.env.PORT || 3009;

const connection = require('./Database/db');
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
app.post('/api/registrarCliente', (req, res) => {
    const {suscriptor, nombreCompleto, telefono1, telefono2, telefono3,plan, colilla, tap, nap,mac,sn,ip,direccion, ubicacion} = req.body;

    const query = `
        INSERT INTO clientes (suscriptor,nombreCompleto, telefono1, telefono2, telefono3, plan, colilla, tap, nap,mac,sn,ip, direccion, ubicacion)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [suscriptor, nombreCompleto, telefono1, telefono2, telefono3,plan, colilla, tap, nap,mac,sn,ip,direccion, ubicacion];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al registrar el cliente:', err);
            return res.status(500).json({
                estado: false,
                message: 'Error interno del servidor',
                errorDetails: err.message
            });
        }

        res.status(200).json({
            estado: true,
            message: 'cliente registrado correctamente',
            restaurantId: results.insertId
        });
    });
});

/**
 * @swagger
 * /api/editarCliente:
 *   post:
 *     tags:
 *       - Datos del Cliente
 *     summary: Edita los datos de un cliente existente`
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
app.post('/api/editarCliente', (req, res) => {
    const { suscriptor, nuevoSuscriptor, nombreCompleto, telefono1, telefono2, telefono3,plan, colilla, tap, nap,mac,sn,ip,direccion, ubicacion } = req.body;

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

    const values = [nuevoSuscriptor, nombreCompleto, telefono1, telefono2, telefono3,plan, colilla, tap, nap,mac, sn, ip, direccion, ubicacion, suscriptor];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al editar el cliente:', err);
            return res.status(500).json({
                estado: false,
                message: 'Error interno del servidor',
                errorDetails: err.message
            });
        }

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
    });
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
app.post('/api/obtenerCliente', (req, res) => {
    const { suscriptor } = req.body;

    console.log("Valor del suscriptor recibido:", suscriptor);

    if (!suscriptor) {
        return res.status(400).json({
            success: false,
            message: 'Debe proporcionar un número de suscriptor válido.'
        });
    }

    const query = 'SELECT * FROM clientes WHERE suscriptor = ?';

    connection.query(query, [suscriptor], (err, results) => {
        if (err) {
            console.error('Error al obtener los datos del cliente:', err);
            return res.status(500).json({
                estado: false,
                message: 'Error interno del servidor',
                errorDetails: err.message
            });
        }

        if (results.length > 0) {
            res.status(200).json({
                estado: true,
                data: results[0]
            });
        } else {
            res.status(404).json({
                estado: false,
                data: []
            });
        }
    });
});


/**
 * @swagger
 * /api/validarSuscriptorExiste:
 *   post:
 *     tags:
 *        - Datos del Cliente
 *     summary: Valida si un suscriptor ya existe
 *     description: Comprueba si un numero de suscriptor ya está registrado en la tabla clientes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               suscriptor:
 *                 type: string
 *                 description: numero de suscriptor
 *     responses:
 *       200:
 *         description: Devuelve true si el siscriptor ya existe, false en caso contrario.
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
app.post('/api/validarSuscriptorExiste', (req, res) => {

    const { suscriptor } = req.body;

    const query = `
        SELECT COUNT(*) AS count
        FROM clientes
        WHERE suscriptor = ?
    `;
    const values = [suscriptor];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error al validar si el colaborador ya existe:', err);
            return res.status(500).json({
                estado: false,
                message: 'Error interno del servidor',
            });
        }

        const existeColaborador = results[0].count > 0;
        res.status(200).json({
            estado: true,
            existeColaborador,
        });
    });
});





// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Documentación Swagger disponible en http://localhost:${port}/api-docs`);
});
