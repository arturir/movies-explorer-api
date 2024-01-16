const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { getUserById, patchUserById } = require("../controllers/users");
const regExpEmail = require("../regexp/email");

const validationBodyPatchMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(3).regex(regExpEmail),
  }),
});

const setCurrentUser = function (req, res, next) {
  req.params._id = req.user._id;
  next();
};

router.get("/me", setCurrentUser, getUserById);
router.patch("/me", setCurrentUser, validationBodyPatchMe, patchUserById);

module.exports = router;
