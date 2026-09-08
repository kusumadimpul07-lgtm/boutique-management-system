const DesignImage = require("../models/DesignImage");
const Order = require("../models/Order");
const User = require("../models/User");

// @desc    Upload a design / reference image
// @route   POST /api/designs
const uploadDesignImage = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please select an image to upload" });
    }

    const { customer, order, caption, price, designer, category, isCatalog } =
      req.body;

    const image = await DesignImage.create({
      customer,
      order,
      caption,
      price: Number(price) > 0 ? Number(price) : 0,
      designer,
      category,
      isCatalog: Boolean(isCatalog) && !customer && !order,
      imageUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all images for a customer
// @route   GET /api/designs/customer/:customerId
const getImagesByCustomer = async (req, res) => {
  try {
    const images = await DesignImage.find({
      customer: req.params.customerId,
    }).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all images for an order
// @route   GET /api/designs/order/:orderId
const getImagesByOrder = async (req, res) => {
  try {
    const images = await DesignImage.find({ order: req.params.orderId }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an image
// @route   DELETE /api/designs/:id
const deleteDesignImage = async (req, res) => {
  try {
    const image = await DesignImage.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    if (
      req.user.role === "designer" &&
      String(image.designerId) !== String(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "You can only remove your own designs" });
    }
    await image.deleteOne();
    res.json({ message: "Image removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get design images for one of the logged-in customer's orders
// @route   GET /api/customer-portal/orders/:orderId/designs
const getMyImagesByOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order || String(order.customer) !== String(req.customer._id)) {
      return res.status(404).json({ message: "Order not found" });
    }

    const images = await DesignImage.find({ order: req.params.orderId }).sort({
      createdAt: -1,
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadCustomerReferences = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      customer: req.customer._id,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!req.files || req.files.length === 0)
      return res
        .status(400)
        .json({ message: "Please select at least one image" });

    const images = await DesignImage.insertMany(
      req.files.map((file) => ({
        customer: req.customer._id,
        order: order._id,
        imageUrl: `/uploads/${file.filename}`,
        caption: "Customer reference",
      })),
    );
    res.status(201).json(images);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get designs available for customers to use as inspiration
// @route   GET /api/customer-portal/designs
const getCustomerCatalog = async (req, res) => {
  try {
    const designs = await DesignImage.find({
      isCatalog: true,
      order: { $exists: false },
      price: { $gt: 0 },
    })
      .select("imageUrl caption price designer designerId category createdAt")
      .populate("designerId", "name profilePicture")
      .sort({ createdAt: -1 });
    res.json(
      designs.map((design) => ({
        ...design.toObject(),
        designerId: design.designerId?._id || design.designerId,
        designerProfilePicture: design.designerId?.profilePicture,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all catalog designs for owner/staff management
// @route   GET /api/designs/catalog
const getCatalogDesigns = async (req, res) => {
  try {
    const filter = {
      isCatalog: true,
      order: { $exists: false },
    };
    if (req.user.role === "designer") filter.designerId = req.user._id;
    const designs = await DesignImage.find(filter).sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a customer-facing catalog design
// @route   POST /api/designs/catalog
const createCatalogDesign = async (req, res) => {
  try {
    if (!["owner", "designer"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only owners and designers can publish catalog designs",
      });
    }
    if (!req.file)
      return res.status(400).json({ message: "Please select a design image" });
    const { caption, price, designer, category, designerId } = req.body;
    let assignedDesignerId =
      req.user.role === "designer" ? req.user._id : designerId;
    let designerName = req.user.role === "designer" ? req.user.name : designer;
    if (req.user.role === "owner") {
      const assignedDesigner = await User.findOne({
        _id: designerId,
        role: "designer",
        isActive: true,
      });
      if (!assignedDesigner) {
        return res
          .status(400)
          .json({ message: "Select an active designer account" });
      }
      assignedDesignerId = assignedDesigner._id;
      designerName = assignedDesigner.name;
    }
    if (!Number(price) || Number(price) <= 0 || !designerName || !category) {
      return res
        .status(400)
        .json({ message: "Designer, category and a price are required" });
    }
    const design = await DesignImage.create({
      caption,
      price: Number(price),
      designer: designerName,
      designerId: assignedDesignerId,
      category,
      isCatalog: true,
      imageUrl: `/uploads/${req.file.filename}`,
      uploadedBy: req.user._id,
    });
    res.status(201).json(design);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDesignImage,
  getImagesByCustomer,
  getImagesByOrder,
  deleteDesignImage,
  getMyImagesByOrder,
  uploadCustomerReferences,
  getCustomerCatalog,
  getCatalogDesigns,
  createCatalogDesign,
};
