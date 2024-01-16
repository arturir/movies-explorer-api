const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const regExpUrl = require("../regexp/url");
const { getMovies, createMovie, deleteMovie } = require("../controllers/movies");

const validationBodyCreateMovie = celebrate({
  body: Joi.object().keys({
    newFilm: {
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().regex(regExpUrl),
      trailerLink: Joi.string().required().regex(regExpUrl),
      thumbnail: Joi.string().required().regex(regExpUrl),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    },
  }),
});

const validationParams = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

const setOwner = function (req, res, next) {
  req.body.newFilm.owner = req.user._id;
  next();
};

router.get("/", getMovies);
router.post("/", validationBodyCreateMovie, setOwner, createMovie);
router.delete("/:_id", validationParams, deleteMovie);

module.exports = router;
