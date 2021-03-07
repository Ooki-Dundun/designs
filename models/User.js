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
    password: {
        required: true,
        type: String,
    },
    phoneNumber: {
        required: true,
        type: Number,
    },
    team: {
        required: true,
        type: String,
        enum: ['upcomingSeason', 'currentSeason', 'pastSeason']
    }
});

// create model
const UserModel = mongoose.model('users', userSchema);

// export model
module.exports = UserModel;