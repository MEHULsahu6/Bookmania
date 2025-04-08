const Cart = require('../../models/cart.model');
const Book = require('../../models/book.model');
const User = require('../../models/user.model');
<<<<<<< HEAD
const Order = require('../../models/order.model');

=======
>>>>>>> 92fe1540792ef1dd9d6bb8cbc84e4f943372fa6b
exports.cart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id })
            .populate('items.book');
        const user = await User.findById(req.user.id).select('addresses');
        res.render('User/cart', { cart, user });
    } catch (error) {
        console.error('Error loading cart:', error);
        res.status(500).render('User/cart', { error: 'Error loading cart' });
    }
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

exports.saveAddress = async (req, res) => {
    try {
        const { fullName, street, city, state, zipCode, phone } = req.body;
        const user = await User.findById(req.user.id);
        
        const newAddress = {
            fullName,
            street,
            city,
            state,
            zipCode,
            phone
        };

        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }

        user.addresses.push(newAddress);
        await user.save();
        
        res.json({ success: true, message: 'Address saved successfully' });
    } catch (error) {
        console.error('Save address error:', error);
        res.status(500).json({ success: false, message: 'Error saving address' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { bookId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.book.toString() !== bookId);
        await cart.save();

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, message: 'Error removing item from cart' });
    }
};

exports.placeOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod } = req.body;
        const userId = req.user.id;

        // Get cart items with populated book details
        const cart = await Cart.findOne({ user: userId }).populate('items.book');
        if (!cart || !cart.items.length) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        // Get user details
        const user = await User.findById(userId);
        const selectedAddress = user.addresses.find(addr => addr.id.toString() === addressId);

        if (!selectedAddress) {
            return res.status(400).json({ success: false, message: 'Invalid address' });
        }

        // Create order items with proper price from populated book
        const books = cart.items.map(item => ({
            book: item.book.id,
            quantity: item.quantity,
            price: item.book.price || 0 // Ensure price exists
        }));

        // Calculate total amount
        const totalAmount = books.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Create new order with all required fields
        const order = new Order({
            user: userId,
            books: books,
            totalAmount: totalAmount,
            customerInfo: {
                name: selectedAddress.fullName,
                email: user.email,
                address: {
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipCode: selectedAddress.zipCode,
                    phone: selectedAddress.phone
                }
            },
            paymentMethod: paymentMethod
        });

        // Save the order
        const savedOrder = await order.save();

        // Clear cart after successful order placement
        cart.items = [];
        await cart.save();

        res.json({ success: true, orderId: savedOrder.orderId });
    } catch (error) {
        console.error('Place order error:', error.message); // Log the specific error message
        res.status(500).json({ success: false, message: 'Error placing order: ' + error.message });
    }
};

module.exports = exports;