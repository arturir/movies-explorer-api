const router = require("express").Router();
const { getUserById, patchUserById } = require("../controllers/users");
const { validationBodyPatchMe } = require("../middlewares/validators/usersValidators");

const setCurrentUser = function (req, res, next) {
  req.params._id = req.user._id;
  next();
};

router.get("/me", setCurrentUser, getUserById);
router.patch("/me", setCurrentUser, validationBodyPatchMe, patchUserById);

module.exports = router;
