const router = require("express").Router();
const express = require("express");
const { errors } = require("celebrate");

const NotFoundError = require("../errors/NotFoundError");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validationBodyCreateUser, validationBodyLogin } = require("../middlewares/validators/usersValidators");
const { requestLogger, errorLogger } = require("../middlewares/logger");
const handlerCORS = require("../middlewares/handlerCORS");
const errorHandler = require("../middlewares/errorHandler");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use(requestLogger);
router.use(handlerCORS);
router.use("/users", auth, require("./users"));
router.use("/movies", auth, require("./movies"));

router.post("/signin", validationBodyLogin, login);
router.post("/signup", validationBodyCreateUser, createUser);

router.use("*", auth, (req, res, next) => {
  next(new NotFoundError("Страница не найдена"));
});

router.use(errorLogger);
router.use(errors());
router.use(errorHandler);

module.exports = router;
