import express from 'express';
import { addTown, getTowns } from '../controllers/townController.js';
import { verifiJWT } from '../middlewares/verfyJWT.js';

const router = express.Router();

router.use(verifiJWT);
router.get('/', getTowns);
router.post('/', addTown);

export default router;