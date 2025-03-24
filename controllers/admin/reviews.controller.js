const Review = require('../../models/review.model');
const Book = require('../../models/book.model');

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user')
            .populate('book');
        res.render('admin/reviews', { reviews });
    } catch (error) {
        res.status(500).render('admin/reviews', { error: 'Error loading reviews' });
    }
};

module.exports = {
    getReviews
};