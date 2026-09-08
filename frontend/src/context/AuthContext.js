import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Wraps the whole app so any component can know who is logged in
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('boutiqUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('boutiqUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('boutiqUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Simple hook so pages can do: const { user, logout } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
