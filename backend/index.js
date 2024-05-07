require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./config/database');
const { centralizedErrorHandler } = require('./middleware/centralizedErrorHandler');

const app = express();
connectToDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes/v1'));
app.use(centralizedErrorHandler);

if(process.env.PORT) {
    app.listen(process.env.PORT, () => {
        console.log(`Listening on port: ${process.env.PORT}`);
    });
}

module.exports = app;