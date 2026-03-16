const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
    name: String,
    address: String,
    capacity: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]
}, {timestamps: true});

const Theatre = mongoose.model('Theatre', theatreSchema);

module.exports = Theatre;