const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    },
    theatre: {
        type: mongoose.Schema.Types.ObjectId
    },
    totalPrice: {
        type: String,
        min: 0
    },
    seats: [
        {
            type: String,
            required: true
        }
    ],
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        default: 'PENDING'
    }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;