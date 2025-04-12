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

const specs = swaggerJsdoc(options);
module.exports = specs;
