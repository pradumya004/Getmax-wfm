// backend/src/routes/payer.route.js

import express from 'express';
import { getAllPayers, syncClaimMDPayers } from '../controllers/payer/payerController.controller.js';
import { verifyEmployeeToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/sync/claimmd', verifyEmployeeToken, syncClaimMDPayers);
router.get("/list", verifyEmployeeToken, getAllPayers); // 👈 New route to fetch payers


export default router;
