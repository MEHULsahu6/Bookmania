const mongoose = require('mongoose');

const adminProfileSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default-admin.jpg'
    },
    permissions: [{
        type: String,
        enum: ['manage_books', 'manage_users', 'manage_orders', 'manage_reviews', 'manage_admins'],
        default: ['manage_books']
    }],
    lastLogin: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminProfile', adminProfileSchema);