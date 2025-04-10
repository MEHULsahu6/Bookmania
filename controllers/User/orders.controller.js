const Order = require('../../models/order.model');
const Review = require('../../models/review.model');

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate('books.book', 'title image price')
            .sort({ orderDate: -1 });

        // Get existing reviews for these orders
        const reviews = await Review.find({
            user: req.user.id,
            order: { $in: orders.map(order => order._id) }
        });

        // Create review mapping
        const reviewMap = reviews.reduce((acc, review) => {
            acc[`${review.order}-${review.book}`] = review;
            return acc;
        }, {});

        res.render('user/orders', { orders, reviewMap });
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
            _id: req.params.orderId,
            user: req.user.id
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