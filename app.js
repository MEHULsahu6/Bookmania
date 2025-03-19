const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

// Import routes
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

// Use routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/explore', exploreRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);




app.get('/admin', (req, res) => {
    res.render('./admin/admin');
});
app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});