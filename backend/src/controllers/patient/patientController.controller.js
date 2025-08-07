// backend/src/controllers/patient.controller.js

import { asyncHandler } from '../../utils/asyncHandler.js';
import { Patient } from '../../models/data/patient.model.js';
import { SOW } from '../../models/core/sow.model.js';
import { Client } from '../../models/core/client.model.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import xlsx from 'xlsx';

// 1. Create Single Patient
export const createPatient = asyncHandler(async (req, res) => {
  const { clientRef, personalInfo } = req.body;
  const companyId = req.company._id;
  const employeeId = req.employee._id;

  if (!clientRef || !personalInfo?.firstName || !personalInfo?.lastName) {
    throw new ApiError(400, "Client reference, first name, and last name are required.");
  }

  // Validate client ownership
  const client = await Client.findOne({ _id: clientRef, companyRef: companyId });
  if (!client) throw new ApiError(404, "Client not found or you do not have permission to access it.");

  // Check for potential duplicates before creating
  const duplicate = await Patient.findOne({
    companyRef: companyId,
    'personalInfo.firstName': personalInfo.firstName,
    'personalInfo.lastName': personalInfo.lastName,
    'personalInfo.dateOfBirth': personalInfo.dateOfBirth,
  });
  if (duplicate) {
    throw new ApiError(409, "A patient with the same name and date of birth already exists.");
  }

  const patient = await Patient.create({
    ...req.body,
    companyRef: companyId,
    auditInfo: {
      createdBy: employeeId,
      lastModifiedBy: employeeId
    }
  });

  res.status(201).json(new ApiResponse(201, patient, "Patient created successfully."));
});

// 2. Get All Patients
export const getAllPatients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, clientRef, search } = req.query;
  const filter = { 'systemInfo.isActive': true, companyRef: req.company._id };

  if (clientRef) filter.clientRef = clientRef;

  if (search) {
    const searchRegex = { $regex: search, $options: 'i' };
    filter.$or = [
      { 'personalInfo.firstName': searchRegex },
      { 'personalInfo.lastName': searchRegex },
      { 'personalInfo.externalPatientId': searchRegex }, // Corrected field
      { 'insuranceInfo.primaryInsurance.memberId': searchRegex }
    ];
  }

  const patients = await Patient.find(filter)
    .populate('clientRef', 'clientInfo.clientName')
    .sort({ 'personalInfo.lastName': 1, 'personalInfo.firstName': 1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .lean();

  const totalPatients = await Patient.countDocuments(filter);

  res.status(200).json(new ApiResponse(200, {
    data: patients,
    pagination: {
      total: totalPatients,
      totalPages: Math.ceil(totalPatients / limit),
      currentPage: parseInt(page),
    }
  }));
});

// 3. Get Patient by ID
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    companyRef: req.companyId
  }).populate('clientRef', 'clientInfo.clientName');

  if (!patient) throw new ApiError(404, "Patient not found");
  res.status(200).json(new ApiResponse(200, patient, "Patient retrieved successfully."));
});

// 4. Update Patient
export const updatePatient = asyncHandler(async (req, res) => {
  const { companyRef, auditInfo, ...updateData } = req.body;
  const patient = await Patient.findOne({ _id: req.params.id, companyRef: req.company._id });
  if (!patient) throw new ApiError(404, "Patient not found");

  Object.assign(patient, updateData);
  patient.auditInfo.lastModifiedBy = req.employee._id;
  const updatedPatient = await patient.save();

  res.status(200).json(new ApiResponse(200, updatedPatient, "Patient updated successfully."));
});

// 5. Soft Delete Patient
export const deactivatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id, companyRef: req.company._id });
  if (!patient) throw new ApiError(404, "Patient not found");

  patient.systemInfo.isActive = false;
  patient.auditInfo.lastModifiedBy = req.employee._id;
  await patient.save();

  res.status(200).json(new ApiResponse(200, { _id: patient._id }, 'Patient deactivated.'));
});

// 6. Bulk Upload Patients via Excel
export const bulkUploadPatients = asyncHandler(async (req, res) => {
  const { clientRef, mapping } = req.body;
  const companyId = req.company._id;
  const employeeId = req.employee._id;

  if (!req.file) throw new ApiError(400, "Excel file is required");
  if (!clientRef || !mapping) throw new ApiError(400, "Client reference and mapping are required.");

  // Validate Client
  const client = await Client.findOne({ _id: clientRef, companyRef: companyId }).select('_id');
  if (!client) throw new ApiError(404, "Client not found.");

  const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const patientsToCreate = rows.map(row => {
    const patientData = {};
    for (const [modelField, excelColumn] of Object.entries(mapping)) {
      // This needs a robust deep-setter utility like lodash.set for nested paths
      // e.g. modelField = 'personalInfo.firstName'
      const keys = modelField.split('.');
      let current = patientData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = row[excelColumn] || null;
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });
    }
    return {
      ...patientData,
      clientRef,
      companyRef: companyId,
      sourceInfo: { dataSource: 'Manual Upload' },
      auditInfo: { createdBy: employeeId }
    };
  });

  // Using insertMany is highly efficient for bulk operations
  const inserted = await Patient.insertMany(patientsToCreate, { ordered: false });

  res.status(201).json(new ApiResponse(201, { insertedCount: inserted.length }, `${inserted.length} of ${rows.length} patients uploaded successfully.`));
});
