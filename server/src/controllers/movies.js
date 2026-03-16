const Movie = require('../models/Movie');
const ApiResponse = require('../core/ApiResponse');

const getAllMovies = async (req, res) => {
    // This will fetch all the movies from the db
    const movies = await Movie.find({});
    res.json(ApiResponse.build(true, movies, 'All Movies'));
}

const getMovieById = async (req, res) => {
    const { id } = req.params;
    const movie = await Movie.findById(id).populate('theatres');
    res.json(ApiResponse.build(true, movie, 'Movie'));
}

module.exports = {
    getAllMovies,
    getMovieById
}