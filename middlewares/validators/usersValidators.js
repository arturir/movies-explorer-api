const { celebrate, Joi } = require("celebrate");
const regExpEmail = require("../../regexp/email");

const validationBodyCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).regex(regExpEmail),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const validationBodyLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).regex(regExpEmail),
    password: Joi.string().required().min(2),
  }),
});

const validationBodyPatchMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(3).regex(regExpEmail),
  }),
});

module.exports = { validationBodyCreateUser, validationBodyLogin, validationBodyPatchMe };
