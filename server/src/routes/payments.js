const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const ApiResponse = require('../core/ApiResponse');

const router = express.Router();

router.post('/', async (req, res) => {
    const { amount, bookingId, method } = req.body;

    const payment = await Payment.create({
        amount,
        bookingId,
        method,
        status: 'PENDING',
    });

    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: 'Movie Ticket',
                    },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        metadata: {
            bookingId,
            paymentId: payment._id.toString(),
        },
        return_url: `http://localhost:5173/payments/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json(
        ApiResponse.build(
            true,
            {
                payment,
                sessionId: session.id,
                clientSecret: session.client_secret,
            },
            'Payment created successfully'
        )
    );
});

router.get('/verify', async (req, res) => {
    const { sessionId } = req.query;

    if (!sessionId) {
        return res
            .status(400)
            .json(ApiResponse.build(false, null, 'sessionId is required'));
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const { bookingId, paymentId } = session.metadata || {};

    if (!bookingId || !paymentId) {
        return res
            .status(400)
            .json(ApiResponse.build(false, null, 'Invalid session metadata'));
    }

    const isPaid = session.payment_status === 'paid';

    const payment = await Payment.findByIdAndUpdate(
        paymentId,
        { status: isPaid ? 'PAID' : 'CANCELLED' },
        { new: true }
    );

    const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status: isPaid ? 'CONFIRMED' : 'CANCELLED' },
        { new: true }
    );

    res.json(
        ApiResponse.build(
            true,
            {
                payment,
                booking,
                stripeSession: {
                    id: session.id,
                    status: session.status,
                    paymentStatus: session.payment_status,
                },
            },
            isPaid ? 'Payment successful' : 'Payment cancelled'
        )
    );
});

module.exports = router;