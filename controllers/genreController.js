import Genre from "../models/Genre.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createGenre = asyncHandler(async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "name is required" });
    }

    const existingGenre = await Genre.findOne({ name });

    if (existingGenre) {
      return res.json({ error: "Genre Already Exists" });
    }

    const genre = await new Genre({ name }).save();
    res.json(genre);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

const updateGenre = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const genreToUpdate = await Genre.findOne({ _id: id });

    if (!genreToUpdate) {
      return res.status(404).json({ error: `genre with ID:${id} not found` });
    }

    genreToUpdate.name = name;

    const updatedGenre = await genreToUpdate.save();
    res.status(200).json(updatedGenre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteGenre = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const genreToDelete = await Genre.findByIdAndDelete(id);

    if (!genreToDelete) {
      return res.status(404).json({ message: "Genre not found" });
    }

    res.status(200).json(genreToDelete);
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete genre",
      error: error.message,
    });
  }
});

const getAllGenres = asyncHandler(async (req, res, next) => {
  try {
    const allGenres = await Genre.find({});
    res.json(allGenres);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const getSpecific = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const specific = await Genre.findOne({ _id: id });

    res.status(200).json(specific);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});
export { createGenre, updateGenre, deleteGenre, getAllGenres, getSpecific };
