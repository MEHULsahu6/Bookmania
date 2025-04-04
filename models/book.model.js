const mongoose = require('mongoose');
const admin = require('./adminProfile.model');

const bookSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
     // Remove unique: true from here
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        validate: {
            validator: function(value) {
                return value === null || value < this.price;
            },
            message: 'Discount price must be less than regular price'
        }
    },
    isbn: {
        type: String
    },
    publisher: {
        type: String
    },
    tags: [{
        type: String,
        enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction', 
               'Fantasy', 'Biography', 'History', 'Children', 'Young Adult', 
               'Educational', 'Self-Help', 'Business', 'Technology']
    }],
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a compound unique index for admin and title combination
bookSchema.index({ admin: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);