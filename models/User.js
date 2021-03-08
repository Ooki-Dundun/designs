// require mongoose
const mongoose = require('mongoose');

// create schema
const userSchema = new mongoose.Schema({
    firstName: {
        required: true,
        type: String,
    },
    lastName: {
        required: true,
        type: String,
    },
    companyEmail: {
        required: true,
        type: String,
    },
    phoneNumber: {
        required: true,
        type: Number,
    },
    password: {
        required: true,
        type: String,
    },
    team: {
        type: String,
        enum: ['upcomingSeason', 'currentSeason', 'pastSeason']
    },
    role: {
        type: String,
        enum: ['headDesigner', 'editor', 'staff'],
        default: 'staff'
    }
});

// create model
const UserModel = mongoose.model('users', userSchema);

// export model
module.exports = UserModel;