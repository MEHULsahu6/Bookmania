const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderId: {
        type: String,
        unique: true
        // Removed required: true since it's generated in pre-save
    },
    books: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            phone: { type: String, required: true }
        }
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'cod'],
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    }
});

// Generate Order ID
orderSchema.pre('save', function(next) {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.orderId = `ORD-${year}${month}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);