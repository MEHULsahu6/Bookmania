const user = require('../models/user.model');
const { generateToken } = require('../middlewares/JWTauth');
const bcrypt = require('bcrypt');

exports.login = (req, res) => {
    res.render('login');
};

exports.signup = (req, res) => {
    res.render('signup');
};

exports.loginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).render('login', { error: 'Please fill in all fields' });
        }
        
        const findUser = await user.findOne({ email });
        if (!findUser) {
            return res.status(404).render('login', { error: 'User not found' });
        }
        
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).render('login', { error: 'Invalid credentials' });
        }

        const payload = {
            id: findUser.id,
            name: findUser.name || findUser.fullname,
            role: findUser.role
        };

        const token = generateToken(payload);
        
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        if (findUser.role === "admin") {
            return res.redirect('/admin/dashboard');
        } else if (findUser.role === "user") {
            return res.redirect('/');
        } else {
            return res.status(403).render('login', { error: 'Invalid user role' });
        }

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).render('login', { error: 'Internal server error' });
    }
};

exports.signupPost = async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        if (!fullname || !email || !password || !role) {
            return res.status(400).render('signup', { error: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).render('signup', { error: 'Invalid email format' });
        }

        const validRoles = ['user', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).render('signup', { error: 'Invalid role' });
        }

        const existingUser = await user.findOne({ email });
        if (existingUser) {
            return res.status(400).render('signup', { error: 'User already exists' });
        }

        const hashedpass = await bcrypt.hash(password, 10);

        const createUser = await user.create({
            name: fullname,
            email,
            password: hashedpass,
            role
        });

        const payload = {
            id: createUser.id,
            name: createUser.name,
            role: createUser.role
        };
        
        const token = generateToken(payload);
        
        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        if (createUser.role === "admin") {
            return res.redirect('/admin/dashboard');
        } else if (createUser.role === "user") {
            return res.redirect('/');
        }

    } catch (error) {
        console.error('Error details:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).render('signup', { error: error.message });
        }
        return res.status(500).render('signup', { error: 'Internal server error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
};