const Order = require('../../models/order.model');

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('books.book', 'title image price')
            .sort({ orderDate: -1 });

        res.render('user/orders', { orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.render('user/orders', { orders: [], error: 'Error fetching orders' });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,
            user: req.user._id
        }).populate('books.book', 'title image price description');

        if (!order) {
            return res.status(404).render('404');
        }

        res.render('user/order-details', { order });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).render('error', { message: 'Error fetching order details' });
    }
};

module.exports = {
    getUserOrders,
    getOrderDetails
};