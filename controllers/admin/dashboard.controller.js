const Book = require('../../models/book.model');
const Order = require('../../models/order.model');
const Review = require('../../models/review.model');
const User = require('../../models/user.model');

const getDashboard = async (req, res) => {
    try {
        // Get admin's books
        const adminBooks = await Book.find({ admin: req.user.id }).select('_id');
        const adminBookIds = adminBooks.map(book => book._id);

        // Get statistics
        const totalBooks = await Book.countDocuments({ admin: req.user.id });
        
        // Filter orders containing admin's books
        const totalOrders = await Order.countDocuments({
            'books.book': { $in: adminBookIds }
        });
        
        const pendingOrders = await Order.countDocuments({
            'books.book': { $in: adminBookIds },
            status: 'pending'
        });

        const totalUsers = await User.countDocuments({ role: 'user' });
        const pendingReviews = await Review.countDocuments({
            book: { $in: adminBookIds },
            status: 'pending'
        });

        // Get recent orders containing admin's books
        const recentOrders = await Order.find({
            'books.book': { $in: adminBookIds }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .populate('books.book', 'title price');

        // Get recent reviews for admin's books
        const recentReviews = await Review.find({
            book: { $in: adminBookIds }
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name')
            .populate('book', 'title');

        // Calculate total revenue from admin's books
        const orders = await Order.find({
            'books.book': { $in: adminBookIds },
            status: 'delivered'
        });

        const totalRevenue = orders.reduce((acc, order) => {
            // Calculate revenue only for admin's books in each order
            const adminBookRevenue = order.books.reduce((bookAcc, item) => {
                if (adminBookIds.some(id => id.equals(item.book._id))) {
                    return bookAcc + (item.price * item.quantity);
                }
                return bookAcc;
            }, 0);
            return acc + adminBookRevenue;
        }, 0);

        res.render('admin/admin', {
            stats: {
                totalBooks,
                totalOrders,
                pendingOrders,
                totalUsers,
                pendingReviews,
                totalRevenue
            },
            recentOrders,
            recentReviews
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).render('admin/admin', {
            stats: {
                totalBooks: 0,
                totalOrders: 0,
                pendingOrders: 0,
                totalUsers: 0,
                pendingReviews: 0,
                totalRevenue: 0
            },
            recentOrders: [],
            recentReviews: [],
            error: 'Error loading dashboard'
        });
    }
};

module.exports = {
    getDashboard
};