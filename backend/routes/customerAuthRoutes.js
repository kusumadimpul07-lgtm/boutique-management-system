const express = require('express');
const router = express.Router();
const { customerLogin, getCustomerProfile, updateCustomerProfile } = require('../controllers/customerAuthController');
const { protectCustomer } = require('../middleware/authMiddleware');

router.post('/login', customerLogin);
router.get('/profile', protectCustomer, getCustomerProfile);
router.put('/profile', protectCustomer, updateCustomerProfile);

module.exports = router;
