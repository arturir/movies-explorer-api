const { celebrate, Joi } = require("celebrate");
const regExpUrl = require("../../regexp/url");

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
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports = { validationBodyCreateMovie, validationParams };
