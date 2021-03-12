// require mongoose
const mongoose = require("mongoose");

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
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  team: {
    type: String,
    enum: ["Upcoming", "Past", "Current", "Global", "None"],
    default: "None",
  },
  role: {
    type: String,
    enum: ["Designer", "Editor", "Staff"],
    default: "Staff",
  },
});

// create model
const UserModel = mongoose.model("users", userSchema);

// export model
module.exports = UserModel;
