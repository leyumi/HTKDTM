const swaggerJsDoc = require('swagger-jsdoc');

const BASE_URL = 'http://localhost:3010';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Learning Documentation',
        version: '1.0.0',
        description: 'API documentation',
    },
    servers: [
        {
            url: BASE_URL,
            description: 'Development server',
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
