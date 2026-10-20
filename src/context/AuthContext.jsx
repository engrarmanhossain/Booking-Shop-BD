import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEFAULT_ADMIN = {
  id: 'user-admin',
  name: 'Engr. Arman Hossain',
  email: 'armanhossain.eee.info@gmail.com',
  phone: '01819000000',
  password: 'arman2026**',
  role: 'admin',
  createdAt: '2026-10-20'
};

const INITIAL_USERS = [
  DEFAULT_ADMIN,
  {
    id: 'user-landlord-1',
    name: 'Haji Mohammad Rafiq',
    email: 'rafiq@mirsarai.com',
    phone: '01819345678',
    password: 'password123',
    role: 'landlord',
    createdAt: '2026-10-14'
  },
  {
    id: 'user-renter-1',
    name: 'Tareq Hasan',
    email: 'tareq@gmail.com',
    phone: '01822334455',
    password: 'password123',
    role: 'renter',
    createdAt: '2026-10-18'
  }
];

export function AuthProvider({ children }) {
  // All registered users (localStorage persisted)
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('tolet_mirsarai_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure admin is always present and updated
        const adminExists = parsed.some((u) => u.email === DEFAULT_ADMIN.email);
        if (!adminExists) {
          parsed.unshift(DEFAULT_ADMIN);
        } else {
          // keep admin password fresh
          const idx = parsed.findIndex((u) => u.email === DEFAULT_ADMIN.email);
          parsed[idx] = { ...parsed[idx], ...DEFAULT_ADMIN };
        }
        return parsed;
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current logged in user (localStorage persisted)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('tolet_mirsarai_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem('tolet_mirsarai_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tolet_mirsarai_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tolet_mirsarai_current_user');
    }
  }, [currentUser]);

  // Login with Email OR Phone Number
  const login = (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const foundUser = users.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchPhone = u.phone && u.phone.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
      return (matchEmail || matchPhone) && u.password === cleanPass;
    });

    if (foundUser) {
      setCurrentUser(foundUser);
      return { success: true, user: foundUser };
    }

    return { success: false, message: 'Invalid credentials' };
  };

  // Register with Phone OR Email
  const register = ({ name, identifier, password, role = 'renter' }) => {
    const cleanId = (identifier || '').trim();
    const isEmail = cleanId.includes('@');
    const email = isEmail ? cleanId.toLowerCase() : '';
    const phone = !isEmail ? cleanId : '';

    // Check if user already exists
    const exists = users.some((u) => {
      if (isEmail && u.email && u.email.toLowerCase() === email) return true;
      if (!isEmail && u.phone && u.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')) return true;
      return false;
    });

    if (exists) {
      return { 
        success: false, 
        message: isEmail ? 'Email is already registered' : 'Phone number is already registered' 
      };
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email,
      phone,
      password: password.trim(),
      role, // 'admin', 'landlord', 'renter'
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const quickAdminLogin = () => {
    return login(DEFAULT_ADMIN.email, DEFAULT_ADMIN.password);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isLandlord = currentUser?.role === 'landlord' || isAdmin;
  const isRenter = currentUser?.role === 'renter';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        login,
        register,
        logout,
        quickAdminLogin,
        isAdmin,
        isLandlord,
        isRenter
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
