// backend/src/controllers/patient.controller.js

import { asyncHandler } from '../../utils/asyncHandler.js';
import { Patient } from '../../models/patient-model.js';
import { SOW } from '../../models/sow.model.js';
import { Client } from '../../models/client-model.js';
import { ApiError } from '../../utils/ApiError.js';
import xlsx from 'xlsx';

// 1. Create Single Patient
export const createPatient = asyncHandler(async (req, res) => {
  console.log("Creating patient with data:", req.body);

  const { clientRef, sowRef } = req.body;

  const companyId = req.company._id;

  // Validate client and SOW
  const client = await Client.findOne({ _id: clientRef, companyRef: companyId });
  console.log("Client:", client);

  if (!client) throw new ApiError(404, "Client not found or not authorized");

  const sow = await SOW.findOne({ _id: sowRef, clientRef: client._id });
  console.log("SOW:", sow);
  if (!sow) {
    const clientSOWs = await SOW.find({ clientRef: client._id });
    console.error("Available SOWs for this client:", clientSOWs.map(s => s._id.toString()));
    throw new ApiError(404, "SOW not found or unauthorized");
  }

  const patient = await Patient.create({
    ...req.body,
    companyRef: companyId,
    auditInfo: {
      createdBy: req.employeeId,
      lastModifiedBy: req.employeeId
    }
  });

  res.status(201).json({ success: true, data: patient });
});

// 2. Get All Patients
export const getAllPatients = asyncHandler(async (req, res) => {
  const filter = { companyRef: req.companyId };

  if (req.query.clientRef) filter.clientRef = req.query.clientRef;
  if (req.query.sowRef) filter.sowRef = req.query.sowRef;
  if (req.query.search) {
    const search = req.query.search;
    filter.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { patientID: { $regex: search, $options: 'i' } }
    ];
  }

  const patients = await Patient.find(filter)
    .populate('clientRef', 'clientInfo.clientName')
    .populate('sowRef', 'sowName')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: patients });
});

// 3. Get Patient by ID
export const getPatientById = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({
    _id: req.params.id,
    companyRef: req.companyId
  }).populate([
    { path: 'clientRef', select: 'clientInfo' },
    { path: 'sowRef', select: 'sowName' }
  ]);

  if (!patient) throw new ApiError(404, "Patient not found");
  res.status(200).json({ success: true, data: patient });
});

// 4. Update Patient
export const updatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!patient) throw new ApiError(404, "Patient not found");

  Object.assign(patient, req.body);
  patient.auditInfo.lastModifiedBy = req.employeeId;
  await patient.save();

  res.status(200).json({ success: true, data: patient });
});

// 5. Soft Delete Patient
export const deactivatePatient = asyncHandler(async (req, res) => {
  const patient = await Patient.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!patient) throw new ApiError(404, "Patient not found");

  patient.systemInfo.isActive = false;
  patient.auditInfo.lastModifiedBy = req.employeeId;
  await patient.save();

  res.status(200).json({ success: true, message: 'Patient deactivated' });
});

// 6. Bulk Upload Patients via Excel
export const bulkUploadPatients = asyncHandler(async (req, res) => {
  const { sowRef, clientRef, mapping } = req.body;

  if (!req.tempFilePath) throw new ApiError(400, "Excel file is required");
  if (!mapping || typeof mapping !== 'object') throw new ApiError(400, "Field mapping missing");

  const companyId = req.companyId;

  // Validate SOW and Client
  const client = await Client.findOne({ _id: clientRef, companyRef: companyId });
  if (!client) throw new ApiError(404, "Client not found");

  const sow = await SOW.findOne({ _id: sowRef, clientRef, companyRef: companyId });
  if (!sow) throw new ApiError(404, "SOW not found");

  const workbook = xlsx.readFile(req.tempFilePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);

  const patientsToCreate = rows.map((row, index) => {
    const patientData = {};
    for (const [field, excelColumn] of Object.entries(mapping)) {
      patientData[field] = row[excelColumn] || null;
    }

    return {
      ...patientData,
      sowRef,
      clientRef,
      companyRef: companyId,
      intakeSource: 'Excel Upload',
      auditInfo: {
        createdBy: req.employeeId,
        lastModifiedBy: req.employeeId
      }
    };
  });

  const inserted = await Patient.insertMany(patientsToCreate, { ordered: false });

  res.status(201).json({
    success: true,
    message: `${inserted.length} patients uploaded successfully`,
    data: inserted
  });
});
