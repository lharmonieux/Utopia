import express from 'express';
import { createQuestionType } from '../controllers/questionTypeController.js';
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.use(verifiJWT);
router.post("/create", createQuestionType);

export default router;