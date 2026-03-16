const express = require('express');
const { isLoggedIn } = require('../middlewares/user');
const Booking = require('../models/Booking');
const { BadRequestError } = require('../core/ApiError');
const ApiResponse = require('../core/ApiResponse');

const router = express.Router();

router.post('/', isLoggedIn, async(req, res) => {
    const { userId } = req;
    const { totalPrice, theatreId, movieId, seats } = req.body;

    const existingBooking = await Booking.findOne({
        theatre: theatreId,
        movie: movieId,
        user: userId,
        seats: { $in : [...seats]}
    });

    if (existingBooking) {
        throw new BadRequestError('Some of the tickets are already booked');
    }

    const booking = await Booking.create({
        user: userId,
        theatre: theatreId,
        movie: movieId,
        status: 'PENDING',
        totalPrice: totalPrice,
        seats: seats
    });

    res.json(ApiResponse.build(true, booking, 'Booking created successfully'));
});

router.get('/', isLoggedIn, async (req, res) => {
    const { userId } = req;
    const bookings = await Booking.find({ user: userId })
        .populate('movie')
        .populate('theatre')
        .sort({ createdAt: -1 });
    res.json(ApiResponse.build(true, bookings, 'Bookings fetched successfully'));
});


module.exports = router;