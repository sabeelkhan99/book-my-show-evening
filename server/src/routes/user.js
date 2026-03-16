const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const ApiResponse = require('../core/ApiResponse');
const { BadRequestError, AuthenticationError } = require('../core/ApiError');
const jwt = require('jsonwebtoken');
const { isLoggedIn } = require('../middlewares/user');
const crypto = require('crypto');
const MailgunClient = require('../lib/MailGunClient');

const JWT_SECRET = process.env.JWT_SECRET;

// Register Route
router.post('/register', async (req, res) => {
    const { email, password, username, role } = req.body;
    // if user with this username already exist
    const user = await User.findOne({ username });
    if (user) {
        throw new BadRequestError('User with this username already exists');
    }
    const hash = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email, username, password: hash, role });
    res.json(ApiResponse.build(true, { email: newUser.email, username: newUser.username }, 'Registered successfully'));
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // check if the user exist with this username
    const user = await User.findOne({ username });
    if (!user) {
        throw new BadRequestError('username or password is invalid');
    }

    // we have to verify is incoming password and stored password are same.
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        throw new BadRequestError('username or password is invalid');
    }

    // Generate the token - JWT (you can also implement access token & refresh token)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {expiresIn: '7d'});

    res.json(ApiResponse.build(true, {token: token}, 'LoggedIn Successfully'));
});

// Fetch Profile
router.get('/profile', isLoggedIn, async (req, res) => {
    const { userId } = req;
    const user = await User.findById(userId);
    res.json(ApiResponse.build(true, { username: user.username, email: user.email, role: user.role }, 'User profile details'));
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body; 
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError('Invalid Email');
    }

    // create a random token
    const token = crypto.randomBytes(12).toString('hex');
    
    // We can hash and store the token, so that if db is compromised, the real token values are not exposed.
    user.resetPasswordToken = token;
    user.resetPasswordExpiry = new Date().getTime() + 15 * 60 * 1000;

    await user.save();

    // Generate the link for reset password 
    const forgotPasswordUrl = `${process.env.FRONTEND_BASE_URL}/reset-password?token=${token}`;
    
    await MailgunClient.sendEmail(email, 'Forgot Password', `
        Hi There!
        Please click on the link ${forgotPasswordUrl}, to reset your password .

        Thanks
        BookMyShowTeam
        `)
    
    res.json(ApiResponse.build(true, 'Reset password link sent', 'Reset password link sent'));
});

router.post('/reset-password', async(req, res) => {
    const { token, email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new BadRequestError('Invalid Email');
    }

    // Check if token is valid and has not expired
    if (!user.isValidResetToken(token)) {
        throw new BadRequestError('Invalid Token or Token has expired');
    }

    const newHash = await bcrypt.hash(password, 12);

    user.password = newHash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    await user.save();

    res.json(ApiResponse.build(true, 'Password reset successfully', 'Password reset successfully'));
})

module.exports = router;