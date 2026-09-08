const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getUserNotifications,
  markUserNotificationRead,
} = require("../controllers/notificationController");

router.get("/", protect, getUserNotifications);
router.patch("/:id/read", protect, markUserNotificationRead);

module.exports = router;
