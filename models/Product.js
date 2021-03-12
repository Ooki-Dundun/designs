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
        enum: ['Coton', 'Silk', 'Leather', 'Wool', 'Other']
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
        default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
    }]
});

// create model
const ProductModel = mongoose.model('products', productSchema);

// export model
module.exports = ProductModel;