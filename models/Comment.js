// require mongoose
const mongoose = require('mongoose');

// create  schema
const commentSchema = new mongoose.Schema({
    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    content: {
        required: true,
        type: String
    },
    date: {
        type: date
    }
});

// create model
const CommentModel = mongoose.model('comments', commentSchema);

// export model
module.exports = CommentModel;
