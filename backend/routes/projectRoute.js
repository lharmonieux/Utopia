import express from "express";
import {
  addProject,
  deleteProject,
  getProjectsByAdmin,
  updateProject,
} from "../controllers/projectController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.use(verifiJWT);
router.get("/", getProjectsByAdmin);
router.post("/", addProject);
router.patch("/", updateProject);
router.delete("/", deleteProject);

export default router;
