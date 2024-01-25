import express from 'express';
import { createThematic } from '../controllers/thematicController.js';

const router = express.Router();

router.post("/create", createThematic);

export default router;