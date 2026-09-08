// Run this once to create the very first Owner login.
// Usage: npm run create-owner   (from inside the backend folder)
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const createOwner = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingOwner = await User.findOne({ role: 'owner' });

    if (existingOwner) {
      console.log('An owner account already exists:', existingOwner.email);
      process.exit();
    }

    const owner = await User.create({
      name: 'Boutique Owner',
      email: 'owner@boutiq.com',
      password: 'owner123',
      role: 'owner',
    });

    console.log('Owner account created successfully!');
    console.log('Email:', owner.email);
    console.log('Password: owner123');
    console.log('Please log in and change this password from the Settings page.');
    process.exit();
  } catch (error) {
    console.error('Error creating owner:', error.message);
    process.exit(1);
  }
};

createOwner();
