const userModel = require('../models/user.model');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.registerUser = async (req, res, next) => {
    console.log(" Full Request Body:", req.body);  // Debugging Line

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const fullname = req.body.fullname || {};
    const firstname = fullname.firstname || null;
    const lastname = fullname.lastname || null;
    const { email, password } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({ error: "First name and last name are required." });
    }

    try {
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userModel.create({
            fullname: { firstname, lastname },
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(201).json({ token, user });

    } catch (error) {
        console.error(" Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

//  Add loginUser function
module.exports.loginUser = async (req, res, next) => {
    console.log("Login Request Body:", req.body);  // Debugging

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        //  Find user by email
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // ✅Generate JWT Token
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({ token, user });

    } catch (error) {
        console.error(" Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



