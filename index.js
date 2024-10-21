import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import connectDb from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
dotenv.config();

connectDb();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const port = process.env.PORT || 3000;

//ROUTES

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);

const __dirname = path.resolve();

app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`server is running on PORT:${port}`));
