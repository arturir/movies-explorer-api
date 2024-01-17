const router = require("express").Router();
const { getMovies, createMovie, deleteMovie } = require("../controllers/movies");
const { validationBodyCreateMovie, validationParams } = require("../middlewares/validators/moviesValidators");

const setOwner = function (req, res, next) {
  req.body.newFilm.owner = req.user._id;
  next();
};

router.get("/", getMovies);
router.post("/", validationBodyCreateMovie, setOwner, createMovie);
router.delete("/:_id", validationParams, deleteMovie);

module.exports = router;
