const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

// @desc    Get summary stats for the dashboard
// @route   GET /api/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Pending", "In Progress"] },
    });

    const payments = await Payment.find();
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    const paidByOrder = payments.reduce((totals, payment) => {
      const orderId = String(payment.order);
      totals[orderId] = (totals[orderId] || 0) + payment.amount;
      return totals;
    }, {});
    const orders = await Order.find()
      .populate("customer", "name")
      .populate("assignedDesigner", "name");
    const outstandingBalance = orders.reduce(
      (sum, order) =>
        Math.max(
          0,
          sum + order.totalAmount - (paidByOrder[String(order._id)] || 0),
        ),
      0,
    );
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const overdueOrders = orders.filter(
      (order) =>
        order.deliveryDate &&
        order.deliveryDate < today &&
        !["Delivered", "Completed", "Cancelled"].includes(order.status),
    );
    const designerWorkload = orders.reduce((workload, order) => {
      if (order.assignedDesigner) {
        const key = String(order.assignedDesigner._id);
        if (!workload[key])
          workload[key] = {
            name: order.assignedDesigner.name,
            activeOrders: 0,
            completedOrders: 0,
          };
        if (["Delivered", "Completed"].includes(order.status))
          workload[key].completedOrders += 1;
        else if (order.status !== "Cancelled") workload[key].activeOrders += 1;
      }
      return workload;
    }, {});
    const upcomingDeliveries = orders
      .filter(
        (order) =>
          order.deliveryDate &&
          order.deliveryDate >= new Date() &&
          !["Delivered", "Cancelled"].includes(order.status),
      )
      .sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate))
      .slice(0, 5);

    const recentOrders = await Order.find()
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalCustomers,
      totalOrders,
      pendingOrders,
      totalRevenue,
      outstandingBalance,
      overdueOrders,
      designerWorkload: Object.values(designerWorkload),
      upcomingDeliveries,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
