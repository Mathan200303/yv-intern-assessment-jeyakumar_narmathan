import React, { createContext, useState, useEffect } from 'react';
import { getMe } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getMe();
          setUser({ ...res.data.data.profile, permissions: res.data.data.permissions });
        } catch (error) {
          console.error(error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.userType === 'CHAIRMAN') return true;
    return user.permissions?.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};
