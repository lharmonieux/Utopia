import express from 'express';
import { createAnswerType } from '../controllers/answerTypeController.js';

const router = express.Router();

router.post("/create", createAnswerType);

export default router;