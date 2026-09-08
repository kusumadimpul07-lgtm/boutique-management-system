const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Customers are normally just records managed by the owner/staff.
// If the owner/staff sets a password for a customer, that customer can
// then log in to the separate Customer Portal to track orders and pay online.
const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    address: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    notes: { type: String },
    password: { type: String }, // only set if portal access is enabled for this customer
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Never send the password hash to the browser.
        // Instead expose a simple true/false flag the UI can check.
        ret.hasPortalAccess = Boolean(ret.password);
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash the password automatically whenever it is set/changed
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method used during customer portal login
customerSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
