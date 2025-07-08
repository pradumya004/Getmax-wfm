// backend/src/controllers/sow.controller.js

import asyncHandler from 'express-async-handler';
import { SOW } from '../models/sow-model.js';
import { Client } from '../models/client-model.js';
import { Employee } from '../models/employee.model.js';
import { ApiError } from '../utils/ApiError.js';

// 1. Create SOW
export const createSOW = asyncHandler(async (req, res) => {
  const data = req.body;
  const companyId = req.companyId;
  const employeeId = req.employeeId;

  // Validate client ownership
  const client = await Client.findOne({ _id: data.clientRef, companyRef: companyId });
  if (!client) throw new ApiError(404, 'Client not found or unauthorized');

  const sow = await SOW.create({
    ...data,
    companyRef: companyId,
    auditInfo: {
      createdBy: employeeId,
      lastModifiedBy: employeeId
    }
  });

  // Optionally push into client's activeSOWs[]
  client.serviceAgreements.activeSOWs.push(sow._id);
  await client.save();

  res.status(201).json({ success: true, data: sow });
});

// 2. Get All SOWs
export const getAllSOWs = asyncHandler(async (req, res) => {
  const filter = { companyRef: req.companyId };

  if (req.query.status) filter.status = req.query.status;
  if (req.query.clientId) filter.clientRef = req.query.clientId;

  const sows = await SOW.find(filter)
    .populate('clientRef', 'clientInfo.clientName')
    .populate('assignedEmployees', 'personalInfo.firstName personalInfo.lastName designationRef')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: sows });
});

// 3. Get SOW by ID
export const getSOWById = asyncHandler(async (req, res) => {
  const sow = await SOW.findOne({
    _id: req.params.id,
    companyRef: req.companyId
  }).populate([
    { path: 'clientRef', select: 'clientInfo contactInfo' },
    { path: 'assignedEmployees', select: 'personalInfo designationRef' },
    { path: 'auditInfo.createdBy', select: 'personalInfo' },
    { path: 'auditInfo.lastModifiedBy', select: 'personalInfo' }
  ]);

  if (!sow) throw new ApiError(404, 'SOW not found');
  res.status(200).json({ success: true, data: sow });
});

// 4. Update SOW
export const updateSOW = asyncHandler(async (req, res) => {
  const sow = await SOW.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!sow) throw new ApiError(404, 'SOW not found');

  Object.assign(sow, req.body);
  sow.auditInfo.lastModifiedBy = req.employeeId;

  await sow.save();
  res.status(200).json({ success: true, data: sow });
});

// 5. Assign Employees to SOW
export const assignEmployeesToSOW = asyncHandler(async (req, res) => {
  const { employeeIds } = req.body;

  const sow = await SOW.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!sow) throw new ApiError(404, 'SOW not found');

  // Validate employees
  const validEmployees = await Employee.find({
    _id: { $in: employeeIds },
    companyRef: req.companyId
  }).select('_id');

  sow.assignedEmployees = validEmployees.map(emp => emp._id);
  sow.auditInfo.lastModifiedBy = req.employeeId;

  await sow.save();
  res.status(200).json({ success: true, message: 'Employees assigned', data: sow.assignedEmployees });
});

// 6. Change SOW Status (Lifecycle)
export const changeSOWStatus = asyncHandler(async (req, res) => {
  const { newStatus } = req.body;
  const allowed = ['Draft', 'Active', 'Paused', 'Completed', 'Terminated'];
  if (!allowed.includes(newStatus)) throw new ApiError(400, 'Invalid SOW status');

  const sow = await SOW.findOne({ _id: req.params.id, companyRef: req.companyId });
  if (!sow) throw new ApiError(404, 'SOW not found');

  sow.status = newStatus;
  sow.auditInfo.lastModifiedBy = req.employeeId;
  await sow.save();

  res.status(200).json({ success: true, message: `SOW marked as ${newStatus}` });
});

// 7. Get SOWs for a specific client
export const getClientSOWs = asyncHandler(async (req, res) => {
  const clientId = req.params.clientId;

  const sows = await SOW.find({
    clientRef: clientId,
    companyRef: req.companyId
  }).select('sowName status contractPeriod assignedEmployees specialties');

  res.status(200).json({ success: true, data: sows });
});
