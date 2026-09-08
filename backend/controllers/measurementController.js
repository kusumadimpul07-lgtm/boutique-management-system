const Measurement = require('../models/Measurement');

// @desc    Add a measurement record for a customer
// @route   POST /api/measurements
const createMeasurement = async (req, res) => {
  try {
    const data = { ...req.body, takenBy: req.user._id };
    const measurement = await Measurement.create(data);
    res.status(201).json(measurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all measurement records for one customer
// @route   GET /api/measurements/customer/:customerId
const getMeasurementsByCustomer = async (req, res) => {
  try {
    const measurements = await Measurement.find({ customer: req.params.customerId }).sort({ createdAt: -1 });
    res.json(measurements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a measurement record
// @route   PUT /api/measurements/:id
const updateMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    res.json(measurement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a measurement record
// @route   DELETE /api/measurements/:id
const deleteMeasurement = async (req, res) => {
  try {
    const measurement = await Measurement.findById(req.params.id);
    if (!measurement) {
      return res.status(404).json({ message: 'Measurement not found' });
    }
    await measurement.deleteOne();
    res.json({ message: 'Measurement removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMeasurement, getMeasurementsByCustomer, updateMeasurement, deleteMeasurement };
