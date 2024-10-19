import express from "express";
import multer from "multer";
import { storage } from "../storage/storage.js";

const router = express.Router();
const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded successfully!",
    imageUrl: req.file.path,
  });
});

export default router;
