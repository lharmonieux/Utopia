import express from "express";
import { login, refresh } from "../controllers/authController.js";

const router = express.Router();

router.post("/", login);
router.get("/refresh", refresh);

export default router;
