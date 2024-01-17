const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const regExpEmail = require("../regexp/email");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => regExpEmail.test(value),
      message: "Некорректный формат email",
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 2,
    maxLength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        throw new Error("Неправильная почта или пароль");
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Error("Неправильная почта или пароль");
          }
          return user;
        });
    });
};

const User = mongoose.model("User", userSchema);
module.exports = User;
