const Cart = require('../../models/cart.model');
const Book = require('../../models/book.model');
const User = require('../../models/user.model');
exports.cart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id })
            .populate('items.book');
        res.render('User/cart', { cart });
    } catch (error) {
        res.status(500).render('User/cart', { error: 'Error loading cart' });
    }
};