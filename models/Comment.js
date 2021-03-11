// require mongoose
const mongoose = require('mongoose');

// create  schema
const commentSchema = new mongoose.Schema({
    product: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'products'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    content: {
        required: true,
        type: String
    },
    date: {
        required: true,
        type: Date
    }
});

// create model
const CommentModel = mongoose.model('comments', commentSchema);

// export model
module.exports = CommentModel;
