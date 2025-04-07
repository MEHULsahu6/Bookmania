const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    phoneNumber: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: '../../img/profile_default.avif'
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: ''
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);