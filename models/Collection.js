// require mongoose
const mongoose = require('mongoose');

// create schema
const collectionSchema = new mongoose.Schema({
    season: {
        required: true,
        enum: ['Winter', 'Summer', 'Spring', 'Autumn']
    },
    year: {
        required: true,
        type: Date
    }
});

// create model
const CollectionModel = mongoose.model('collections', collectionSchema);

// export model
module.exports = CollectionModel;
