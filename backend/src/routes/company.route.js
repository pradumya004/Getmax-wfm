import express from "express";

import Company from "../models/company.model.js";
import cookieParser from "cookie-parser";

const router = express.Router();

import { registerCompany, loginCompany } from "../controllers/companyController.controller.js";

router.post("/signup" , registerCompany);

router.get("/login", loginCompany);

export default router;