import express from "express";

const router = express.Router();

//controllers

import {
  createGenre,
  updateGenre,
  deleteGenre,
  getAllGenres,
  getSpecific,
} from "../controllers/genreController.js";

//middlewares
import {
  authenticated,
  authorizeAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticated, authorizeAdmin, createGenre);
router
  .route("/:id")
  .put(authenticated, authorizeAdmin, updateGenre)
  .delete(authenticated, authorizeAdmin, deleteGenre);

router.route("/genres").get(getAllGenres);
router.route("/:id").get(getSpecific);
export default router;
