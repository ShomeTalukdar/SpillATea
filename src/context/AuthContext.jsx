import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser } from '../services/db';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser());

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    setCurrentUser(updated);
  };

  const toggleAdminRole = () => {
    const nextRole = user.role === 'admin' ? 'student' : 'admin';
    updateUser({ role: nextRole });
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, toggleAdminRole, isAdmin: user.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
