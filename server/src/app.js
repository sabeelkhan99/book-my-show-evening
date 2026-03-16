const express = require('express');
const cors = require('cors');
const { ApiError } = require('./core/ApiError');
const { JsonWebTokenError } = require('jsonwebtoken');

// Routes
const healthcheckRoutes = require('./routes/health');
const moviesRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');
const theatresRoutes = require('./routes/theatre');
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(healthcheckRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/theatres", theatresRoutes);
app.use("/api/v1/bookings", bookingsRoutes);
app.use("/api/v1/payments", paymentsRoutes);


// Global Exception handler
app.use((err, req, res, next) => {
    if (!(err instanceof JsonWebTokenError)) {
        console.log(err);
    }
    if (err instanceof ApiError) {
        const { status = 500, message = 'Internal server error' } = err;
        return res.status(status).json({
            success: false,
            message: message
        });
    }
    return res.status(500).json({ success: false, message: 'Something went wrong' });
})

module.exports = app;