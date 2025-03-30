const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
      
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