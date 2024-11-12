import express from "express";
import {
  createThematic,
  getAllThematics,
} from "../controllers/thematicController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.use(verifiJWT);
router.post("/create", createThematic);
router.get("/", getAllThematics);

export default router;
