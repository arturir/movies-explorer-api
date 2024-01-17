const mongoose = require("mongoose");
const regExpUrl = require("../regexp/url");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExpUrl.test(value),
      message: "Некорректный формат email",
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExpUrl.test(value),
      message: "Некорректный формат email",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => regExpUrl.test(value),
      message: "Некорректный формат email",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie;
