const express = require('express');
const { getAllMovies, getMovieById } = require('../controllers/movies');

const router = express.Router();

router.get('/', getAllMovies);

router.get('/:id', getMovieById);

module.exports = router;