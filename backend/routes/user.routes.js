const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');

router.post('/register', [
    body('fullname.firstname')
        .trim()
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),

    body('fullname.lastname')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Last name must be at least 3 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid Email'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
],
userController.registerUser);

module.exports = router;
