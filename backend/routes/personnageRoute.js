import express from "express";
import { 
    addPersonnage, getAllPersonnage 
} from "../controllers/personnageController.js";

const router = express.Router();

router.post('/', addPersonnage);
router.get('/', getAllPersonnage);
export default router;