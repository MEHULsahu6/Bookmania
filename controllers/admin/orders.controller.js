const Order = require('../../models/order.model');
const Payment = require('../../models/payment.model');

const getOrders = async (req, res) => {
    res.render('admin/orders');
};

module.exports = {
    getOrders
};