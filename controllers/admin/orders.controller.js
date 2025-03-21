const Order = require('../../models/order.model');
const Payment = require('../../models/payment.model');

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user')
            .populate('books.book');
        res.render('admin/orders', { orders });
    } catch (error) {
        res.status(500).render('admin/orders', { error: 'Error loading orders' });
    }
};

module.exports = {
    getOrders
};