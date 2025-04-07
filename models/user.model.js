const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { // Changed from fullname to match controller
        type: String,
        required: true,
        trim: true
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    addresses: [{
        fullName: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false }
    }]
});

module.exports = mongoose.model('User', userSchema);