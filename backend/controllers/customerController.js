const Customer = require('../models/Customer');

// @desc    Create a new customer
// @route   POST /api/customers
const createCustomer = async (req, res) => {
  try {
    const { name, phone, email, address, gender, notes, password } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    const customer = await Customer.create({
      name, phone, email, address, gender, notes,
      password: password || undefined, // set only if the owner/staff typed one in
      createdBy: req.user._id,
    });

    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A customer with this phone number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all customers (supports ?search=name-or-phone)
// @route   GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { phone: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

    const customers = await Customer.find(keyword).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single customer
// @route   GET /api/customers/:id
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a customer (also used by staff/owner to set or reset the
//          customer's Customer Portal password)
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = req.body.name || customer.name;
    customer.phone = req.body.phone || customer.phone;
    customer.email = req.body.email ?? customer.email;
    customer.address = req.body.address ?? customer.address;
    customer.gender = req.body.gender || customer.gender;
    customer.notes = req.body.notes ?? customer.notes;

    if (req.body.password) {
      customer.password = req.body.password;
    }

    const updated = await customer.save();
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A customer with this phone number already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    await customer.deleteOne();
    res.json({ message: 'Customer removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };
