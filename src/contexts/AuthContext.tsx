import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Helper } from '../types';
import { mockHelpers, mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | Helper | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User | Helper>) => Promise<boolean>;
  isHelper: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | Helper | null>(null);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const allUsers = [...mockUsers, ...mockHelpers];
    const foundUser = allUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  const register = async (userData: Partial<User | Helper>): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const newUser: User | Helper = {
      id: Date.now().toString(),
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      zipCode: userData.zipCode || '',
      role: userData.role || 'poster',
      createdAt: new Date().toISOString(),
      ...userData
    } as User | Helper;

    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    return true;
  };

  const isHelper = user?.role === 'helper';

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isHelper }}>
      {children}
    </AuthContext.Provider>
  );
};