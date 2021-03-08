// require mongoose
const mongoose = require('mongoose');

// create schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    designer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        required: true
    },
    editors: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'users',
        required: true
    }],
    category: {
        type: String,
        required: true,
        enum: ['top', 'pants', 'dress', 'squirt', 'shoes', 'other']
    },
    color: {
        type: String,
        required: true
    },
    material: {
        type: String,
        required: true,
        enum: ['coton', 'silk', 'leather', 'wool', 'other']
    },
    serie: {
        type: mongoose.Schema.Types.ObjectId, ref: 'series',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    internalNotes: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }]
});

// create model
const ProductModel = mongoose.model('products', productSchema);

// export model
module.exports = ProductModel;