import express from 'express';
import { addTown, getTowns } from '../controllers/townController.js';

const router = express.Router();

router.get('/', getTowns);
router.post('/', addTown);

export default router;