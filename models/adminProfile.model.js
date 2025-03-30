const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        default: 'Not provided' // Default value if none is provided
    },
    address: {
        type: String,
        trim: true,
        default: ''
    },
    city: {
        type: String,
        trim: true,
        default: ''
    },
    profilePicture: {
        type: String,
        default: 'default-admin.jpg'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminProfile', adminProfileSchema);