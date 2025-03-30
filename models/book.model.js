const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
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
        type: Number
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

module.exports = mongoose.model('Book', bookSchema);