const Cart = require('../../models/cart.model');
const Book = require('../../models/book.model');
const User = require('../../models/user.model');

exports.cart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.book');
        res.render('User/cart', { cart });
    } catch (error) {
        res.status(500).render('User/cart', { error: 'Error loading cart' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        // Find or create cart for user
        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Check if book already exists in cart
        const existingItem = cart.items.find(item => item.book.toString() === bookId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ book: bookId, quantity: 1 });
        }

        await cart.save();
        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, message: 'Error adding item to cart' });
    }
};