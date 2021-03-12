// require mongoose
const mongoose = require("mongoose");

// create schema
const serieSchema = new mongoose.Schema({
  season: {
    type: String,
    required: true,
    enum: ["Winter", "Summer", "Spring", "Autumn"],
  },
  year: {
    required: true,
    type: Number,
  },
});

// create model
const SerieModel = mongoose.model("series", serieSchema);

// export model
module.exports = SerieModel;
