const mongoose = require("mongoose");
const Movie = require("../models/movie");

const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ movies }))
    .catch((err) => { next(err); });
};

module.exports.createMovie = (req, res, next) => {
  const { newFilm } = req.body;
  Movie.create(newFilm)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Переданы некорректные данные при создании фильма."));
      } else {
        next(err);
      }
  });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params._id)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError("Такой карточки не существует");
    } else if (!movie.owner.equals(req.user._id)) {
      throw new ForbiddenError("Вы не являетесь владельцем данной карточки");
    } else {
      movie.deleteOne()
        .then(() => { res.send({ message: "Карточка удалена" }); })
        .catch(next);
    }
  })
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError("Переданы некорректные данные для удаления карточки."));
    } else {
      next(err);
    }
  });
};
