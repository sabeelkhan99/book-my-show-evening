const express = require('express');
const Theatre = require('../models/Theatre');
const ApiResponse = require('../core/ApiResponse');
const { isLoggedIn, isPartner } = require('../middlewares/user');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { NotFoundError } = require('../core/ApiError');

const router = express.Router();

// Create the theatre
router.post('/', isLoggedIn, isPartner, async (req, res) => {
    const { name, address, capacity } = req.body;
    const { userId } = req;
    const theatre = await Theatre.create({ name, address, capacity, user: userId });
    res.json(ApiResponse.build(true, { id: theatre._id }, 'Theatre created'));
});

// fetch all the theatres
router.get('/',isLoggedIn, isPartner, async (req, res) => {
    const theatres = await Theatre.find({})
        .populate({ path: 'user', select: '-password' });
    res.json(ApiResponse.build(true, theatres, 'Theatres fetched'));
});

// fetch theatre by id
router.get('/:id',isLoggedIn, isPartner, async (req, res) => {
    const { id } = req.params;
    const theatre = await Theatre.findById(id).populate({ path: 'user', select: '-password' });
    res.json(ApiResponse.build(true, theatre, 'Theatre fetched'));
});

// add movie to a theatre

router.post('/:theatreId/movies', async(req, res) => {
    const { movieId } = req.body;
    const { theatreId } = req.params;

    await Theatre.findByIdAndUpdate(theatreId, { $addToSet: { movies: movieId } });
    await Movie.findByIdAndUpdate(movieId, { $addToSet: { theatres: theatreId } });

    res.json(ApiResponse.build(true, null, 'Movie added successfully'));
})

module.exports = router;