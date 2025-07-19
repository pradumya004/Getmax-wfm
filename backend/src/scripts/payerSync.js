// backend/src/scripts/syncPayers.js

import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Payer } from '../models/payer-model.js';
import { transformClaimMDPayer } from './adapters/claimmdAdapter.js';

dotenv.config();
const CLAIM_MD_URL = 'https://www.claim.md/payer_list.json';
const SOURCE = 'ClaimMD';

const companyRef = process.env.SYNC_COMPANY_ID;
const createdBy = process.env.SYNC_EMPLOYEE_ID;

const syncClaimMDPayers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const { data } = await axios.get(CLAIM_MD_URL);
    console.log(`📥 Downloaded ${data.length} payers from ${SOURCE}`);

    const bulkOps = data.map((payer) => {
      const mapped = transformClaimMDPayer(payer, companyRef, createdBy);
      return {
        updateOne: {
          filter: { 'identifiers.payerIdNumber': payer.PayerID },
          update: { $set: mapped },
          upsert: true
        }
      };
    });

    const result = await Payer.bulkWrite(bulkOps);
    console.log(`✅ Synced ${result.upsertedCount + result.modifiedCount} payers from ${SOURCE}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Sync failed:", err.message || err);
    process.exit(1);
  }
};

syncClaimMDPayers();
