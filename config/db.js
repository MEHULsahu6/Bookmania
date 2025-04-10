const mongoose = require('mongoose');
mongoose.connection.setMaxListeners(15); // Increase MongoDB connection event listeners limit

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bookmania');
        console.log('MongoDB Connected:', mongoose.connection.host);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
