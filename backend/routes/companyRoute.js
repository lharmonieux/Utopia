import express from "express";
import {
  addCompany,
  deleteCompany,
  getAllCompanies,
  updateCompany,
} from "../controllers/companyControllers.js";
import { verifiJWT } from "../middlewares/verfyJWT.js";

const router = express.Router();

router.use(verifiJWT);
router.get("/", getAllCompanies);
router.post("/", addCompany);
router.patch("/", updateCompany);
router.delete("/", deleteCompany);

export default router;
