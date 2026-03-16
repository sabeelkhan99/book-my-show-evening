const { AuthenticationError, NotFoundError, AuthorizationError } = require("../core/ApiError");
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET

const isLoggedIn = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
        throw new AuthenticationError('Please login to continue');
    }

    const token = authorizationHeader.replace("Bearer ", "");
    const { userId } = jwt.verify(token, JWT_SECRET);
    req.userId = userId;
    next();
}

const isPartner = async(req, res, next) => {
    const { userId } = req;
    const user = await User.findById(userId);
    if (!user) {
        throw NotFoundError('User not found');
    }
    if (user.role !== 'PARTNER') {
        throw new AuthorizationError('You do not have required access to this resource');
    }
    next();
}

module.exports = {
    isLoggedIn,
    isPartner
}