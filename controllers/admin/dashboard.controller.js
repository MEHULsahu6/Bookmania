const Book = require('../../models/book.model');
const Order = require('../../models/order.model');
const Review = require('../../models/review.model');

const getDashboard = async (req, res) => {
    try {
        const adminId = req.user.id;

        // Get total books
        const totalBooks = await Book.countDocuments({ admin: adminId });

        // Get total orders
        const orders = await Order.find({ 
            'items.book': { 
                $in: await Book.find({ admin: adminId }).distinct('_id') 
            }
        });

        // Calculate total revenue
        const totalRevenue = orders.reduce((acc, order) => {
            return acc + order.totalAmount;
        }, 0);

        // Get recent reviews
        const recentReviews = await Review.find({
            book: { 
                $in: await Book.find({ admin: adminId }).distinct('_id') 
            }
        })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name');

        // Get low stock alerts
        const lowStockBooks = await Book.find({
            admin: adminId,
            stock: { $lt: 10 }
        });

        res.render('admin/dashboard', {
            totalBooks,
            totalOrders: orders.length,
            totalRevenue,
            recentReviews,
            lowStockBooks
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).render('error', { message: 'Error loading dashboard' });
    }
};

module.exports = {
    getDashboard
};