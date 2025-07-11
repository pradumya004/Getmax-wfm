// backend/src/controllers/claimtasks.controller.js

import asyncHandler from 'express-async-handler';
import xlsx from 'xlsx';
import { ClaimTask } from '../models/claimtasks-model.js';
import { SOW } from '../models/sow-model.js';
import { Patient } from '../models/patient-model.js';
import { Client } from '../models/client-model.js';
import { ApiError } from '../utils/ApiError.js';

// 1. Create a single claim task
export const createClaimTask = asyncHandler(async (req, res) => {
  const { sowRef, clientRef, patientRef } = req.body;

  // Validate ownership
  const client = await Client.findOne({ _id: clientRef, companyRef: req.companyId });
  if (!client) throw new ApiError(404, "Client not found");

  const sow = await SOW.findOne({ _id: sowRef, clientRef, companyRef: req.companyId });
  if (!sow) throw new ApiError(404, "SOW not found");

  const patient = await Patient.findOne({ _id: patientRef, sowRef, clientRef, companyRef: req.companyId });
  if (!patient) throw new ApiError(404, "Patient not found");

  const claim = await ClaimTask.create({
    ...req.body,
    companyRef: req.companyId,
    auditInfo: {
      createdBy: req.employeeId,
      lastModifiedBy: req.employeeId
    }
  });

  res.status(201).json({ success: true, data: claim });
});

// 2. Get all claims (with filters)
export const getAllClaimTasks = asyncHandler(async (req, res) => {
  const filter = { companyRef: req.companyId };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.taskType) filter.taskType = req.query.taskType;
  if (req.query.clientRef) filter.clientRef = req.query.clientRef;
  if (req.query.sowRef) filter.sowRef = req.query.sowRef;
  if (req.query.patientRef) filter.patientRef = req.query.patientRef;

  const claims = await ClaimTask.find(filter)
    .populate('patientRef', 'patientName')
    .populate('sowRef', 'sowName')
    .populate('clientRef', 'clientInfo.clientName')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: claims });
});

// 3. Get one claim
export const getClaimTaskById = asyncHandler(async (req, res) => {
  const claim = await ClaimTask.findOne({
    _id: req.params.id,
    companyRef: req.companyId
  }).populate([
    { path: 'patientRef', select: 'patientName insuranceDetails' },
    { path: 'sowRef', select: 'sowName' },
    { path: 'clientRef', select: 'clientInfo' },
    { path: 'auditInfo.createdBy', select: 'personalInfo' }
  ]);

  if (!claim) throw new ApiError(404, "Claim not found");
  res.status(200).json({ success: true, data: claim });
});

// 4. Update claim
export const updateClaimTask = asyncHandler(async (req, res) => {
  const claim = await ClaimTask.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!claim) throw new ApiError(404, "Claim not found");

  Object.assign(claim, req.body);
  claim.auditInfo.lastModifiedBy = req.employeeId;

  await claim.save();
  res.status(200).json({ success: true, data: claim });
});

// 5. Soft delete claim
export const deactivateClaimTask = asyncHandler(async (req, res) => {
  const claim = await ClaimTask.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!claim) throw new ApiError(404, "Claim not found");

  claim.systemInfo.isActive = false;
  claim.auditInfo.lastModifiedBy = req.employeeId;

  await claim.save();
  res.status(200).json({ success: true, message: 'Claim deactivated' });
});

// 6. Bulk upload claims via Excel
export const bulkUploadClaims = asyncHandler(async (req, res) => {
  const { clientRef, sowRef, mapping } = req.body;

  if (!req.tempFilePath) throw new ApiError(400, "Excel file is required");
  if (!mapping || typeof mapping !== 'object') throw new ApiError(400, "Field mapping missing");

  const companyId = req.companyId;

  const sow = await SOW.findOne({ _id: sowRef, clientRef, companyRef: companyId });
  if (!sow) throw new ApiError(404, "SOW not found");

  const workbook = xlsx.readFile(req.tempFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const claimList = [];

  for (const row of rows) {
    const claimData = {};
    for (const [field, column] of Object.entries(mapping)) {
      claimData[field] = row[column] || null;
    }

    const patient = await Patient.findOne({
      patientID: claimData.patientID,
      clientRef,
      sowRef,
      companyRef: companyId
    });

    if (!patient) continue;

    claimList.push({
      ...claimData,
      companyRef: companyId,
      sowRef,
      clientRef,
      patientRef: patient._id,
      intakeSource: 'Excel Upload',
      auditInfo: {
        createdBy: req.employeeId,
        lastModifiedBy: req.employeeId
      }
    });
  }

  const inserted = await ClaimTask.insertMany(claimList, { ordered: false });
  res.status(201).json({ success: true, message: `${inserted.length} claims uploaded`, data: inserted });
});
