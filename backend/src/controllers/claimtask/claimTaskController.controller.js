// backend/src/controllers/claimtask/claimTaskController.controller.js

import { asyncHandler } from '../../utils/asyncHandler.js';
import xlsx from 'xlsx';
import { ClaimTasks } from '../../models/workflow/claimtasks.model.js';
import { SOW } from '../../models/core/sow.model.js';
import { Patient } from '../../models/data/patient.model.js';
import { Client } from '../../models/core/client.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

// 1. Create a single claim task
export const createClaimTask = asyncHandler(async (req, res) => {
  const { sowRef, clientRef, patientRef, primaryPayerRef } = req.body;
  const companyId = req.company._id;
  const employeeId = req.employee._id;

  // Validate ownership chain: SOW -> Client -> Company
  const sow = await SOW.findOne({ _id: sowRef, clientRef, companyRef: companyId });
  if (!sow) throw new ApiError(404, "SOW not found or does not belong to the specified client.");

  // Validate patient belongs to the same client
  const patient = await Patient.findOne({ _id: patientRef, clientRef, companyRef: companyId });
  if (!patient) throw new ApiError(404, "Patient not found or does not belong to the specified client.");

  const claim = await ClaimTasks.create({
    ...req.body,
    companyRef: companyId,
    auditInfo: {
      createdBy: employeeId,
      lastModifiedBy: employeeId
    }
  });

  res.status(201).json(new ApiResponse(201, claim, "Claim task created successfully."));
});

// 2. Get all claims (with filters)
export const getAllClaimTasks = asyncHandler(async (req, res) => {
  const filter = { 'systemInfo.isActive': true, companyRef: req.company._id };

  if (req.query.status) filter['workflowStatus.currentStatus'] = req.query.status;
  if (req.query.clientRef) filter.clientRef = req.query.clientRef;
  if (req.query.sowRef) filter.sowRef = req.query.sowRef;
  if (req.query.assignedTo) filter.assignedEmployeeRef = req.query.assignedTo;

  const claims = await ClaimTask.find(filter)
    .populate('patientRef', 'personalInfo.firstName personalInfo.lastName') // Corrected path
    .populate('sowRef', 'sowName')
    .populate('clientRef', 'clientInfo.clientName')
    .sort({ 'priorityInfo.priorityScore': -1, createdAt: -1 })
    .limit(1000) // Safety limit
    .lean();

  res.status(200).json(new ApiResponse(200, claims));
});

// 3. Get one claim
export const getClaimTaskById = asyncHandler(async (req, res) => {
  const claim = await ClaimTasks.findOne({
    _id: req.params.id,
    companyRef: req.company._id
  }).populate([
    { path: 'patientRef', select: 'personalInfo contactInfo insuranceInfo' }, // Corrected path
    { path: 'sowRef', select: 'sowName serviceDetails' },
    { path: 'clientRef', select: 'clientInfo' },
    { path: 'primaryPayerRef', select: 'payerInfo.payerName' },
    { path: 'auditInfo.createdBy', select: 'personalInfo.firstName' }
  ]);

  if (!claim) throw new ApiError(404, "Claim not found");
  res.status(200).json(new ApiResponse(200, claim));
});

// 4. Update claim
export const updateClaimTask = asyncHandler(async (req, res) => {
  const { auditInfo, companyRef, ...updateData } = req.body;

  const claim = await ClaimTasks.findOne({ _id: req.params.id, companyRef: req.company._id });
  if (!claim) throw new ApiError(404, "Claim not found");

  Object.assign(claim, updateData);
  claim.auditInfo.lastModifiedBy = req.employee._id;

  const updatedClaim = await claim.save();
  res.status(200).json(new ApiResponse(200, updatedClaim, "Claim updated successfully."));
});

// 5. Soft delete claim
export const deactivateClaimTask = asyncHandler(async (req, res) => {
  const claim = await ClaimTasks.findOne({ _id: req.params.id, companyRef: req.company._id });
  if (!claim) throw new ApiError(404, "Claim not found");

  claim.systemInfo.isActive = false;
  claim.auditInfo.lastModifiedBy = req.employee._id;
  await claim.save();

  res.status(200).json(new ApiResponse(200, { _id: claim._id }, 'Claim deactivated successfully.'));
});

// 6. Bulk upload claims via Excel
export const bulkUploadClaims = asyncHandler(async (req, res) => {
  const { clientRef, sowRef, mapping } = req.body;
  const companyId = req.company._id;
  const employeeId = req.employee._id;


  if (!req.file) throw new ApiError(400, "Excel file is required");
  if (!mapping || typeof mapping !== 'object') throw new ApiError(400, "Field mapping configuration is missing");

  // Validate ownership
  const sow = await SOW.findOne({ _id: sowRef, clientRef, companyRef: companyId }).select('_id');
  if (!sow) throw new ApiError(404, "SOW not found or not associated with the provided client.");

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  // Find all relevant patients in one go to reduce DB calls
  const externalPatientIds = rows.map(row => row[mapping['personalInfo.externalPatientId']]).filter(id => id);
  const patients = await Patient.find({
    'personalInfo.externalPatientId': { $in: externalPatientIds },
    clientRef,
    companyRef: companyId
  }).select('_id personalInfo.externalPatientId');

  const patientMap = new Map(patients.map(p => [p.personalInfo.externalPatientId, p._id]));

  const claimsToCreate = [];
  for (const row of rows) {
    const patientId = patientMap.get(row[mapping['personalInfo.externalPatientId']]);
    if (!patientId) continue; // Skip if patient not found

    const claimData = {};
    for (const [modelField, excelColumn] of Object.entries(mapping)) {
      // Basic transformation, can be expanded
      let value = row[excelColumn] || null;
      if (modelField.includes('date') && value) {
        // Handle Excel's numeric date format
        value = xlsx.SSF.parse_date_code(value);
      }
      // Use lodash.set or a similar utility for deep field setting
      // For now, a simple assignment for flat fields
      claimData[modelField] = value;
    }

    claimsToCreate.push({
      ...claimData,
      companyRef: companyId,
      sowRef,
      clientRef,
      patientRef: patientId,
      sourceInfo: { dataSource: 'Manual Upload' },
      auditInfo: { createdBy: employeeId }
    });
  }

  if (claimsToCreate.length === 0) {
    throw new ApiError(400, "No valid claims could be processed from the file.");
  }

  const inserted = await ClaimTask.insertMany(claimsToCreate, { ordered: false });
  res.status(201).json(new ApiResponse(201, { insertedCount: inserted.length }, `${inserted.length} of ${rows.length} claims uploaded successfully.`));
});
