const express = require('express');
const cors = require('cors');

const apiRoutes = require('./routes/api.routes');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./configs/swagger');
// const swaggerSpec = require('./configs/swagger');

app.use(morgan('combined')); // combined, common, short, tiny
app.use(helmet()); // protect info header

// cors
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// db
require('./dbs/init.mongodb');

// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', apiRoutes);

module.exports = app;