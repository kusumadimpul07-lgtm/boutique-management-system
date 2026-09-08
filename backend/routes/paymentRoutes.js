const express = require("express");
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentsByOrder,
} = require("../controllers/paymentController");
const { protect, operationsOnly } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, operationsOnly, createPayment)
  .get(protect, operationsOnly, getPayments);
router.get("/order/:orderId", protect, operationsOnly, getPaymentsByOrder);

module.exports = router;
