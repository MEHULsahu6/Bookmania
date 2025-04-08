require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const fs = require('fs');

// Connect to MongoDB
connectDB();

// Create upload directories if they don't exist
const uploadDirs = [
    path.join(__dirname, 'public/uploads/user_profiles'),
    path.join(__dirname, 'public/uploads/admin_profiles')
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created upload directory: ${dir}`);
    }
});

// Middleware setup
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import user routes
const homeRoutes = require('./routes/user/home.routes');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/user/profile.routes');
const exploreRoutes = require('./routes/user/explore.routes');
const cartRoutes = require('./routes/user/cart.routes');
const wishlistRoutes = require('./routes/user/wishlist.routes');

// Import admin routes
const dashboardAdminRoutes = require('./routes/admin/dashboard.routes');
const profileAdminRoutes = require('./routes/admin/profile.routes');
const ordersAdminRoutes = require('./routes/admin/orders.routes');
const booksAdminRoutes = require('./routes/admin/books.routes');
const reviewsAdminRoutes = require('./routes/admin/reviews.routes');
const historyAdminRoutes = require('./routes/admin/history.routes');
const helpAdminRoutes = require('./routes/admin/help.routes');

// Use USER routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/explore', exploreRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);

// Use Admin routes
app.use('/admin/dashboard', dashboardAdminRoutes);
app.use('/admin/profile', profileAdminRoutes);
app.use('/admin/orders', ordersAdminRoutes);
app.use('/admin/books', booksAdminRoutes);
app.use('/admin/reviews', reviewsAdminRoutes);
app.use('/admin/history', historyAdminRoutes);
app.use('/admin/help', helpAdminRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404');
});

// Start server
app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});