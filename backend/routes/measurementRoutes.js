const express = require('express');
const router = express.Router();
const {
  createMeasurement, getMeasurementsByCustomer, updateMeasurement, deleteMeasurement,
} = require('../controllers/measurementController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMeasurement);
router.get('/customer/:customerId', protect, getMeasurementsByCustomer);
router.put('/:id', protect, updateMeasurement);
router.delete('/:id', protect, deleteMeasurement);

module.exports = router;
