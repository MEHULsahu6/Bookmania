const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

// View Engine & Static Files
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));  // ✅ Ensure Express finds the views

// Routes
app.get('/', (req, res) => {
  res.render('user/home');  // Fixed path
});
app.get('/login', (req, res) => {
  res.render('user/login'); // Ensure 'views/user/login.ejs' exists
});
app.get('/profile', (req, res) => {
  res.render('user/profile');
});
app.get('/explore', (req, res) => {  // Fixed duplicate route issue
  const books = [
    { id: 1, image: '/img/book-1.png', title: 'Book 1', discountPrice: 7.99, originalPrice: 14.99 },
    { id: 2, image: '/img/book-2.png', title: 'Book 2', discountPrice: 7.99, originalPrice: 14.99 },
  ];
  res.render('user/explore', { books });
});
app.get('/cart', (req, res) => {
  res.render('user/cart');
});
app.get('/orders', (req, res) => {
  const orders = [
    { id: 1, date: '2023-10-01', total: 29.99, status: 'Delivered' },
    { id: 2, date: '2023-10-05', total: 15.99, status: 'Pending' },
  ];
  res.render('user/orders', { orders });
});
app.get('/wishlist', (req, res) => {  // Fixed spelling issue
  const wishlist = [
    { image: '/img/book-1.png', title: 'Book 1', discountPrice: 11.99, originalPrice: 19.99 },
    { image: '/img/book-2.png', title: 'Book 2', discountPrice: 11.99, originalPrice: 19.99 },
  ];
  res.render('user/wishlist', { wishlist }); // Ensure 'views/user/wishlist.ejs' exists
});

// Signup Route
const signupRoutes = require('./routes/signup.routes');  // Fixed typo
app.use('/signup', signupRoutes);

// Start Server
app.listen(port, () => {
  console.log(`Server started on: http://localhost:${port}`);
});
