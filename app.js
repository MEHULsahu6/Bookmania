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
app.get('/Explore', (req, res) => {
  res.render('./user/explore')
})
app.get('/cart', (req, res) => {
  res.render('./user/cart')
})
app.get('/wishlist', (req, res) => {
  res.render('./user/wishlist')
})





app.listen(port, () => {
    console.log(`Server started on: http://localhost:${port}`);
});