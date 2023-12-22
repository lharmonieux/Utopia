import express from "express";
import { 
    addPersonnage, getAllPersonnage 
} from "../controllers/characterController.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.use(verifiJWT);
router.post('/', addPersonnage);
router.get('/', getAllPersonnage);

export default router;