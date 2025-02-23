const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller'); // ✅ Importing the controller correctly
const authUser = require('../middlewares/authMiddleware'); // ✅ Importing auth middleware

// ✅ Public Routes (NO authentication needed)
router.post('/register', [
    body('fullname.firstname').trim().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('fullname.lastname').optional().isLength({ min: 3 }).withMessage('Last name must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.registerUser); // ✅ Ensure registerUser exists in user.controller.js

router.post('/login', [
    body('email').trim().isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], userController.loginUser);

// ✅ Private Routes (Require Authentication)
router.get('/profile', authUser, userController.getUserProfile);
router.get('/logout', authUser, userController.logoutUser);

module.exports = router;
