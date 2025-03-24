const Wishlist = require('../../models/wishlist.model');
const Book = require('../../models/book.model');

exports.wishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user._id })
            .populate('books');
        res.render('User/wishlist', { wishlist });
    } catch (error) {
        res.status(500).render('User/wishlist', { error: 'Error loading wishlist' });
    }
};