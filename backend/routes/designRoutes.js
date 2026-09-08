const express = require("express");
const router = express.Router();
const {
  uploadDesignImage,
  getImagesByCustomer,
  getImagesByOrder,
  deleteDesignImage,
  getCatalogDesigns,
  createCatalogDesign,
} = require("../controllers/designController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", protect, upload.single("image"), uploadDesignImage);
router.get("/catalog", protect, getCatalogDesigns);
router.post("/catalog", protect, upload.single("image"), createCatalogDesign);
router.get("/customer/:customerId", protect, getImagesByCustomer);
router.get("/order/:orderId", protect, getImagesByOrder);
router.delete("/:id", protect, deleteDesignImage);

module.exports = router;
