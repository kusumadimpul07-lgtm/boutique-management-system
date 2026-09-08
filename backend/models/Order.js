const mongoose = require("mongoose");

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    note: { type: String },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedByRole: {
      type: String,
      enum: ["owner", "staff", "designer", "customer", "system"],
    },
  },
  { timestamps: true, _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: { type: String, required: true }, // simple text e.g. "2 Blouses, 1 Saree Fall"
    design: { type: mongoose.Schema.Types.ObjectId, ref: "DesignImage" },
    assignedDesigner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    quantity: { type: Number, default: 1, min: 1 },
    totalAmount: { type: Number, required: true, default: 0 },
    advanceAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "Pending",
        "In Progress",
        "Ready",
        "Completed",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    orderDate: { type: Date, default: Date.now },
    deliveryDate: { type: Date },
    measurement: { type: mongoose.Schema.Types.ObjectId, ref: "Measurement" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    statusHistory: { type: [statusHistorySchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
