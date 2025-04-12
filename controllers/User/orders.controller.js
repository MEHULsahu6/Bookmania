const Order = require('../../models/order.model');
const Review = require('../../models/review.model');

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate({
                path: 'books.book',
                select: 'title image price',
                match: { _id: { $ne: null } }
            })
            .sort({ orderDate: -1 });

        // Filter out any null book references and clean up the orders data
        const cleanedOrders = orders.map(order => {
            const cleanOrder = order.toObject();
            cleanOrder.books = cleanOrder.books.filter(item => item.book != null);
            return cleanOrder;
        });

        // Get existing reviews for these orders
        const reviews = await Review.find({
            user: req.user.id,
            order: { $in: orders.map(order => order.id) }
        });

        // Create review mapping
        const reviewMap = reviews.reduce((acc, review) => {
            acc[`${review.order}-${review.book}`] = review;
            return acc;
        }, {});

        res.render('user/orders', { 
            orders: cleanedOrders, 
            reviewMap 
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.render('user/orders', { 
            orders: [], 
            reviewMap: {},
            error: 'Error fetching orders' 
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId,  // Using orderId instead of _id
            user: req.user.id
        })
        .populate('books.book', 'title image price description')
        // Removed the shippingAddress populate since it's not in schema

        if (!order) {
            return res.status(404).render('error', { 
                message: 'Order not found' 
            });
        }

        res.render('user/order-details', { order });
    } catch (error) {
        console.error('Detailed error:', error);
        res.render('error', { 
            message: 'Error fetching order details: ' + error.message 
        });
    }
};

const submitReview = async (req, res) => {
    try {
        const { orderId, bookId, rating, comment } = req.body;

        const review = new Review({
            user: req.user.id,
            book: bookId,
            order: orderId,
            rating,
            comment
        });

        await review.save();

        res.json({ success: true, message: 'Review submitted successfully' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error submitting review' 
        });
    }
};

module.exports = {
    getUserOrders,
    getOrderDetails,
    submitReview
};