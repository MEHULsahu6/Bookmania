require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const fs = require('fs');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const MongoStore = require('connect-mongo');

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

// Session and Flash middleware setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URII, // or whatever env var you're using
        collectionName: 'sessions'
    }),
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());

// Global flash messages middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.info_msg = req.flash('info_msg');
    next();
});

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

// Import user routes
const ordersRoutes = require('./routes/user/orders.routes');  // Add this line

// Use USER routes
app.use('/', homeRoutes);
app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/explore', exploreRoutes);
app.use('/cart', cartRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/orders', ordersRoutes);  // Add this line

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
app.listen(port, '0.0.0.0', () => {
    console.log(`Server started on port ${port}`);
  });

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);
