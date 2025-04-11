const Order = require('../../models/order.model');
const Book = require('../../models/book.model');

const getOrders = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        // Get all books added by this admin
        const adminBooks = await Book.find({ admin: adminId }).select('_id');
        const adminBookIds = adminBooks.map(book => book._id);

        // Find orders that contain books added by this admin
        const orders = await Order.find({
            'books.book': { $in: adminBookIds }
        })
        .populate('user', 'name email')
        .populate('books.book');

        // Filter out books that don't belong to this admin
        const filteredOrders = orders.map(order => {
            const filteredBooks = order.books.filter(book => 
                adminBookIds.some(id => id.equals(book.book._id))
            );
            return {
                ...order.toObject(),
                books: filteredBooks
            };
        });

        res.render('admin/orders', { orders: filteredOrders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).render('admin/orders', { 
            orders: [],
            error: 'Error fetching orders'
        });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const adminId = req.user.id;

        // Verify the order contains books from this admin
        const adminBooks = await Book.find({ admin: adminId }).select('_id');
        const adminBookIds = adminBooks.map(book => book._id);

        const order = await Order.findOne({
            _id: orderId,
            'books.book': { $in: adminBookIds }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or unauthorized' });
        }

        order.status = status;
        await order.save();

        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

module.exports = {
    getOrders,
    updateOrderStatus
};