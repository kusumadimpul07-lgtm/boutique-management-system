import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";
import PrivateRoute from "./components/PrivateRoute";
import CustomerPrivateRoute from "./components/CustomerPrivateRoute";
import Layout from "./components/Layout";
import CustomerLayout from "./components/CustomerLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomerDetails from "./pages/CustomerDetails";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Deliveries from "./pages/Deliveries";
import Payments from "./pages/Payments";
import Staff from "./pages/Staff";
import Settings from "./pages/Settings";
import AIAssistant from "./pages/AIAssistant";
import Catalog from "./pages/Catalog";
import DesignerOrders from "./pages/DesignerOrders";
import NotFound from "./pages/NotFound";

import CustomerLogin from "./pages/customer/CustomerLogin";
import CustomerOrders from "./pages/customer/CustomerOrders";
import CustomerOrderDetail from "./pages/customer/CustomerOrderDetail";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerOrderRequest from "./pages/customer/CustomerOrderRequest";
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerAIAssistant from "./pages/customer/CustomerAIAssistant";

function App() {
  return (
    <AuthProvider>
      <CustomerAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* ---------- Staff / Owner admin area ---------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/designer-login" element={<Login designerOnly />} />
            <Route
              path="/designer/orders/:id?"
              element={
                <PrivateRoute allowedRoles={["designer"]}>
                  <Layout>
                    <DesignerOrders />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["owner", "staff"]}>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <PrivateRoute>
                  <Layout>
                    <Customers />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <CustomerDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Layout>
                    <Orders />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <OrderDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/deliveries"
              element={
                <PrivateRoute>
                  <Layout>
                    <Deliveries />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <PrivateRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <PrivateRoute ownerOnly={true}>
                  <Layout>
                    <Staff />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/catalog"
              element={
                <PrivateRoute allowedRoles={["owner", "designer"]}>
                  <Layout>
                    <Catalog />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/ai-assistant"
              element={
                <PrivateRoute>
                  <Layout>
                    <AIAssistant />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* ---------- Customer Portal ---------- */}
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route
              path="/customer/home"
              element={
                <CustomerPrivateRoute>
                  <CustomerLayout>
                    <CustomerHome />
                  </CustomerLayout>
                </CustomerPrivateRoute>
              }
            />
            <Route
              path="/customer/orders"
              element={
                <CustomerPrivateRoute>
                  <CustomerLayout>
                    <CustomerOrders />
                  </CustomerLayout>
                </CustomerPrivateRoute>
              }
            />
            <Route
              path="/customer/order-request"
              element={
                <CustomerPrivateRoute>
                  <CustomerLayout>
                    <CustomerOrderRequest />
                  </CustomerLayout>
                </CustomerPrivateRoute>
              }
            />
            <Route
              path="/customer/orders/:id"
              element={
                <CustomerPrivateRoute>
                  <CustomerLayout>
                    <CustomerOrderDetail />
                  </CustomerLayout>
                </CustomerPrivateRoute>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <CustomerPrivateRoute>
                  <CustomerLayout>
                    <CustomerProfile />
                  </CustomerLayout>
                </CustomerPrivateRoute>
              }
            />
            <Route
              path="/customer/assistant"
              element={
                <CustomerPrivateRoute>
                  <CustomerLayout>
                    <CustomerAIAssistant />
                  </CustomerLayout>
                </CustomerPrivateRoute>
              }
            />

            <Route path="/" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CustomerAuthProvider>
    </AuthProvider>
  );
}

export default App;
