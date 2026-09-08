const Delivery = require('../models/Delivery');
const Order = require('../models/Order');

// @desc    Create or update the delivery info for an order
// @route   POST /api/deliveries
const createDelivery = async (req, res) => {
  try {
    const { order, status, deliveryAddress, scheduledDate } = req.body;

    if (!order) {
      return res.status(400).json({ message: 'Order is required' });
    }

    let delivery = await Delivery.findOne({ order });

    if (delivery) {
      delivery.status = status || delivery.status;
      delivery.deliveryAddress = deliveryAddress ?? delivery.deliveryAddress;
      delivery.scheduledDate = scheduledDate ?? delivery.scheduledDate;

      if (status === 'Delivered') {
        delivery.deliveredDate = new Date();
        delivery.deliveredBy = req.user._id;
      }

      delivery = await delivery.save();
    } else {
      delivery = await Delivery.create({
        order,
        status,
        deliveryAddress,
        scheduledDate,
        deliveredDate: status === 'Delivered' ? new Date() : undefined,
        deliveredBy: status === 'Delivered' ? req.user._id : undefined,
      });
    }

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all deliveries
// @route   GET /api/deliveries
const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()
      .populate({ path: 'order', populate: { path: 'customer', select: 'name phone' } })
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get the delivery info for one order
// @route   GET /api/deliveries/order/:orderId
const getDeliveryByOrder = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ order: req.params.orderId });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get delivery info for one of the logged-in customer's orders
// @route   GET /api/customer-portal/orders/:orderId/delivery
const getMyDeliveryByOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order || String(order.customer) !== String(req.customer._id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const delivery = await Delivery.findOne({ order: req.params.orderId });
    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createDelivery, getDeliveries, getDeliveryByOrder, getMyDeliveryByOrder };
