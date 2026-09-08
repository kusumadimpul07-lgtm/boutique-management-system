const mongoose = require("mongoose");

// Payments are either recorded manually by staff (cash/card/UPI/etc. handed
// over in person) or created automatically when a customer pays online
// through the Customer Portal (Razorpay). The "source" field tells them apart.
const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: { type: Number, required: true },
    receiptNumber: {
      type: String,
      unique: true,
      default: () => `BQT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    },
    method: {
      type: String,
      enum: [
        "Cash",
        "Card",
        "UPI",
        "Bank Transfer",
        "Online (Razorpay)",
        "Other",
      ],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Partial"],
      default: "Paid",
    },
    source: {
      type: String,
      enum: ["Staff Recorded", "Online Payment"],
      default: "Staff Recorded",
    },
    paymentDate: { type: Date, default: Date.now },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // empty for online payments
    razorpayPaymentId: { type: String },
    notes: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", paymentSchema);
