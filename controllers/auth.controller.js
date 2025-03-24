const user = require('../models/user.model');
const bcrypt = require('bcrypt')

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
            return res.status(400).send('Please fill in all fields');
        }

        
        const findUser = await user.findOne({ email });
        if (!findUser) {
            return res.status(404).send('User not found');
        }

        
        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials');
        }

        // Role-based redirection
        if(findUser.role === "admin") {
            return res.render('admin/admin');
        } else if(findUser.role === "user") {
            return res.render('user/home');
        } else {
            return res.status(403).send('Invalid user role');
        }

        res.status(200).send('Login successful');
        console.log('User logged in:', findUser);

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send('Internal server error');
    }
};


exports.signupPost = async(req, res) => {
   try{
    const { fullname, email, password, role } = req.body;

    const hashedpass = await bcrypt.hash(password , 10)

    const createUser = await user.create({
        fullname ,
        email,
        password : hashedpass,
        role
    });

    res.send('user created succesfully')
    console.log(createUser);
   }catch{
    return res.status(505).send('user creation failed')
   }


    
};