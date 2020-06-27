const mongoose = require('mongoose');

mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});