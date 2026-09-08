const express = require('express');
const router = express.Router();
const { createDelivery, getDeliveries, getDeliveryByOrder } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createDelivery).get(protect, getDeliveries);
router.get('/order/:orderId', protect, getDeliveryByOrder);

module.exports = router;
