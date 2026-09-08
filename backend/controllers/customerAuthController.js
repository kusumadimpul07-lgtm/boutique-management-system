const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const generateCustomerToken = (id) => {
  return jwt.sign({ id, type: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Customer Portal login (phone number + password)
// @route   POST /api/customer-auth/login
const customerLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: 'Please provide phone number and password' });
    }

    const customer = await Customer.findOne({ phone });

    if (!customer) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    if (!customer.password) {
      return res.status(403).json({
        message: 'Online access has not been set up for this account yet. Please contact the shop.',
      });
    }

    const isMatch = await customer.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    res.json({
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      token: generateCustomerToken(customer._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the logged-in customer's own profile
// @route   GET /api/customer-auth/profile
const getCustomerProfile = async (req, res) => {
  res.json(req.customer);
};

// @desc    Update the logged-in customer's own profile (name, email, password)
// @route   PUT /api/customer-auth/profile
const updateCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = req.body.name || customer.name;
    customer.email = req.body.email ?? customer.email;

    if (req.body.password) {
      customer.password = req.body.password;
    }

    const updated = await customer.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { customerLogin, getCustomerProfile, updateCustomerProfile };
