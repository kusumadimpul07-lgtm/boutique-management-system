const express = require("express");
const router = express.Router();
const {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");
const { protect, ownerOnly } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router
  .route("/")
  .post(protect, ownerOnly, createStaff)
  .get(protect, ownerOnly, getStaff);
router
  .route("/:id")
  .put(protect, ownerOnly, upload.single("profilePicture"), updateStaff)
  .delete(protect, ownerOnly, deleteStaff);

module.exports = router;
