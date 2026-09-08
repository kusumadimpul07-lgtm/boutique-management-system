const mongoose = require("mongoose");

const designImageSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    imageUrl: { type: String, required: true },
    caption: { type: String },
    price: { type: Number, default: 0, min: 0 },
    designer: { type: String, trim: true },
    designerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category: { type: String, trim: true },
    isCatalog: { type: Boolean, default: false },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("DesignImage", designImageSchema);
