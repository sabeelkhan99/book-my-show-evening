const mongoose = require('mongoose');
const crypto = require('crypto');

const paymentSchema = new mongoose.Schema({
    txnId: {
        type: String,
        unique: true
    },
    amount: {
        type: Number,
        min: 0
    },
    bookingId: String,
    status: {
        type: String,
        enum: ['PENDING', 'PAID', 'CANCELLED']
    },
    method: {
        type: String
    }
}, { timestamps: true });

paymentSchema.pre('save', function () {
    if (!this.txnId) {
        const randomPart = crypto.randomBytes(6).toString('hex').toUpperCase();
        this.txnId = `TXN${randomPart}`;
    }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;