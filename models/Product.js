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
    }],
    category: {
        type: String,
        required: true,
        enum: ['Top', 'Pants', 'Dress', 'Skirt', 'Shoes', 'Other']
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
    }]
});

// create model
const ProductModel = mongoose.model('products', productSchema);

// export model
module.exports = ProductModel;