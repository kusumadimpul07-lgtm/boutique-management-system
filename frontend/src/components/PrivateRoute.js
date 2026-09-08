import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any page with this to require login (and optionally owner-only access)
function PrivateRoute({ children, ownerOnly, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (ownerOnly && user.role !== "owner") {
    return <Navigate to="/dashboard" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PrivateRoute;
