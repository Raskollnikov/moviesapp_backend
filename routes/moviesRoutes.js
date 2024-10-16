import express from "express";

const router = express.Router();
//controllers
import {
  getAllMovies,
  createMovie,
  getSpecificMovie,
  updateMovie,
  movieReview,
  deleteMovie,
  deleteComment,
  getNewMovies,
  getTopMovies,
  getRandomMovies,
} from "../controllers/movieController.js";
//Middlewares
import {
  authenticated,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

import checkId from "../middlewares/checkId.js";

//public routes

router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", getSpecificMovie);

router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);

//restricted routes
router.post("/:id/reviews", authenticated, checkId, movieReview);
//routes fro admin

router.post("/create-movie", authenticated, authorizeAdmin, createMovie);
router.put("/update-movie/:id", authenticated, authorizeAdmin, updateMovie); // Daasrule
router.delete("/delete-movie/:id", authenticated, authorizeAdmin, deleteMovie);

router.delete("/delete-comment", authenticated, authorizeAdmin, deleteComment);
export default router;
