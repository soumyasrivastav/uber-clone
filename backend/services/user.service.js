const userModel = require('../models/user.model');


module.exports.createUser = async ({ firstname, lastname, email, password }) => {
    try {
        const user = new userModel({
            fullname: { firstname, lastname },  
            email,
            password
        });

        await user.save();
        return user;
    } catch (error) {
        console.error(" Error creating user:", error);
        throw error;
    }
};
