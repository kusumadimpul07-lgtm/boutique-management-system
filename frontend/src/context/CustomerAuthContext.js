import React, { createContext, useState, useEffect, useContext } from 'react';

// This is completely separate from AuthContext (staff/owner), with its own
// localStorage key, so an admin session and a customer session can never
// get mixed up with each other.
const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('boutiqCustomer');
    if (stored) {
      setCustomer(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (customerData) => {
    localStorage.setItem('boutiqCustomer', JSON.stringify(customerData));
    setCustomer(customerData);
  };

  const logout = () => {
    localStorage.removeItem('boutiqCustomer');
    setCustomer(null);
  };

  return (
    <CustomerAuthContext.Provider value={{ customer, login, logout, loading }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  return useContext(CustomerAuthContext);
}
