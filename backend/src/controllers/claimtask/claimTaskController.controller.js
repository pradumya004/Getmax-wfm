// backend/src/controllers/claimtasks.controller.js

import { asyncHandler } from '../../utils/asyncHandler.js';
import xlsx from 'xlsx';
import { ClaimTasks } from '../../models/claimtasks-model.js';
import { SOW } from '../../models/sow.model.js';
import { Patient } from '../../models/patient-model.js';
import { Client } from '../../models/client-model.js';
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

  const claims = await ClaimTasks.find(filter)
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


// A helper function to set a value on a nested property of an object
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

// Bulk upload claims via Excel
export const bulkUploadClaims = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Excel file is required");
  if (!req.body.mapping) throw new ApiError(400, "Field mapping configuration is missing.");

  const parsedMapping = JSON.parse(req.body.mapping);
  const { clientRef, sowRef } = req.body;
  const companyId = req.company._id;
  const employeeId = req.employee._id;

  const sow = await SOW.findOne({ _id: sowRef, clientRef, companyRef: companyId }).select('_id');
  if (!sow) throw new ApiError(404, "SOW not found or not associated with the provided client.");

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    throw new ApiError(400, "The uploaded file is empty.");
  }

  const patientIdColumnName = parsedMapping['patientRef'];
  if (!patientIdColumnName) {
    throw new ApiError(400, "Mapping for 'Patient ID/MRN' is required.");
  }
  
  const externalPatientIds = rows.map(row => String(row[patientIdColumnName])).filter(id => id);

  const patients = await Patient.find({
    'patientId': { $in: externalPatientIds },
    clientRef,
    companyRef: companyId
  }).select('_id patientId');

  const patientMap = new Map(patients.map(p => [p.patientId, p._id]));

  console.log("Found patients:", patientMap);
  console.log("Found sow:", sow);


  const claimsToCreate = [];
  const errors = [];

  const cptRegex = /^\d{5}$|^[A-Z]\d{4}$/;
  const icdRegex = /^[A-Z]\d{2}(\.\d{1,3})?$/;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    let hasRowError = false;

    const externalPatientId = String(row[patientIdColumnName]).toUpperCase();
    const patientId = patientMap.get(externalPatientId);
    
    if (!patientId) {
      errors.push({ row: i + 2, message: `Patient with ID '${externalPatientId}' not found.` });
      continue;
    }

    const claimData = {};
    // Step 1: Process all fields from the mapping as they are
    for (const [modelField, excelColumn] of Object.entries(parsedMapping)) {
      const value = row[excelColumn];
      if (value !== undefined && value !== null && value !== '') {
        // Use the generic helper for everything initially
        setNestedValue(claimData, modelField, value);
      }
    }

    // --- ⬇️ Step 2: Rebuild the code arrays into the correct format ⬇️ ---

    // Handle Procedure Codes
    if (claimData.claimInfo?.procedureCodes?.cptCode) {
      const cptString = String(claimData.claimInfo.procedureCodes.cptCode);
      const codes = cptString.split(',').map(c => c.trim());
      const grossCharges = parseFloat(String(claimData.financialInfo?.grossCharges || '0').replace(/[^0-9.-]+/g, ""));
      const chargePerCode = codes.length > 0 && !isNaN(grossCharges) ? (grossCharges / codes.length).toFixed(2) : 0;
      
      // Overwrite the temporary object with the correct array of objects
      claimData.claimInfo.procedureCodes = codes.map(code => ({ 
        cptCode: code, 
        chargeAmount: chargePerCode 
      }));
    }

    // Handle Diagnosis Codes
    if (claimData.claimInfo?.diagnosisCodes?.icdCode) {
      const icdString = String(claimData.claimInfo.diagnosisCodes.icdCode);
      const codes = icdString.split(',').map(c => c.trim().toUpperCase());
      
      // Overwrite the temporary object with the correct array of objects
      claimData.claimInfo.diagnosisCodes = codes.map(code => ({ 
        icdCode: code 
      }));
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

  if (claimsToCreate.length === 0 && errors.length > 0) {
    throw new ApiError(400, "No valid claims could be processed. Please check the errors.", errors);
  }

  console.log("Claims to create:", claimsToCreate);
  
  try {
    const result = await ClaimTasks.insertMany(claimsToCreate, { ordered: false });
    res.status(201).json(new ApiResponse(
      201, 
      { insertedCount: result.length, totalRows: rows.length, errors }, 
      `${result.length} of ${rows.length} claims uploaded successfully.`
    ));
  } catch (dbError) {
    // **FIX 2**: Provide detailed feedback on validation errors
    const validationErrors = dbError.writeErrors?.map(err => ({
        row: err.index + 2,
        message: err.err.message
    })) || [{ message: "A database error occurred. Please check data types in your file." }];
    
    throw new ApiError(400, "Data validation failed during database insertion.", validationErrors.concat(errors));
  }
});