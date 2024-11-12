import express from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/commentController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.use(verifiJWT);
router.post("/create", addComment);
router.get("/", getComments);
router.patch("/update", updateComment);
router.delete("/delete", deleteComment);

export default router;
