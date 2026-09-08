const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["order_update", "new_assignment", "payment"],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    readAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
