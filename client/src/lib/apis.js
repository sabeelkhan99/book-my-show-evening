import axios from 'axios';

const BASE_URL = 'http://localhost:3000'

export async function fetchMovies() {
    const res = await axios.get(`${BASE_URL}/api/v1/movies`);
    return res.data;
}

export async function fetchMovieById(id) {
    const res = await axios.get(`${BASE_URL}/api/v1/movies/${id}`);
    return res.data;
}

export async function registerUser(newUser) {
    const res = await axios.post(`${BASE_URL}/api/v1/users/register`, { ...newUser });
    return res.data;
}

export async function loginUser(userCredentials) {
    const res = await axios.post(`${BASE_URL}/api/v1/users/login`, { ...userCredentials });
    return res.data;
}

export async function fetchProfile() {
    const res = await axios.get(`${BASE_URL}/api/v1/users/profile`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export async function createTheatre(theatre) {
    const res = await axios.post(
        `${BASE_URL}/api/v1/theatres`,
        { ...theatre },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function fetchTheatres() {
    const res = await axios.get(
        `${BASE_URL}/api/v1/theatres`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function fetchTheatreById(id) {
    const res = await axios.get(
        `${BASE_URL}/api/v1/theatres/${id}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function addMovieToTheatre({ movieId, theatreId }) {
    const res = await axios.post(
        `${BASE_URL}/api/v1/theatres/${theatreId}/movies`,
        { movieId },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function fetchBookings() {
    const res = await axios.get(`${BASE_URL}/api/v1/bookings`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    return res.data;
}

export async function createBooking({ totalPrice, theatreId, movieId, seats }) {
    const res = await axios.post(
        `${BASE_URL}/api/v1/bookings`,
        { totalPrice, theatreId, movieId, seats },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function createPayment({ amount, bookingId, method }) {
    const res = await axios.post(
        `${BASE_URL}/api/v1/payments`,
        { amount, bookingId, method },
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function verifyPayment({ sessionId }) {
    const res = await axios.get(
        `${BASE_URL}/api/v1/payments/verify`,
        {
            params: { sessionId },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }
    );
    return res.data;
}

export async function forgotPassword({ email }) {
    const res = await axios.post(
        `${BASE_URL}/api/v1/users/forgot-password`,
        { email }
    );
    return res.data;
}

export async function resetPassword({ email, token, password }) {
    const res = await axios.post(
        `${BASE_URL}/api/v1/users/reset-password`,
        { email, token, password }
    );
    return res.data;
}
