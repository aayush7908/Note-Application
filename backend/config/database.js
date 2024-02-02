const mongoose = require('mongoose');

const connectToDatabase = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database");
};

module.exports = connectToDatabase;