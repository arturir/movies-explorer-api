const { NODE_ENV, JWT_SECRET } = process.env;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const secretKey = NODE_ENV === "production" ? JWT_SECRET : "dev-secret";
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Такого пользователя не существует");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError("Переданы некорректные данные для получения пользователя."));
      } else {
        next(err);
      }
    });
};

module.exports.patchUserById = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.params._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError("Пользователь с указанным _id не найден.");
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError("Переданы некорректные данные при обновлении профиля."));
      } else {
        if (err.code === 11000) {
          next(new ConflictError("Пользователь с таким Email уже существует."));
        }
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const { email, name } = req.body;
      User.create({ email, name, password: hash })
        .then((newUser) => {
          const { password: _, ...user } = newUser._doc;
          res.send({ user });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.ValidationError) {
            next(new BadRequestError("Переданы некорректные данные при создании пользователя."));
          } else {
            if (err.code === 11000) {
              next(new ConflictError("Такой пользователь уже существует."));
            }
            next(err);
          }
        });
    });
  };

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, { expiresIn: "7d" });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
