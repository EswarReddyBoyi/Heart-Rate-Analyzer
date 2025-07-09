const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Optional, Mongoose 6+ doesn't require this
            useUnifiedTopology: true // Optional, Mongoose 6+ doesn't require this
        });
        console.log('MongoDB Connected to Atlas!');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);  // Exit process with failure
    }
};
module.exports = connectDB;
