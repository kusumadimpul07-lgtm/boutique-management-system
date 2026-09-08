const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded design/reference images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/measurements", require("./routes/measurementRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/deliveries", require("./routes/deliveryRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/designs", require("./routes/designRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/customer-auth", require("./routes/customerAuthRoutes"));
app.use("/api/customer-portal", require("./routes/customerPortalRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.get("/", (req, res) => {
  res.send("BOUTIQ Management System API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
