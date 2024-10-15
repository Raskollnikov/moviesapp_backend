import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import connectDb from "./config/db.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";

dotenv.config();

connectDb();

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const port = process.env.PORT || 3000;

//ROUTES

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.listen(port, () => console.log(`server is running on PORT:${port}`));
