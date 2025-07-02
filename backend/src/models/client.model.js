// backend/src/models/client.model.js

const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  serviceType: String,
  dailyTarget: Number,
  oaPercentage: Number,
  numberOfEmployees: Number,
  sowRoleLabel: String,
});

const NoteTemplateSchema = new mongoose.Schema({
  categoryName: String,
  noteInputType: String,
  placeholderLabel: String,
});

const IntakeFieldSchema = new mongoose.Schema({
  fieldLabel: String,
  fieldType: {
    type: String,
    enum: ["Dropdown", "Paragraph", "Short Text", "Checkbox"],
  },
  options: [String],
});

const RampPlanSchema = new mongoose.Schema({
  dailyClaimVolume: Number,
  monthlyVolume: Number,
  annualVolume: Number,
  idealTeamSize: Number,
  backupRatio: Number, 
});

const ClientContractSchema = new mongoose.Schema({
  clientName: { 
    type: String, 
    required: true 
},
  clientType: { 
    type: String,
    required: true
 },
  clientSubType: String,
  contractType: { type: String, required: true },
  ehrTemplate: String, 
  startDate: { type: Date, required: true },
  endDate: Date,
  internalNotes: String,

  // Services & Benchmarks
  services: [ServiceSchema],

  // Notes Template
  noteTemplates: [NoteTemplateSchema],

  // Intake Fields
  intakeFields: [IntakeFieldSchema],

  // Ramp Plan
  rampPlan: RampPlanSchema,

  // System
  status: {
    type: String,
    enum: ["draft", "active", "completed"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClientContract", ClientContractSchema);
