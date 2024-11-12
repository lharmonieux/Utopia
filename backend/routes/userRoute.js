import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  getUsersByProject,
  updateUser,
  editPassword,
  definePassword,
} from "../controllers/userController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.post("/register", verifiJWT, createUser);
router.get("/", verifiJWT, getUser);
router.get("/all", verifiJWT, getAllUsers);
router.get("/project", verifiJWT, getUsersByProject);
router.patch("/update", verifiJWT, updateUser);
router.patch("/update_password", verifiJWT, editPassword);
router.patch("/define_password", verifiJWT, definePassword);

export default router;
