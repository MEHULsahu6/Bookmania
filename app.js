const express = require('express')
const app = express()
const port = 3000;
const path = require('path');



app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set(express())

app.get('/', (req, res) => {
  res.render('./user/home')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/signup', (req, res) => {
  res.render('signup')
})

app.get('/profile', (req, res) => {
  res.render('./user/profile')
})

app.get('/orders', (req, res) => {
  const orders = [
     { id: 1, date: '2023-10-01', total: 29.99, status: 'Delivered' },
     { id: 2, date: '2023-10-05', total: 15.99, status: 'Pending' },
  ];
  res.render('./user/orders', { orders });
});

app.get('/wishlist', (req, res) => {
  const wishlist = [
     { image: '/img/book-1.png', title: 'Book 1', discountPrice: 11.99, originalPrice: 19.99 },
     { image: '/img/book-2.png', title: 'Book 2', discountPrice: 11.99, originalPrice: 19.99 },
  ];
  res.render('./user/whishlist', { wishlist });
});

app.get('/explore', (req, res) => {
  const books = [
     { id: 1, image: '/img/book-1.png', title: 'Book 1', discountPrice: 7.99, originalPrice: 14.99 },
     { id: 2, image: '/img/book-2.png', title: 'Book 2', discountPrice: 7.99, originalPrice: 14.99 },
  ];
  res.render('./user/explore', { books });
});
app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});