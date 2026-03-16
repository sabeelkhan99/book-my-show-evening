const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String,
        minLength: 3,
        maxLength: 20
    },
    password: String,
    role: {
        type: String,
        enum: ['ADMIN', 'PARTNER', 'USER'],
        default: 'USER'
    },
    resetPasswordToken: String,
    resetPasswordExpiry: Number
}, { versionKey: false, timestamps: true });

userSchema.methods.isValidResetToken = function (token) {
    return (token === this.resetPasswordToken && new Date().getTime() < this.resetPasswordExpiry)
}
const User = mongoose.model('User', userSchema);

module.exports = User;