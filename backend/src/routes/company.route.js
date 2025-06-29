import express from "express";

const router = express.Router();

import { registerCompany, loginCompany } from "../controllers/companyController.controller.js";

router.post("/signup" , registerCompany);

router.post("/login", loginCompany);

export default router;