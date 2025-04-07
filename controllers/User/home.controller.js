const Book = require('../../models/book.model');
const Cart = require('../../models/cart.model');

exports.home = (req, res) => {
    res.render('user/home');
};

exports.addToCart = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

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