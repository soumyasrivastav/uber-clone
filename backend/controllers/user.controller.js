const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator'); 

module.exports.registerUser = async (req, res, next) => {
    console.log("Full Request Body:", JSON.stringify(req.body, null, 2));  // Debugging

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // ✅ Ensure `fullname` exists
    const fullname = req.body.fullname || {};
    const firstname = fullname.firstname || null;
    const lastname = fullname.lastname || null;
    const { email, password } = req.body;

    if (!firstname || !lastname) {
        return res.status(400).json({ error: "First name and last name are required." });
    }

    try {
        const hashedPassword = await userModel.hashPassword(password);
        const user = await userService.createUser({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();
        return res.status(201).json({ token, user });

    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

