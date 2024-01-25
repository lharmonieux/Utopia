import express from "express";
import {
    addAct, 
    deleteAct,
    getAct,
    updateAct,
} from "../controllers/actController.js"
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

// router.use(verifiJWT);
router.post("/create", addAct);
router.get("/", getAct);
router.put("/update/:id_act", updateAct);
router.delete("/:id_act", deleteAct);

export default router;