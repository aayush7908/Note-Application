require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { connectToDatabase } = require('./config/database');
const { centralizedErrorHandler } = require('./middlewares/centralized-error-handler');
const routes = require('./routes');
const { PORT, FRONTEND_DOMAIN_URL } = require('./config/settings');


const app = express();
connectToDatabase();

app.use(cors({ origin: ["http://localhost:3000", FRONTEND_DOMAIN_URL] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use(centralizedErrorHandler);

if (PORT) {
    app.listen(PORT, () => {
        console.log(`Listening on port: ${PORT}`);
    });
}

module.exports = app;