const router = require("express").Router();
const express = require("express");
const { celebrate, Joi, errors } = require("celebrate");

const NotFoundError = require("../errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { requestLogger, errorLogger } = require("../middlewares/logger");
const handlerCORS = require("../middlewares/handlerCORS");
const errorHandler = require("../middlewares/errorHandler");

const regExpEmail = require("../regexp/email");

const validationBodyCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).regex(regExpEmail),
    password: Joi.string().required().min(2),
    name: Joi.string().min(2).max(30),
  }),
});

const validationBodyLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(3).regex(regExpEmail),
    password: Joi.string().required().min(2),
  }),
});

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(requestLogger);
router.use(handlerCORS);
router.use("/users", auth, require("./users"));
router.use("/movies", auth, require("./movies"));

router.post("/signin", validationBodyLogin, login);
router.post("/signup", validationBodyCreateUser, createUser);

router.use("*", (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

router.use(errorLogger);
router.use(errors());
router.use(errorHandler);

module.exports = router;
