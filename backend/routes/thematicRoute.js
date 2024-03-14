import express from "express";
import {
  createThematic,
  getAllThematics,
} from "../controllers/thematicController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.post("/create", createThematic);
router.get("/", verifiJWT, getAllThematics);

export default router;
