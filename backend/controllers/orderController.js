const Order = require("../models/Order");
const DesignImage = require("../models/DesignImage");
const User = require("../models/User");
const Notification = require("../models/Notification");

const CUSTOM_SERVICE_PRICES = [
  { id: "blouse", name: "Custom blouse", price: 1200 },
  { id: "salwar", name: "Custom salwar suit", price: 2200 },
  { id: "dress", name: "Custom dress", price: 2500 },
  { id: "saree", name: "Saree stitching", price: 1800 },
  { id: "lehenga", name: "Custom lehenga", price: 4500 },
  { id: "kurti", name: "Custom kurti", price: 1400 },
  { id: "gown", name: "Custom gown", price: 3200 },
  { id: "bridal", name: "Bridal outfit", price: 8500 },
  { id: "mens-wear", name: "Men's ethnic wear", price: 2800 },
  { id: "kids-wear", name: "Kids wear", price: 1000 },
  { id: "alteration", name: "Alteration service", price: 500 },
];

// Generates a simple, readable order number like ORD1001
const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  return `ORD${1000 + count + 1}`;
};

// @desc    Create a new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      customer,
      items,
      totalAmount,
      advanceAmount,
      deliveryDate,
      notes,
      measurement,
    } = req.body;

    if (!customer || !items || !totalAmount) {
      return res
        .status(400)
        .json({ message: "Customer, items and total amount are required" });
    }

    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customer,
      items,
      totalAmount,
      advanceAmount,
      deliveryDate,
      notes,
      measurement,
      createdBy: req.user._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for one customer (used by the admin customer detail page)
// @route   GET /api/orders/customer/:customerId
const getOrdersByCustomer = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.params.customerId }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single order
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("assignedDesigner", "name");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an order (status, amounts, items, etc.)
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const previousStatus = order.status;
    const previousDesigner = order.assignedDesigner
      ? String(order.assignedDesigner)
      : "";
    const fields = [
      "items",
      "totalAmount",
      "advanceAmount",
      "status",
      "deliveryDate",
      "notes",
    ];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    });

    if (req.body.assignedDesigner !== undefined) {
      const designer = await User.findOne({
        _id: req.body.assignedDesigner,
        role: "designer",
        isActive: true,
      }).select("_id name");
      if (!designer)
        return res
          .status(400)
          .json({ message: "Please select an active designer" });
      order.assignedDesigner = designer._id;
    }

    if (String(order.assignedDesigner || "") !== previousDesigner) {
      const designer = await User.findById(order.assignedDesigner).select(
        "name",
      );
      order.statusHistory.push({
        status: order.status,
        note: `Assigned to ${designer ? designer.name : "designer"}`,
        changedBy: req.user._id,
        changedByRole: req.user.role,
      });
      if (designer) {
        await Notification.create({
          user: designer._id,
          type: "new_assignment",
          title: "Order assigned to you",
          message: `${order.orderNumber} is now assigned to your workroom.`,
          order: order._id,
        });
      }
    }

    if (order.status !== previousStatus) {
      order.statusHistory.push({
        status: order.status,
        note: req.body.notes
          ? String(req.body.notes).trim()
          : "Order status updated",
        changedBy: req.user._id,
        changedByRole: req.user.role,
      });
      await Notification.create({
        customer: order.customer,
        type: "order_update",
        title: `Order ${order.status}`,
        message: `${order.orderNumber} is now marked ${order.status}.`,
        order: order._id,
      });
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    await order.deleteOne();
    res.json({ message: "Order removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAssignableDesigners = async (req, res) => {
  try {
    const designers = await User.find({ role: "designer", isActive: true })
      .select("_id name")
      .sort({ name: 1 });
    res.json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Customer Portal versions (scoped to the logged-in customer) ----------

// @desc    Get all orders belonging to the logged-in customer
// @route   GET /api/customer-portal/orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.customer._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single order, only if it belongs to the logged-in customer
// @route   GET /api/customer-portal/orders/:id
const getMyOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || String(order.customer) !== String(req.customer._id)) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit a custom order request from the customer portal
// @route   POST /api/customer-portal/orders
const createMyOrderRequest = async (req, res) => {
  try {
    const {
      items,
      notes,
      deliveryDate,
      measurement,
      designId,
      designerId,
      serviceType,
      quantity,
    } = req.body;
    const requestedQuantity = Number(quantity || 1);

    if (!items || !items.trim()) {
      return res
        .status(400)
        .json({ message: "Please describe what you would like to order" });
    }

    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity < 1 ||
      requestedQuantity > 20
    ) {
      return res
        .status(400)
        .json({ message: "Quantity must be a whole number between 1 and 20" });
    }

    let unitPrice;
    let selectedDesign;
    let assignedDesigner;
    if (designId) {
      selectedDesign = await DesignImage.findOne({
        _id: designId,
        isCatalog: true,
        order: { $exists: false },
        price: { $gt: 0 },
      });
      if (!selectedDesign) {
        return res
          .status(400)
          .json({ message: "That design is no longer available" });
      }
      if (
        designerId &&
        String(selectedDesign.designerId) !== String(designerId)
      ) {
        return res.status(400).json({
          message: "The selected design does not belong to that designer",
        });
      }
      assignedDesigner = selectedDesign.designerId;
      if (!assignedDesigner) {
        return res.status(400).json({
          message: "This design is not assigned to an active designer",
        });
      }
      unitPrice = selectedDesign.price;
    } else {
      const service = CUSTOM_SERVICE_PRICES.find(
        (option) => option.id === serviceType,
      );
      if (!service) {
        return res
          .status(400)
          .json({ message: "Please select a custom service" });
      }
      assignedDesigner = await User.findOne({
        _id: designerId,
        role: "designer",
        isActive: true,
      }).select("_id");
      if (!assignedDesigner) {
        return res
          .status(400)
          .json({ message: "Please select an active designer" });
      }
      unitPrice = service.price;
    }

    const orderNumber = await generateOrderNumber();
    const order = await Order.create({
      orderNumber,
      customer: req.customer._id,
      items: items.trim(),
      design: selectedDesign ? selectedDesign._id : undefined,
      assignedDesigner: assignedDesigner._id,
      quantity: requestedQuantity,
      totalAmount: unitPrice * requestedQuantity,
      deliveryDate: deliveryDate || undefined,
      notes: notes ? notes.trim() : undefined,
      measurement: measurement || undefined,
      statusHistory: [
        {
          status: "Pending",
          note: "Order request created",
          changedByRole: "customer",
        },
      ],
    });

    await Notification.create([
      {
        customer: req.customer._id,
        type: "order_update",
        title: "Order request received",
        message: `${order.orderNumber} has been sent to the studio.`,
        order: order._id,
      },
      {
        user: assignedDesigner._id,
        type: "new_assignment",
        title: "New order assigned",
        message: `${order.orderNumber} is ready for your review.`,
        order: order._id,
      },
    ]);

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the customer-facing custom service price list
// @route   GET /api/customer-portal/pricing
const getCustomerPricing = (req, res) => {
  res.json(CUSTOM_SERVICE_PRICES);
};

const getCustomerDesigners = async (req, res) => {
  try {
    const designers = await User.find({ role: "designer", isActive: true })
      .select("_id name")
      .sort({ name: 1 });
    res.json(designers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDesignerOrders = async (req, res) => {
  try {
    const designerDesigns = await DesignImage.find({
      designerId: req.user._id,
      isCatalog: true,
    }).select("_id");
    const orders = await Order.find({
      $or: [
        { assignedDesigner: req.user._id },
        { design: { $in: designerDesigns.map((design) => design._id) } },
      ],
    })
      .populate("customer", "name phone")
      .populate("assignedDesigner", "name profilePicture")
      .populate("design", "caption category designer imageUrl")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDesignerOrderById = async (req, res) => {
  try {
    const designerDesigns = await DesignImage.find({
      designerId: req.user._id,
      isCatalog: true,
    }).select("_id");
    const order = await Order.findOne({
      _id: req.params.id,
      $or: [
        { assignedDesigner: req.user._id },
        { design: { $in: designerDesigns.map((design) => design._id) } },
      ],
    })
      .populate("customer", "name phone address")
      .populate("assignedDesigner", "name profilePicture")
      .populate("design", "caption category designer imageUrl price");
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDesignerOrder = async (req, res) => {
  try {
    const designerDesigns = await DesignImage.find({
      designerId: req.user._id,
      isCatalog: true,
    }).select("_id");
    const order = await Order.findOne({
      _id: req.params.id,
      $or: [
        { assignedDesigner: req.user._id },
        { design: { $in: designerDesigns.map((design) => design._id) } },
      ],
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const previousStatus = order.status;
    if (req.body.status !== undefined) {
      const allowedStatuses = [
        "Pending",
        "In Progress",
        "Ready",
        "Completed",
        "Cancelled",
      ];
      if (!allowedStatuses.includes(req.body.status)) {
        return res.status(400).json({ message: "Invalid production status" });
      }
      order.status = req.body.status;
    }
    if (req.body.notes !== undefined)
      order.notes = String(req.body.notes).trim();
    if (req.body.deliveryDate !== undefined)
      order.deliveryDate = req.body.deliveryDate || undefined;

    if (order.status !== previousStatus) {
      order.statusHistory.push({
        status: order.status,
        note: req.body.notes
          ? String(req.body.notes).trim()
          : "Production status updated",
        changedBy: req.user._id,
        changedByRole: req.user.role,
      });
      await Notification.create({
        customer: order.customer,
        type: "order_update",
        title: `Order ${order.status}`,
        message: `${order.orderNumber} is now marked ${order.status}.`,
        order: order._id,
      });
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getMyOrderById,
  createMyOrderRequest,
  getCustomerPricing,
  getCustomerDesigners,
  getDesignerOrders,
  getDesignerOrderById,
  updateDesignerOrder,
  getAssignableDesigners,
};
