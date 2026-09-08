const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, operationsOnly } = require("../middleware/authMiddleware");

router.get("/", protect, operationsOnly, getDashboardStats);

module.exports = router;
