const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const BlacklistTokenModel = require('../models/blacklistToken.model'); // ✅ Ensure correct import

const authUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // ✅ Check if token is blacklisted
        const isBlacklisted = await BlacklistTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ error: 'Unauthorized: Token blacklisted' });
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authUser;







