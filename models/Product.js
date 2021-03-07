// require mongoose
const mongoose = require('mongoose');

// create schema
const productSchema = new mongoose.Schema({
    Name: {
        required: true,
        type: String,
    },
    designer: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    editors: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    category: {
        required: true,
        enum: ['top', 'pants', 'dress', 'squirt', 'shoes', 'other']
    },
    color: {
        required: true,
        type: [String]
    },
    material: {
        required: true,
        enum: ['coton', 'silk', 'leather', 'wool', 'other']
    },
    collection: {
        require: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'collections'
    },
    status: {
        required: true;
        type: String
    },
    internalNotes: {
        required: true,
        type: String,
    },
    image: {
        required: true,
        type: String
    }
});

// create model
const ProductModel = mongoose.model('products', productSchema);

// export model
module.exports = ProductModel;