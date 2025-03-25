const Review = require('../../models/review.model');
const Book = require('../../models/book.model');

const getReviews = async (req, res) => {
    res.render('admin/reviews');
};

module.exports = {
    getReviews
};