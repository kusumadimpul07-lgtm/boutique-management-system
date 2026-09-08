const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// This model is used for both the Owner and Staff accounts.
// The "role" field decides what a user is allowed to do.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["owner", "staff", "designer"],
      default: "staff",
    },
    phone: { type: String },
    profilePicture: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash the password automatically before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Helper method to check a login password against the hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
