const express = require("express");
const router = express.Router();
const { protectCustomer } = require("../middleware/authMiddleware");
const {
  getCustomerNotifications,
  markCustomerNotificationRead,
} = require("../controllers/notificationController");
const {
  chatWithCustomerAI,
  checkCustomerAIStatus,
} = require("../controllers/aiController");

const {
  getMyOrders,
  getMyOrderById,
  createMyOrderRequest,
  getCustomerPricing,
  getCustomerDesigners,
} = require("../controllers/orderController");
const { getMyDeliveryByOrder } = require("../controllers/deliveryController");
const {
  getMyImagesByOrder,
  getCustomerCatalog,
  uploadCustomerReferences,
} = require("../controllers/designController");
const upload = require("../middleware/uploadMiddleware");
const {
  getMyPaymentsByOrder,
  checkPaymentGatewayStatus,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controllers/paymentController");

// Orders (read-only, scoped to the logged-in customer)
router.get("/orders", protectCustomer, getMyOrders);
router.post("/orders", protectCustomer, createMyOrderRequest);
router.get("/orders/:id", protectCustomer, getMyOrderById);
router.get("/designs", protectCustomer, getCustomerCatalog);
router.get("/pricing", protectCustomer, getCustomerPricing);
router.get("/designers", protectCustomer, getCustomerDesigners);
router.get("/notifications", protectCustomer, getCustomerNotifications);
router.patch(
  "/notifications/:id/read",
  protectCustomer,
  markCustomerNotificationRead,
);
router.get("/ai/status", protectCustomer, checkCustomerAIStatus);
router.post("/ai/chat", protectCustomer, chatWithCustomerAI);
router.get("/orders/:orderId/delivery", protectCustomer, getMyDeliveryByOrder);
router.get("/orders/:orderId/designs", protectCustomer, getMyImagesByOrder);
router.post(
  "/orders/:orderId/references",
  protectCustomer,
  upload.array("images", 5),
  uploadCustomerReferences,
);
router.get("/orders/:orderId/payments", protectCustomer, getMyPaymentsByOrder);

// Online payment (Razorpay) - optional, see paymentController for graceful fallback
router.get("/payments/status", protectCustomer, checkPaymentGatewayStatus);
router.post("/payments/create-order", protectCustomer, createRazorpayOrder);
router.post("/payments/verify", protectCustomer, verifyRazorpayPayment);

module.exports = router;
