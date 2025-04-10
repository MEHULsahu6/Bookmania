const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const jwtMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            res.clearCookie('token');
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.clearCookie('token');
            return res.redirect('/login?expired=true');
        }
        res.clearCookie('token');
        return res.redirect('/login');
    }
};

const roleCheck = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).render('error', { 
                message: 'Authentication required'
            });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).render('error', { 
                message: 'Access forbidden'
            });
        }
        next();
    };
};

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });        
};

module.exports = {
    jwtMiddleware,
    roleCheck,
    generateToken 
};