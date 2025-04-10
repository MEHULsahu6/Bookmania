const Order = require('../../models/order.model');
const Book = require('../../models/book.model');

const getOrders = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        const orders = await Order.find({
            'items.book': { 
                $in: await Book.find({ admin: adminId }).distinct('_id') 
            }
        })
        .populate('user', 'name email')
        .populate('items.book', 'title price');

        res.render('admin/orders', { orders });
    } catch (error) {
        res.status(500).render('error', { message: 'Error fetching orders' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        order.statusHistory.push({
            status,
            date: Date.now()
        });

        await order.save();

        // If order is completed, update book stock
        if (status === 'completed') {
            for (const item of order.items) {
                await Book.findByIdAndUpdate(item.book, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

module.exports = {
    getOrders,
    updateOrderStatus
};