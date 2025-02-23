const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,  // "require" should be "required"
            minlength: [3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        minlength: [5, 'Email must be at least 5 characters'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    }
});

//Generate Auth Token
userSchema.methods.generateAuthToken = function () { 
    const tokn = jwt.sign({ _id: this.id }, process.env.JWT_SECRET, { expiresIN: '24h' });
    return token;
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Hash Password
userSchema.statics.hashPassword = async function (password) { // Fix typo: "hashpassword" → "hashPassword"
    return await bcrypt.hash(password, 10);
};

// Create Model (Fixed userschema typo)
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
