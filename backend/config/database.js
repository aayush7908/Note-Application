const mongoose = require('mongoose');
const { sendErrorMail } = require('../utils/emailjs/sendMail');

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to database");
    } catch(err) {
        console.log("Couldnot connect to database !!!");
        await sendErrorMail("DatabaseConnectionError", err.stack);
    }
};

module.exports = connectToDatabase;