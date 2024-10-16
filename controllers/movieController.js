import Movie from "../models/Movie.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const getAllMovies = asyncHandler(async (req, res, next) => {
  try {
    const allMovies = await Movie.find({});
    res.status(200).json(allMovies);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

const createMovie = asyncHandler(async (req, res) => {
  try {
    const newMovie = new Movie(req.body);
    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getSpecificMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const specificMovie = await Movie.findById(id);
    if (!specificMovie) {
      return res.status(404).json({ message: "Movie not Found" });
    }
    res.status(200).json(specificMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const updateMovie = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const movieReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const movie = await Movie.findById(req.params.id);

  if (movie) {
    const alreadyReviewed = movie.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Movie Already reviewed");
    }
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    movie.reviews.push(review);
    movie.numReviews = movie.reviews.length;
    movie.rating =
      movie.reviews.reduce((a, b) => b.rating + a, 0) / movie.reviews.length;

    await movie.save();

    res.status(200).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Movie Not Found");
  }
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movieToDelete = await Movie.findByIdAndDelete(id);
  if (!movieToDelete) {
    return res.status(404).json({ message: "Movie not found" });
  }
  res.status(200).json({ message: "movie deleted successfully" });
});

const deleteComment = asyncHandler(async (req, res) => {
  const { movieId, reviewId } = req.body;

  const movie = await Movie.findById(movieId);

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }
  const reviewIndex = movie.reviews.findIndex(
    (r) => r._id.toString() === reviewId
  );
  if (reviewIndex === -1) {
    return res.status(404).json({ message: "comment not found" });
  }
  movie.reviews.splice(reviewIndex, 1);
  movie.numReviews = movie.reviews.length;
  movie.rating =
    movie.reviews.length > 0
      ? movie.reviews.reduce((a, b) => b.rating + a, 0) / movie.reviews.length
      : 0;

  await movie.save();
  res.json({ message: "Comment deleted successfully" });
});

const getNewMovies = asyncHandler(async (req, res) => {
  const newMovies = await Movie.find().sort({ createdAt: -1 }).limit(10);
  res.status(200).json(newMovies);
});

const getTopMovies = asyncHandler(async (req, res) => {
  const topRatedMovies = await Movie.find().sort({ numReviews: -1 }).limit(10);
  res.status(200).json(topRatedMovies);
});

const getRandomMovies = asyncHandler(async (req, res) => {
  const randomMovies = await Movie.aggregate([{ $sample: { size: 10 } }]);
  if (!randomMovies.length) {
    return res.status(404).json({ message: "No movies found" });
  }
  res.status(200).json(randomMovies);
});

export {
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
};
