const crypto = require('crypto');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

// @desc    Record a payment received from a customer (staff/owner use)
// @route   POST /api/payments
const createPayment = async (req, res) => {
  try {
    const { order, customer, amount, method, status, notes } = req.body;

    if (!order || !customer || !amount) {
      return res.status(400).json({ message: 'Order, customer and amount are required' });
    }

    const payment = await Payment.create({
      order, customer, amount, method, status, notes,
      source: 'Staff Recorded',
      receivedBy: req.user._id,
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('order', 'orderNumber')
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments for one order
// @route   GET /api/payments/order/:orderId
const getPaymentsByOrder = async (req, res) => {
  try {
    const payments = await Payment.find({ order: req.params.orderId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Customer Portal: viewing ----------

// @desc    Get payments for one of the logged-in customer's orders
// @route   GET /api/customer-portal/orders/:orderId/payments
const getMyPaymentsByOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order || String(order.customer) !== String(req.customer._id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const payments = await Payment.find({ order: req.params.orderId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Customer Portal: online payment via Razorpay ----------
// This whole section is optional. If RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET
// are not set in .env, "available" is simply false and the customer is
// shown a "pay at the shop" message instead - nothing else breaks.

// @desc    Check whether online payment is configured
// @route   GET /api/customer-portal/payments/status
const checkPaymentGatewayStatus = (req, res) => {
  const available = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  res.json({ available });
};

// @desc    Start an online payment: creates a Razorpay order for the given amount
// @route   POST /api/customer-portal/payments/create-order
const createRazorpayOrder = async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(503).json({ message: 'Online payment is not set up yet. Please pay the shop directly.' });
  }

  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount || Number(amount) <= 0) {
      return res.status(400).json({ message: 'Order and a valid amount are required' });
    }

    const order = await Order.findById(orderId);

    if (!order || String(order.customer) !== String(req.customer._id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Do not let anyone start an online payment for more than what is actually owed
    const existingPayments = await Payment.find({ order: orderId });
    const alreadyPaid = existingPayments.reduce((sum, p) => sum + p.amount, 0);
    const balance = order.totalAmount - alreadyPaid;

    if (Number(amount) > balance) {
      return res.status(400).json({ message: `Amount cannot be more than the balance due (Rs. ${balance})` });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(Number(amount) * 100), // Razorpay expects paise, not rupees
        currency: 'INR',
        receipt: `${order.orderNumber}-${Date.now()}`,
      }),
    });

    const data = await razorpayRes.json();

    if (!razorpayRes.ok) {
      console.error('Razorpay order creation failed:', data);
      return res.status(500).json({ message: 'Could not start online payment. Please try again.' });
    }

    res.json({
      razorpayOrderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId, // safe to expose - this is Razorpay's public key, not the secret
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not start online payment. Please try again.' });
  }
};

// @desc    Verify a completed Razorpay payment and record it
// @route   POST /api/customer-portal/payments/verify
const verifyRazorpayPayment = async (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return res.status(503).json({ message: 'Online payment is not set up yet.' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Confirm the payment genuinely came from Razorpay for this exact order
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.findById(orderId);

    if (!order || String(order.customer) !== String(req.customer._id)) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ask Razorpay for the authoritative amount actually paid, rather than
    // trusting a number sent from the browser
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const rzpOrderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const rzpOrder = await rzpOrderRes.json();

    if (!rzpOrderRes.ok) {
      return res.status(500).json({ message: 'Could not confirm the payment with Razorpay' });
    }

    const amountPaid = rzpOrder.amount / 100; // paise back to rupees

    const payment = await Payment.create({
      order: orderId,
      customer: req.customer._id,
      amount: amountPaid,
      method: 'Online (Razorpay)',
      status: 'Paid',
      source: 'Online Payment',
      razorpayPaymentId: razorpay_payment_id,
      notes: 'Paid online by the customer through the Customer Portal',
    });

    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not verify the payment' });
  }
};

module.exports = {
  createPayment, getPayments, getPaymentsByOrder,
  getMyPaymentsByOrder, checkPaymentGatewayStatus, createRazorpayOrder, verifyRazorpayPayment,
};
