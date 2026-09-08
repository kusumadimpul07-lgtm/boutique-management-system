const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Out for Delivery', 'Delivered'],
      default: 'Pending',
    },
    deliveryAddress: { type: String },
    scheduledDate: { type: Date },
    deliveredDate: { type: Date },
    deliveredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
