const mongoose = require('mongoose');

// A customer can have several measurement records over time
// (for example, one set of measurements per garment style).
const measurementSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    title: { type: String, default: 'General Measurement' },
    chest: { type: Number },
    waist: { type: Number },
    hip: { type: Number },
    shoulder: { type: Number },
    sleeveLength: { type: Number },
    armhole: { type: Number },
    neck: { type: Number },
    topLength: { type: Number },
    bottomLength: { type: Number },
    inseam: { type: Number },
    unit: { type: String, enum: ['inches', 'cm'], default: 'inches' },
    notes: { type: String },
    takenBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Measurement', measurementSchema);
