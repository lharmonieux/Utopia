import express from "express";
import {
    addAct, 
    deleteAct,
    getAct,
    updateAct,
} from "../controllers/actController.js"

const router = express.Router();

router.post("/", addAct);
router.get("/", getAct);
router.put("/:id_act", updateAct);
router.delete("/:id_act", deleteAct);

export default router;