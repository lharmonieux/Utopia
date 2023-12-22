import express from "express";
import { createUser, getUser, updateUser } from "../controllers/userController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.post("/register", createUser);
router.get("/", verifiJWT, getUser);
router.put("/update", verifiJWT,  updateUser);

export default router;
