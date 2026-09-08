const User = require("../models/User");

// @desc    Owner creates a new staff account
// @route   POST /api/staff
const createStaff = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const accountRole = role === "designer" ? "designer" : "staff";
    const staff = await User.create({
      name,
      email,
      password,
      phone,
      role: accountRole,
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      profilePicture: staff.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all staff accounts
// @route   GET /api/staff
const getStaff = async (req, res) => {
  try {
    const staff = await User.find({ role: { $in: ["staff", "designer"] } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a staff member (edit details, activate/deactivate, reset password)
// @route   PUT /api/staff/:id
const updateStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff || !["staff", "designer"].includes(staff.role)) {
      return res.status(404).json({ message: "Team member not found" });
    }

    staff.name = req.body.name || staff.name;
    staff.phone = req.body.phone || staff.phone;

    if (typeof req.body.isActive === "boolean") {
      staff.isActive = req.body.isActive;
    }

    if (req.body.password) {
      staff.password = req.body.password;
    }

    if (req.file) {
      staff.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updated = await staff.save();

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      profilePicture: updated.profilePicture,
      isActive: updated.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove a staff account
// @route   DELETE /api/staff/:id
const deleteStaff = async (req, res) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff || !["staff", "designer"].includes(staff.role)) {
      return res.status(404).json({ message: "Team member not found" });
    }

    await staff.deleteOne();
    res.json({ message: "Staff removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createStaff, getStaff, updateStaff, deleteStaff };
