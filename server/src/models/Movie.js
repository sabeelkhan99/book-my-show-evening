const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    posterUrl: String,
    genre: String,
    description: String,
    runtime: Number,
    cast: [
        {
            name: String,
            alias: String,
            profilePicture: String
        }
    ],
    theatres: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Theatre'
        }
    ]
},{timestamps: true});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;