import express from "express";
import { getImages, uploadImage } from "../controllers/cloudinaryController.js";

const router = express.Router();

router.get("/images", getImages);
router.post("/upload", uploadImage);

export default router;
