require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const { centralizedErrorHandler } = require('./middleware/centralizedErrorHandler');

const app = express();
connectToDatabase();

app.use(cors({ origin: ["http://localhost:3000", process.env.FRONTEND_DOMAIN_URL] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes/v1'));
app.use('/api', require('./routes/v2'));
app.use(centralizedErrorHandler);

if (process.env.PORT) {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port: ${process.env.PORT}`);
    });
}

module.exports = app;