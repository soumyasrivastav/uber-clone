const userModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BlacklistTokenModel = require('../models/blacklistToken.model');


// 🔹 Register User
module.exports.registerUser = async (req, res, next) => {
    console.log("🔥 Full Request Body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    const { firstname, lastname } = fullname || {};

    if (!firstname || !lastname) {
        return res.status(400).json({ error: "First name and last name are required." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullname: { firstname, lastname },
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

        return res.status(201).json({
            message: "User registered successfully!",
            token,
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email
            }
        });

    } catch (error) {
        console.error("🔥 Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


// 🔹 Login User
module.exports.loginUser = async (req, res, next) => {
    console.log("🔥 Login Request Body:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });

        user.password = undefined;

        return res.status(200).json({ message: "Login successful!", token, user });

    } catch (error) {
        console.error("🔥 Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


// 🔹 Get User Profile (Protected Route)
module.exports.getUserProfile = async (req, res, next) => {
    console.log("🔥 Get Profile Request Body:", req.body);

    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user });

    } catch (error) {
        console.error("🔥 Error fetching profile:", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


// 🔹 Logout User (Blacklist Token)
module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(400).json({ error: "No token provided" });
        }

        await BlacklistTokenModel.create({ token });

        res.clearCookie('token');

        return res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error("🔥 Error during logout:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

