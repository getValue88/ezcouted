const mongoose = require('mongoose');

const Team = mongoose.model('Team', {
    player: {
        type: String,
        required: true
    },
    result: {
        type: String,
        required: true
    },
    p1: {
        type: String,
        required: true
    },
    p2: {
        type: String,
        required: true
    },
    p3: {
        type: String,
        required: true
    },
    p4: {
        type: String,
        required: true
    },
    p5: {
        type: String,
        required: true
    },
    p6: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});


module.exports = Team;
