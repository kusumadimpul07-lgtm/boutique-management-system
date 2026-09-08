const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const {
  getDesignerOrders,
  getDesignerOrderById,
  updateDesignerOrder,
  getAssignableDesigners,
} = require("../controllers/orderController");
const {
  protect,
  designerOnly,
  operationsOnly,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, operationsOnly, createOrder)
  .get(protect, operationsOnly, getOrders);
router.get("/designer", protect, designerOnly, getDesignerOrders);
router.get(
  "/assignable-designers",
  protect,
  operationsOnly,
  getAssignableDesigners,
);
router
  .route("/designer/:id")
  .get(protect, designerOnly, getDesignerOrderById)
  .put(protect, designerOnly, updateDesignerOrder);
router.get(
  "/customer/:customerId",
  protect,
  operationsOnly,
  getOrdersByCustomer,
);
router
  .route("/:id")
  .get(protect, operationsOnly, getOrderById)
  .put(protect, operationsOnly, updateOrder)
  .delete(protect, operationsOnly, deleteOrder);

module.exports = router;
