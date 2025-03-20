const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Import user routes
const homeRoutes = require('./routes/user/home.routes');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/user/profile.routes');
const exploreRoutes = require('./routes/user/explore.routes');
const cartRoutes = require('./routes/user/cart.routes');
const wishlistRoutes = require('./routes/user/wishlist.routes');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use USER routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/explore', exploreRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);




// Admin routes
app.get('/admin/dashboard', (req, res) => {
    res.render('Admin/admin');
});

app.get('/admin/profile', (req, res) => {
    res.render('Admin/profile');
});

app.get('/admin/orders', (req, res) => {
    res.render('Admin/orders');
});

app.get('/admin/books', (req, res) => {
    res.render('Admin/books');
});

app.get('/admin/reviews', (req, res) => {
    res.render('Admin/reviews');
});

app.get('/admin/history', (req, res) => {
    res.render('Admin/history');
});

app.get('/admin/help', (req, res) => {
    res.render('Admin/help');
});
app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});