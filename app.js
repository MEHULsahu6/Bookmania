const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

// Import user routes
const homeRoutes = require('./routes/user/home.routes');
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/user/profile.routes');
const exploreRoutes = require('./routes/user/explore.routes');
const cartRoutes = require('./routes/user/cart.routes');
const wishlistRoutes = require('./routes/user/wishlist.routes');



//import admin routes
const dashboardAdminRoutes = require('./routes/admin/dashboard.routes');
const profileAdminRoutes = require('./routes/admin/profile.routes');
const ordersAdminRoutes = require('./routes/admin/orders.routes');
const booksAdminRoutes = require('./routes/admin/books.routes');
const reviewsAdminRoutes = require('./routes/admin/reviews.routes');
const historyAdminRoutes = require('./routes/admin/history.routes');
const helpAdminRoutes = require('./routes/admin/help.routes');


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




// use Admin routes
app.use('/admin/dashboard',  dashboardAdminRoutes);
app.use('/admin/profile',  profileAdminRoutes);
app.use('/admin/orders',  ordersAdminRoutes);
app.use('/admin/books',  booksAdminRoutes);
app.use('/admin/reviews',  reviewsAdminRoutes);
app.use('/admin/history',  historyAdminRoutes);
app.use('/admin/help',  helpAdminRoutes);

app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});