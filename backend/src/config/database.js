const mongoose = require('mongoose');

const { sendErrorMail } = require('../utils/email');
const { MONGO_URI } = require('./settings');


const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to database");
    } catch(err) {
        console.log("Couldnot connect to database !!!");
        sendErrorMail("DatabaseConnectionError", err.stack);
    }
};

module.exports = {
    connectToDatabase
};