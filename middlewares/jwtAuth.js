const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).redirect('/login');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Error:', err.message);
        res.clearCookie('token'); // Clear invalid token
        return res.status(401).redirect('/login');
    }   
};

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });        
};

module.exports = {
    jwtMiddleware,
    generateToken 
};