const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ez-scout', {
    useNewUrlParser: true,
    useCreateIndex: true
});