import React from 'react';
import { Navigate } from 'react-router-dom';
import { useCustomerAuth } from '../context/CustomerAuthContext';

// Same idea as PrivateRoute.js, but checks the customer's own login state
function CustomerPrivateRoute({ children }) {
  const { customer, loading } = useCustomerAuth();

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!customer) {
    return <Navigate to="/customer-login" />;
  }

  return children;
}

export default CustomerPrivateRoute;
