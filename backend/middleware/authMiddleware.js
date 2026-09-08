const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");

// Checks that a valid staff/owner JWT was sent and attaches the user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== "staff") {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (!req.user.isActive) {
        return res
          .status(403)
          .json({ message: "Your account has been disabled" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Only allows the owner role through
const ownerOnly = (req, res, next) => {
  if (req.user && req.user.role === "owner") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Owner only." });
  }
};

const designerOnly = (req, res, next) => {
  if (req.user && req.user.role === "designer") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Access denied. Designer account required." });
  }
};

const operationsOnly = (req, res, next) => {
  if (req.user && ["owner", "staff"].includes(req.user.role)) {
    next();
  } else {
    return res.status(403).json({ message: "Access denied for this account." });
  }
};

// Checks that a valid Customer Portal JWT was sent and attaches the customer to req.customer.
// This is completely separate from the staff/owner "protect" above, so a customer
// token can never be used to reach admin routes and vice versa.
const protectCustomer = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.type !== "customer") {
        return res.status(401).json({ message: "Not authorized" });
      }

      req.customer = await Customer.findById(decoded.id);

      if (!req.customer) {
        return res.status(401).json({ message: "Customer not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = {
  protect,
  ownerOnly,
  designerOnly,
  operationsOnly,
  protectCustomer,
};
