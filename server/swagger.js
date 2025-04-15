const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doctor Appointment API',
      version: '1.0.0',
      description: 'API documentation for Doctor Appointment System',
    },
    servers: [
      {
        url: 'http://localhost:5015/api',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Doctor: {
          type: 'object',
          properties: {
            openTime: {
              type: 'string',
              format: 'HH:mm',
              example: '09:00'
            },
            closeTime: {
              type: 'string',
              format: 'HH:mm',  
              example: '17:00'
            }
          }
        }
      }
    },
    security: [{
      bearerAuth: [],
    }],
    tags: [
      { name: 'Users', description: 'User operations' },
      { name: 'Doctors', description: 'Doctor operations' },
      { name: 'Appointments', description: 'Appointment operations' },
      { name: 'Notifications', description: 'Notification operations' },
    ],
  },
  apis: ['./routes/*.js'],
};

/**
 * @swagger
 * /doctor/update-profile:
 *   put:
 *     tags: [Doctors]
 *     summary: Update doctor working hours
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               openTime:
 *                 type: string
 *                 format: HH:mm
 *               closeTime:
 *                 type: string
 *                 format: HH:mm
 *     responses:
 *       200:
 *         description: Working hours updated successfully
 *       404:
 *         description: Doctor not found
 */

const specs = swaggerJsdoc(options);
module.exports = specs;
